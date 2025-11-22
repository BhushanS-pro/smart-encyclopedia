import DummyAd from "@/components/DummyAd";
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function SpaceCategory() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
        Space & Astronomy
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Space science explores the universe — from planets, stars, and galaxies 
        to black holes and space exploration missions.
      </Text>

      <DummyAd size="banner" adUnitId="space-banner-1" useRealAds={true} />

      <Text style={styles.link} onPress={() => router.push("/article/Milky%20Way")}>
        Milky Way →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Big%20Bang")}>
        Big Bang →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Black%20Hole")}>
        Black Hole →
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, lineHeight: 22, marginBottom: 15 },
  link: {
    fontSize: 18,
    color: "#2563eb",
    marginVertical: 10,
    fontWeight: "600",
  },
});
