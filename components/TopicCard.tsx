import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function TopicCard({ item }) {
  const router = useRouter();
  const image = resolveImage(item.thumbnailUrl);

  return (
    <Pressable onPress={() => router.push(`/article/${item.slug}`)}>
      <View style={styles.card}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: "#94A3B8" }}>Image Missing</Text>
          </View>
        )}
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#0f172a",
    padding: 14,
    borderRadius: 18,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    marginBottom: 12,
    resizeMode: "cover",
  },
  placeholder: {
    width: "100%",
    height: 160,
    borderRadius: 14,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  category: {
    fontSize: 12,
    color: "#38bdf8",
    marginBottom: 6,
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 20,
  },
});
