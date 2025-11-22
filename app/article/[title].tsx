import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import DummyAd from '@/components/DummyAd';
import FooterNav from '@/components/FooterNav';
import { useColorScheme } from '@/components/useColorScheme';
import { EncyclopediaEntry, getEncyclopediaEntry } from '@/lib/wiki';
import { Pressable } from 'react-native';

const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png';

export default function ArticleScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';

  const requestedTitle = Array.isArray(params.title) ? params.title[0] : params.title ?? '';
  const decodedTitle = useMemo(() => decodeURIComponent(requestedTitle), [requestedTitle]);

  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastErrorDetail, setLastErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: decodedTitle || 'Encyclopedia Entry' });
  }, [decodedTitle, navigation]);

  useEffect(() => {
    let isActive = true;

    const loadEntry = async () => {
      if (!decodedTitle) {
        setError('Missing article title.');
        return;
      }

      setIsLoading(true);
      setError(null);
      setLastErrorDetail(null);
      try {
        const data = await getEncyclopediaEntry(decodedTitle);
        if (isActive) {
          setEntry(data);
          navigation.setOptions({ title: data.title });
        }
      } catch (err) {
        if (isActive) {
          const message = err instanceof Error ? err.message : String(err);
          setLastErrorDetail(message);
          setError(`We could not load this entry right now. (${message})`);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadEntry();
    return () => {
      isActive = false;
    };
  }, [decodedTitle, navigation]);

  // ✅ ARTICLE SCHEMA - Auto SEO
  const articleSchema = useMemo(
    () =>
      entry
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: entry.title,
            description: entry.description,
            image: entry.imageUrl || entry.thumbnailUrl,
            url: `https://smartencyclopedia.uk/article/${encodeURIComponent(entry.title)}`,
            author: 'Smart Encyclopedia',
            publisher: {
              '@type': 'Organization',
              name: 'Smart Encyclopedia',
              logo: {
                '@type': 'ImageObject',
                url: 'https://smartencyclopedia.uk/icon.png',
              },
            },
          }
        : null,
    [entry]
  );

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#1d4ed8'} />
        <Text style={[styles.loadingText, { color: isDark ? '#cbd5f5' : '#475569' }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#b91c1c' }]}>{error}</Text>

        {lastErrorDetail && (
          <Text style={{ marginTop: 8, color: isDark ? '#cbd5f5' : '#475569', fontSize: 12 }}>
            Debug: {lastErrorDetail}
          </Text>
        )}

        <Pressable
          style={{
            marginTop: 12,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: isDark ? '#1f2937' : '#eef2ff',
          }}
          onPress={() => {
            setError(null);
            setLastErrorDetail(null);
            setIsLoading(true);
            getEncyclopediaEntry(decodedTitle)
              .then((d) => setEntry(d))
              .catch((err) => setLastErrorDetail(err.message))
              .finally(() => setIsLoading(false));
          }}
        >
          <Text style={{ fontWeight: '600', color: isDark ? '#fff' : '#111' }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!entry) return null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#020617' : '#f8fafc' }}
      contentContainerStyle={styles.contentContainer}
    >
      {/* ============================= */}
      {/* 📌 Inject Article Schema Here */}
      {/* ============================= */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <Image
        source={{ uri: entry.imageUrl ?? entry.thumbnailUrl ?? FALLBACK_IMAGE }}
        style={styles.heroImage}
      />

      <View style={[styles.body, { backgroundColor: isDark ? '#0f172a' : '#fff' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{entry.title}</Text>

        {entry.description && (
          <Text style={[styles.description, { color: isDark ? '#cbd5f5' : '#444' }]}>
            {entry.description}
          </Text>
        )}

        <Text style={[styles.extract, { color: isDark ? '#e2e8f0' : '#222' }]}>
          {entry.extract}
        </Text>

        {/* Ad inside Article */}
        <DummyAd size="banner" adUnitId="article-banner-1" useRealAds={true} />

        {entry.sections.slice(1).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, { color: isDark ? '#cbd5f5' : '#222' }]}>
              {section.content}
            </Text>
          </View>
        ))}

        {entry.url && (
          <Text
            style={[styles.externalLink, { color: isDark ? '#93c5fd' : '#2563eb' }]}
            onPress={() => Linking.openURL(entry.url!)}
          >
            Continue reading on Wikipedia →
          </Text>
        )}
      </View>

      {/* FOOTER */}
      <FooterNav />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 60 },
  heroImage: { width: '100%', height: 260 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  body: {
    margin: 16,
    padding: 24,
    borderRadius: 20,
  },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  description: { fontSize: 16, marginBottom: 10 },
  extract: { fontSize: 16, marginBottom: 20, lineHeight: 22 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  sectionContent: { fontSize: 15, lineHeight: 22 },
  externalLink: { marginTop: 30, fontWeight: '700', fontSize: 16 },
  loadingText: { marginTop: 10, fontSize: 16 },
  errorText: { fontSize: 16, textAlign: 'center' },
});
