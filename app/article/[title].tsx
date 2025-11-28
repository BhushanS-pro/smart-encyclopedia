import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FooterNav from "@/components/FooterNav";
import { useColorScheme } from "@/components/useColorScheme";
import { EncyclopediaEntry, getEncyclopediaEntry } from "@/lib/wiki";

const FALLBACK_IMAGE = "https://smartencyclopedia.uk/default-article.png";

export default function ArticleScreen() {
  const { title } = useLocalSearchParams();
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";

  // Decode URL title
  const decoded = useMemo(
    () => decodeURIComponent(Array.isArray(title) ? title[0] : title || ""),
    [title]
  );

  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set screen title
  useEffect(() => {
    navigation.setOptions({ title: decoded || "Loading..." });
  }, [decoded]);

  // Load local content
  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await getEncyclopediaEntry(decoded);
        if (active) {
          setEntry(data);
          navigation.setOptions({ title: data.title });
        }
      } catch {
        if (active) setError("This article does not exist yet.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [decoded]);

  // ⭐ Inject SEO Article Structured Data
  const articleSchema = useMemo(
    () =>
      entry
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: entry.description || entry.extract.substring(0, 160),
            image: entry.imageUrl || FALLBACK_IMAGE,
            url: `https://smartencyclopedia.uk/article/${encodeURIComponent(
              entry.title
            )}`,
            author: "Smart Encyclopedia",
            publisher: {
              "@type": "Organization",
              name: "Smart Encyclopedia",
              logo: {
                "@type": "ImageObject",
                url: "https://smartencyclopedia.uk/icon.png",
              },
            },
          }
        : null,
    [entry]
  );

  // ========= Loading UI =========
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? "#020617" : "#f8fafc" }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10, color: "#ccc" }}>Loading article…</Text>
      </View>
    );
  }

  // ========= Error UI =========
  if (error || !entry) {
    return (
      <View style={[styles.center, { backgroundColor: isDark ? "#020617" : "#f8fafc" }]}>
        <Text style={{ color: "#f87171", fontSize: 16 }}>{error}</Text>

        <Pressable
          style={styles.retryBtn}
          onPress={() => {
            setError(null);
            setLoading(true);

            getEncyclopediaEntry(decoded)
              .then((data) => {
                setEntry(data);
                setLoading(false);
              })
              .catch(() => setError("Still not found."));
          }}
        >
          <Text style={{ color: isDark ? "white" : "black" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  // ========= ARTICLE UI =========
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* JSON-LD structured markup */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <Image source={{ uri: entry.imageUrl || FALLBACK_IMAGE }} style={styles.hero} />

      <View style={[styles.card, { backgroundColor: isDark ? "#0f172a" : "white" }]}>
        <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>{entry.title}</Text>

        {entry.description && (
          <Text style={[styles.description, { color: isDark ? "#cbd5f5" : "#444" }]}>
            {entry.description}
          </Text>
        )}

        <Text style={[styles.extract, { color: isDark ? "#eee" : "#222" }]}>
          {entry.extract}
        </Text>

        {/* In-article ad */}

        {entry.sections?.map((sec) => (
          <View key={sec.id} style={{ marginTop: 22 }}>
            <Text style={[styles.heading, { color: isDark ? "#fff" : "#111" }]}>
              {sec.title}
            </Text>
            <Text style={[styles.content, { color: isDark ? "#cbd5f5" : "#222" }]}>
              {sec.content}
            </Text>
          </View>
        ))}
      </View>

      <FooterNav />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 260 },
  card: { margin: 16, padding: 24, borderRadius: 18 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 16 },
  extract: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  content: { fontSize: 16, lineHeight: 22 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  retryBtn: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#1e3a8a",
    borderRadius: 8,
  },
});
