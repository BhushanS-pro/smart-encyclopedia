/**
 * Daily Content Service
 * 
 * This service manages fetching and caching daily curated content.
 * It tries Firebase first, then falls back to static content if needed.
 */

import { getDailyTopics, hasContentForToday, saveDailyTopics, CuratedTopic } from './firebase';
import { CURATED_TOPICS } from '@/constants/topics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@SmartEncyclopedia:dailyTopics';
const CACHE_DATE_KEY = '@SmartEncyclopedia:cacheDate';

// Get daily topics with caching
export async function getDailyCuratedTopics(): Promise<CuratedTopic[]> {
  try {
    // Check if we have content for today in Firebase
    const hasContent = await hasContentForToday();
    
    if (hasContent) {
      const topics = await getDailyTopics();
      if (topics.length > 0) {
        // Cache locally for offline access
        await cacheTopics(topics);
        return topics;
      }
    }

    // Fallback: Check local cache
    const cachedTopics = await getCachedTopics();
    if (cachedTopics && isCacheValid(cachedTopics.date)) {
      return cachedTopics.topics;
    }

    // Final fallback: Use static curated topics
    return CURATED_TOPICS;
  } catch (error) {
    console.error('Error fetching daily topics:', error);
    // Return static topics as fallback
    return CURATED_TOPICS;
  }
}

// Cache topics locally
async function cacheTopics(topics: CuratedTopic[]): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(topics));
    await AsyncStorage.setItem(CACHE_DATE_KEY, today);
  } catch (error) {
    console.error('Error caching topics:', error);
  }
}

// Get cached topics
async function getCachedTopics(): Promise<{ topics: CuratedTopic[]; date: string } | null> {
  try {
    const topicsJson = await AsyncStorage.getItem(CACHE_KEY);
    const date = await AsyncStorage.getItem(CACHE_DATE_KEY);
    
    if (topicsJson && date) {
      return {
        topics: JSON.parse(topicsJson),
        date,
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading cached topics:', error);
    return null;
  }
}

// Check if cache is still valid (same day)
function isCacheValid(cacheDate: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return cacheDate === today;
}

// Refresh daily content (useful for pull-to-refresh)
export async function refreshDailyTopics(): Promise<CuratedTopic[]> {
  try {
    // Clear local cache
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_DATE_KEY);
    
    // Fetch fresh content
    return await getDailyCuratedTopics();
  } catch (error) {
    console.error('Error refreshing daily topics:', error);
    return CURATED_TOPICS;
  }
}

