import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { CategoryChip } from '@/components/CategoryChip';
import DummyAd from '@/components/DummyAd';
import { FeaturedTopicCard } from '@/components/FeaturedTopicCard';
import { ResultCard } from '@/components/ResultCard';
import { SearchBar } from '@/components/SearchBar';
import { useColorScheme } from '@/components/useColorScheme';
import { CATEGORIES, EncyclopediaCategory } from '@/constants/topics';
import { useDebounce } from '@/hooks/useDebounce';
import { getDailyCuratedTopics } from '@/lib/dailyContentService';
import { CuratedTopic } from '@/lib/firebase';
import { searchEncyclopedia, WikiSearchItem } from '@/lib/wiki';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 450);

  const [results, setResults] = useState<WikiSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<EncyclopediaCategory | 'Featured'>(
    'Featured',
  );
  const [featuredTopics, setFeaturedTopics] = useState<CuratedTopic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  // Load daily curated topics on mount
  useEffect(() => {
    let isActive = true;

    const loadTopics = async () => {
      setIsLoadingTopics(true);
      try {
        const topics = await getDailyCuratedTopics();
        if (isActive) {
          setFeaturedTopics(topics);
        }
      } catch (err) {
        console.error('Error loading daily topics:', err);
        // Fallback to empty array, will show loading state
      } finally {
        if (isActive) {
          setIsLoadingTopics(false);
        }
      }
    };

    loadTopics();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const runSearch = async () => {
      setIsSearching(true);
      setError(null);
      try {
        const response = await searchEncyclopedia(debouncedQuery, 20);
        if (isActive) {
          setResults(response);
        }
      } catch (err) {
        if (isActive) {
          setError('Unable to fetch knowledge right now. Please try again.');
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    };

    if (debouncedQuery.trim().length >= 2) {
      runSearch();
    } else {
      setResults([]);
      setError(null);
      setIsSearching(false);
    }

    return () => {
      isActive = false;
    };
  }, [debouncedQuery]);

  const filteredTopics = useMemo(() => {
    if (selectedCategory === 'Featured') {
      return featuredTopics;
    }

    return featuredTopics.filter((topic) => topic.category === selectedCategory);
  }, [featuredTopics, selectedCategory]);

  const handleOpenTopic = (title: string) => {
    router.push(`/article/${encodeURIComponent(title)}`);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#020617' : '#f8fafc' },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Smart Encyclopedia</Text>
          <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#475569' }]}>Your guide to facts, concepts, people, places, and events.</Text>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          onSubmit={() => setQuery((value) => value.trim())}
        />

        {error ? (
          <View style={[styles.errorBox, { borderColor: isDark ? '#7f1d1d' : '#fca5a5' }]}>
            <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#b91c1c' }]}>
              {error}
            </Text>
          </View>
        ) : null}

        {isSearching && (
          <View style={styles.feedbackRow}>
            <ActivityIndicator color={isDark ? '#93c5fd' : '#2563eb'} />
            <Text style={[styles.feedbackText, { color: isDark ? '#cbd5f5' : '#475569' }]}>
              Searching the knowledge base...
            </Text>
          </View>
        )}

        {debouncedQuery.trim().length >= 2 ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Search Results</Text>
            {results.length === 0 && !isSearching ? (
              <Text style={[styles.emptyState, { color: isDark ? '#94a3b8' : '#64748b' }]}>No entries found. Try refining your search terms.</Text>
            ) : (
              results.map((item) => (
                <ResultCard key={item.id} item={item} onPress={() => handleOpenTopic(item.title)} />
              ))
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Browse Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                <CategoryChip
                  label="Featured"
                  isActive={selectedCategory === 'Featured'}
                  onPress={() => setSelectedCategory('Featured')}
                />
                {CATEGORIES.map((category) => (
                  <CategoryChip
                    key={category}
                    label={category}
                    isActive={selectedCategory === category}
                    onPress={() => setSelectedCategory(category)}
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#f8fafc' : '#0f172a' }]}>Knowledge Spotlight</Text>
              {isLoadingTopics ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color={isDark ? '#93c5fd' : '#2563eb'} />
                  <Text style={[styles.loadingText, { color: isDark ? '#cbd5f5' : '#475569' }]}>
                    Loading today's topics...
                  </Text>
                </View>
              ) : filteredTopics.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredRow}
                >
                  {filteredTopics.map((topic) => (
                    <FeaturedTopicCard
                      key={topic.title}
                      topic={topic}
                      onPress={() => handleOpenTopic(topic.title)}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text style={[styles.emptyState, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                  No topics available for this category.
                </Text>
              )}
            </View>

            {/* Dummy AdSense placeholder (web only) */}
            <DummyAd size="banner" adUnitId="home-banner-1" useRealAds={true} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 14,
    marginLeft: 12,
  },
  errorBox: {
    borderWidth: 1,
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  categoriesRow: {
    paddingRight: 20,
  },
  featuredRow: {
    paddingRight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 12,
  },
});
