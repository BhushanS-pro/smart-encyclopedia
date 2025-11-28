import { useColorScheme } from "@/components/useColorScheme";
import { CuratedTopic } from "@/constants/topics";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getImage } from "../utils/imageMap";

interface FeaturedTopicCardProps {
  topic: CuratedTopic & { slug: string };
  onPress?: () => void;
}

export function FeaturedTopicCard({ topic, onPress }: FeaturedTopicCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const imageSource = getImage(topic.slug, "featured");

  const handlePress = () => {
    if (onPress) onPress();
    else router.push(`/article/${topic.slug}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
    >
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <View style={styles.overlay}>
        <Text style={styles.category}>{topic.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {topic.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    height: 320,
    borderRadius: 24,
    overflow: "hidden",
    marginRight: 16,
  },
  cardLight: { backgroundColor: "#0f172a" },
  cardDark: { backgroundColor: "#020617" },

  image: {
    width: "100%",
    height: "60%",
    backgroundColor: "#1e293b",
  },

  overlay: {
    padding: 14,
    justifyContent: "flex-end",
  },
  category: {
    color: "#38bdf8",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
});
