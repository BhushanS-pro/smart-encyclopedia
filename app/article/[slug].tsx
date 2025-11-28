// app/article/[slug].tsx
import articles from "@/content/articles.json";
import { getImage } from "@/utils/imageMap";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  const article = articles.find((a) => a.slug === slug);

  return (
    <>
      {/* 🚫 Don't show invalid title during loading */}
      {article && (
        <Stack.Screen
          options={{
            title: article.title, // Only set once slug matched!
          }}
        />
      )}

      {!article ? (
        <View style={styles.center}>
          <Text style={{ color: "red", fontSize: 18 }}>Article Not Found</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.heroWrapper}>
            <Image
              source={getImage(article.slug, "hero")}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.description}>{article.description}</Text>
            <Text style={styles.extract}>{article.extract}</Text>

            {article.sections?.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionContent}>{section.content}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  heroWrapper: {
    width: "100%",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: 160,
    ...Platform.select({
      web: {
        height: "auto",
        aspectRatio: 16 / 4.5,
        objectFit: "cover",
      },
    }),
  },
  content: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
    color: "#0f172a",
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    color: "#475569",
  },
  extract: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 22,
    color: "#1e293b",
  },
  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0f172a",
  },
  sectionContent: {
    fontSize: 15,
    lineHeight: 23,
    color: "#334155",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
