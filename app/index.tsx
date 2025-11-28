import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CategoryChip } from "@/components/CategoryChip";
import { FeaturedTopicCard } from "@/components/FeaturedTopicCard";
import { ResultCard } from "@/components/ResultCard";
import { SearchBar } from "@/components/SearchBar";
import { useColorScheme } from "@/components/useColorScheme";
import { CATEGORIES, EncyclopediaCategory } from "@/constants/topics";
import { useDebounce } from "@/hooks/useDebounce";
import { searchEncyclopedia, WikiSearchItem } from "@/lib/wiki";

// Local Encyclopedia Content
import articles from "@/content/articles.json";

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  const [results, setResults] = useState<WikiSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<
    EncyclopediaCategory | "Featured"
  >("Featured");

  // 🔍 Online Search
  useEffect(() => {
    let active = true;

    async function run() {
      setIsSearching(true);
      const res = await searchEncyclopedia(debouncedQuery, 20);
      if (active) setResults(res);
      setIsSearching(false);
    }

    if (debouncedQuery.trim().length >= 2) run();
    else setResults([]);

    return () => (active = false);
  }, [debouncedQuery]);

  // 🔎 Filter Local Content by Category
  const filteredTopics = useMemo(() => {
    if (selectedCategory === "Featured") return articles.slice(0, 10);

    return articles.filter(
      (a) =>
        a.category?.toLowerCase().trim() ===
        selectedCategory.toLowerCase().trim()
    );
  }, [selectedCategory]);

  // 🚀 Navigate using slug
  const openArticle = (slug: string) => {
    router.push(`/article/${slug}`);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? "#020617" : "#f8fafc" },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? "#fff" : "#0f172a" }]}>
            Smart Encyclopedia
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? "#94a3b8" : "#475569" },
            ]}
          >
            Search facts, topics and world knowledge.
          </Text>
        </View>

        {/* SEARCH BAR */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          onSubmit={() => setQuery(query.trim())}
        />

        {/* LOADING */}
        {isSearching && (
          <View style={styles.feedbackRow}>
            <ActivityIndicator color="#3b82f6" />
            <Text
              style={[
                styles.feedbackText,
                { color: isDark ? "#cbd5f5" : "#475569" },
              ]}
            >
              Searching...
            </Text>
          </View>
        )}

        {/* SEARCH RESULTS */}
        {debouncedQuery.trim().length >= 2 ? (
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? "#fff" : "#000" },
              ]}
            >
              Results
            </Text>

            {results.length === 0 ? (
              <View style={styles.noResultBox}>
                <Image
                  source={require("@/assets/images/coming-soon.png")}
                  style={styles.noResultImage}
                  resizeMode="contain"
                />
                <Text style={styles.noResultTitle}>
                  Article Coming Soon! 🚀
                </Text>
                <Text style={styles.noResultSubtitle}>
                  We will add this topic very soon! Stay tuned.
                </Text>
              </View>
            ) : (
              results.map((item) => {
                const matchedArticle = articles.find(
                  (a) =>
                    a.title.toLowerCase().trim() ===
                    item.title.toLowerCase().trim()
                );

                return (
                  <ResultCard
                    key={item.id}
                    item={item}
                    onPress={() =>
                      matchedArticle
                        ? openArticle(matchedArticle.slug)
                        : alert("This article will be added soon!")
                    }
                  />
                );
              })
            )}
          </View>
        ) : (
          <>
            {/* CATEGORIES */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Browse Categories
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <CategoryChip
                  label="Featured"
                  isActive={selectedCategory === "Featured"}
                  onPress={() => setSelectedCategory("Featured")}
                />
                {CATEGORIES.map((cat) => (
                  <CategoryChip
                    key={cat}
                    label={cat}
                    isActive={selectedCategory === cat}
                    onPress={() => setSelectedCategory(cat)}
                  />
                ))}
              </ScrollView>
            </View>

            {/* FEATURED */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? "#fff" : "#000" },
                ]}
              >
                Knowledge Spotlight
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {filteredTopics.map((article) => (
                  <FeaturedTopicCard key={article.slug} topic={article} />
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48 },
  header: { marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { fontSize: 16 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  emptyState: { fontStyle: "italic", opacity: 0.7 },
  feedbackRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  feedbackText: { marginLeft: 10 },

  /* NEW STYLES */
  noResultBox: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  noResultImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  noResultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
    textAlign: "center",
  },
  noResultSubtitle: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    marginHorizontal: 10,
  },
});
