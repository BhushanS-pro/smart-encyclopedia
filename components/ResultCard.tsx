import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { cleanExcerpt, WikiSearchItem } from '@/lib/wiki';
import { useColorScheme } from '@/components/useColorScheme';

interface ResultCardProps {
  item: WikiSearchItem;
  onPress?: () => void;
}

const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png';

export function ResultCard({ item, onPress }: ResultCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageError, setImageError] = useState(false);
  const imageUri = item.thumbnail?.url || FALLBACK_IMAGE;

  const handleImageError = () => {
    if (!imageError && imageUri !== FALLBACK_IMAGE) {
      setImageError(true);
    }
  };

  const excerpt = cleanExcerpt(item.excerpt ?? '');

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
    >
      <Image
        source={{ uri: imageError ? FALLBACK_IMAGE : imageUri }}
        style={styles.thumbnail}
        resizeMode="cover"
        onError={handleImageError}
        onLoad={() => {
          // Image loaded successfully
        }}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDark ? '#f8fafc' : '#0f172a' }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.description ? (
          <Text style={[styles.description, { color: isDark ? '#cbd5f5' : '#475569' }]} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        {excerpt ? (
          <Text style={[styles.excerpt, { color: isDark ? '#94a3b8' : '#4b5563' }]} numberOfLines={3}>
            {excerpt}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      web: {
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '200ms',
        cursor: 'pointer',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 16px rgba(15, 23, 42, 0.12)',
      },
      default: {
        shadowColor: '#0f172a33',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 16,
        elevation: 3,
      },
    }),
  },
  cardDark: {
    backgroundColor: '#111827',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#1f2937',
  },
  thumbnail: {
    width: 96,
    minWidth: 96,
    height: '100%',
    minHeight: 96,
    backgroundColor: '#e2e8f0',
    ...Platform.select({
      web: {
        objectFit: 'cover',
      },
    }),
  },
  content: {
    flex: 1,
    padding: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 13,
    lineHeight: 18,
  },
});
