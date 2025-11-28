import articles from "@/content/articles.json";
import { WikiSearchItem } from "@/lib/wiki";
import { getImage } from "@/utils/imageMap";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  item: WikiSearchItem;
  onPress?: () => void;
}

export function ResultCard({ item, onPress }: Props) {
  const matchedArticle = articles.find(
    (a) => a.title.toLowerCase() === item.title.toLowerCase()
  );

  const thumbnail =
    matchedArticle?.slug ? getImage(matchedArticle.slug, "thumbnail") : null;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {thumbnail ? (
        <Image source={thumbnail} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.textWrapper}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        {matchedArticle?.description && (
          <Text style={styles.description} numberOfLines={2}>
            {matchedArticle.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#1e293b",
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#cbd5e1",
  },
  textWrapper: { flex: 1, justifyContent: "center" },
  title: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: "#475569",
  },
});
