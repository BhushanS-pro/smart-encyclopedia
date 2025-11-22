import { useColorScheme } from "@/components/useColorScheme";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function CookiePolicy() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ScrollView style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}>Cookie Policy</Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        Smart Encyclopedia uses cookies to improve functionality and personalize your browsing experience. 
        Third-party services like Google AdSense may also store cookies to show relevant ads.
      </Text>

      <Text style={[styles.text, { marginTop: 16, color: isDark ? "#cbd5f5" : "#374151" }]}>
        You may disable cookies in your browser settings at any time.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 14 },
  text: { fontSize: 16, lineHeight: 24 }
});
