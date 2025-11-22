import DummyAd from "@/components/DummyAd";
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function TechnologyCategory() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
        Technology
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Technology explores human inventions — from computing and AI to engineering 
        and digital communication systems.
      </Text>

      <DummyAd size="banner" adUnitId="tech-banner-1" useRealAds={true} />

      <Text style={styles.link} onPress={() => router.push("/article/Artificial%20Intelligence")}>
        Artificial Intelligence →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Internet")}>
        Internet →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Computer")}>
        Computer →
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
