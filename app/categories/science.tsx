import DummyAd from "@/components/DummyAd";
import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function ScienceCategory() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
        Science
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Science helps us understand how the world works — from atoms and
        chemicals, to biology and physics. Explore major scientific ideas and
        discoveries here.
      </Text>

      {/* Ad Below Intro */}
      <DummyAd size="banner" adUnitId="science-banner-1" useRealAds={true} />

      <Text
        style={styles.link}
        onPress={() => router.push("/article/Quantum%20Mechanics")}
      >
        Quantum Mechanics →
      </Text>

      <Text
        style={styles.link}
        onPress={() => router.push("/article/Photosynthesis")}
      >
        Photosynthesis →
      </Text>

      <Text
        style={styles.link}
        onPress={() => router.push("/article/Gravity")}
      >
        Gravity →
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
