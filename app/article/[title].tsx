import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import DummyAd from '@/components/DummyAd';
import { useColorScheme } from '@/components/useColorScheme';
import { EncyclopediaEntry, getEncyclopediaEntry } from '@/lib/wiki';
import { Pressable } from 'react-native';

const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png';

export default function ArticleScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
            console.error('Failed to load article:', decodedTitle, err);
            const message = err instanceof Error ? err.message : String(err);
            setLastErrorDetail(message);
            setError(`We could not load this entry right now. (${message})`);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadEntry();

    return () => {
      isActive = false;
    };
  }, [decodedTitle, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <ActivityIndicator size="large" color={isDark ? '#3b82f6' : '#1d4ed8'} />
        <Text style={[styles.loadingText, { color: isDark ? '#cbd5f5' : '#475569' }]}>Loading entry...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
        <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#b91c1c' }]}>{error}</Text>
        {lastErrorDetail ? (
          <Text style={{ marginTop: 8, color: isDark ? '#cbd5f5' : '#475569', fontSize: 12 }}>
            Debug: {lastErrorDetail}
          </Text>
        ) : null}
        <Pressable
          style={{ marginTop: 12, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: isDark ? '#1f2937' : '#eef2ff' }}
          onPress={() => {
            setError(null);
            setLastErrorDetail(null);
            setIsLoading(true);
            // trigger reload by calling effect — simplest is to call getEncyclopediaEntry directly
            (async () => {
              try {
                const data = await getEncyclopediaEntry(decodedTitle);
                setEntry(data);
                navigation.setOptions({ title: data.title });
              } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                setLastErrorDetail(message);
                setError(`Retry failed: ${message}`);
              } finally {
                setIsLoading(false);
              }
            })();
          }}
        >
          <Text style={{ color: isDark ? '#f8fafc' : '#1f2937', fontWeight: '600' }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!entry) {
    return null;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#020617' : '#f8fafc' }}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.heroWrapper}>
        <Image
          source={{ uri: entry.imageUrl ?? entry.thumbnailUrl ?? FALLBACK_IMAGE }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.body, { backgroundColor: isDark ? '#0f172a' : '#ffffff' }]}>
        <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>{entry.title}</Text>
        {entry.description ? (
          <Text style={[styles.description, { color: isDark ? '#cbd5f5' : '#475569' }]}>
            {entry.description}
          </Text>
        ) : null}
        <Text style={[styles.extract, { color: isDark ? '#e2e8f0' : '#1f2937' }]}>{entry.extract}</Text>

        {/* Inline dummy ad for web */}
        <DummyAd size="banner" adUnitId="article-banner-1" />

        {entry.sections.slice(1).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionContent, { color: isDark ? '#cbd5f5' : '#1f2937' }]}>
              {section.content}
            </Text>
          </View>
        ))}

        {entry.url ? (
          <Text
            style={[styles.externalLink, { color: isDark ? '#93c5fd' : '#2563eb' }]}
            onPress={() => Linking.openURL(entry.url!)}
          >
            Continue reading on Wikipedia
          </Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 48,
  },
  heroWrapper: {
    height: 260,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  body: {
    marginHorizontal: 16,
    marginTop: -40,
    padding: 24,
    borderRadius: 28,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px rgba(15, 23, 42, 0.18)',
      },
      default: {
        shadowColor: '#0f172a33',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 24,
        elevation: 6,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  extract: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 16,
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 22,
  },
  externalLink: {
    marginTop: 28,
    fontSize: 15,
    fontWeight: '600',
  },
});
