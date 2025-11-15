import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { CuratedTopic } from '@/constants/topics';
import { useColorScheme } from '@/components/useColorScheme';

interface FeaturedTopicCardProps {
  topic: CuratedTopic;
  onPress?: () => void;
}

const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globe_icon.svg/512px-Globe_icon.svg.png';

export function FeaturedTopicCard({ topic, onPress }: FeaturedTopicCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageError, setImageError] = useState(false);
  const [imageUri, setImageUri] = useState(topic.image);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageUri(FALLBACK_IMAGE);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open article about ${topic.title}`}
      onPress={onPress}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
    >
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
        onError={handleImageError}
        onLoad={() => {
          // Image loaded successfully
        }}
      />
      <View style={styles.overlay}>
        <Text style={styles.category}>{topic.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {topic.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {topic.subtitle}
        </Text>
        <Text style={styles.summary} numberOfLines={3}>
          {topic.summary}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 320,
    borderRadius: 32,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transitionProperty: 'transform, box-shadow',
        transitionDuration: '200ms',
      },
    }),
  },
  cardLight: {
    backgroundColor: '#0f172a',
  },
  cardDark: {
    backgroundColor: '#020617',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    minHeight: 320,
    backgroundColor: '#1f2937',
    ...Platform.select({
      web: {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      },
    }),
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  category: {
    color: '#bfdbfe',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '700',
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#e2e8f0',
    fontSize: 16,
    marginBottom: 12,
  },
  summary: {
    color: '#cbd5f5',
    fontSize: 13,
    lineHeight: 18,
  },
});
