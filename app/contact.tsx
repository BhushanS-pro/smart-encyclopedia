import { useColorScheme } from "@/components/useColorScheme";
import { Linking, ScrollView, StyleSheet, Text } from "react-native";

export default function ContactPage() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ScrollView style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}>Contact Us</Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        If you have questions, feedback, or business inquiries, feel free to reach out anytime.
      </Text>

      <Text
        style={[styles.email, { color: "#2563eb" }]}
        onPress={() => Linking.openURL("mailto:support@smartencyclopedia.uk")}
      >
        📧 support@smartencyclopedia.uk
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 14 },
  text: { fontSize: 16, marginBottom: 20, lineHeight: 24 },
  email: { fontSize: 18, fontWeight: "600", marginTop: 10 }
});
