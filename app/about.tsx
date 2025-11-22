import { useColorScheme } from "@/components/useColorScheme";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function AboutPage() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ScrollView style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}>About Smart Encyclopedia</Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Smart Encyclopedia was created to make knowledge accessible, simple, and easy to search. Our goal is to help 
        students, researchers, and curious minds quickly explore verified information about science, history, 
        technology, and global topics.
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Content is sourced responsibly from trusted public knowledge sources, and our platform is constantly improving 
        to deliver a fast and reliable learning experience.
      </Text>

      <Text style={[styles.text, { marginTop: 20, color: isDark ? "#cbd5f5" : "#374151" }]}>
        If you have feedback or want to suggest improvements, feel free to reach out anytime.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 14 },
  text: { fontSize: 16, lineHeight: 24 }
});
