import { useColorScheme } from "@/components/useColorScheme";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function HistoryCategory() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? "#020617" : "#f8fafc" }}
      contentContainerStyle={styles.container}
    >
      <Text style={[styles.title, { color: isDark ? "#fff" : "#111" }]}>
        History
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        History allows us to study past civilizations, cultures, and events that 
        shaped the modern world. Explore significant eras and historical figures.
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/World%20War%202")}>
        World War II →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Ancient%20Egypt")}>
        Ancient Egypt →
      </Text>

      <Text style={styles.link} onPress={() => router.push("/article/Industrial%20Revolution")}>
        Industrial Revolution →
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
