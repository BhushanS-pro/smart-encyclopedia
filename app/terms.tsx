import { useColorScheme } from "@/components/useColorScheme";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function TermsPage() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <ScrollView style={{ backgroundColor: isDark ? "#020617" : "#f8fafc" }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}>Terms & Conditions</Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        By accessing Smart Encyclopedia, you agree to use this platform responsibly and accept that all information is 
        provided for educational purposes only.
      </Text>

      <Text style={[styles.text, { color: isDark ? "#cbd5f5" : "#374151" }]}>
        We do not guarantee the accuracy of content and are not responsible for decisions made based on the information provided.
      </Text>

      <Text style={[styles.text, { marginTop: 20, color: isDark ? "#cbd5f5" : "#374151" }]}>
        We reserve the right to update or modify these terms at any time without prior notice.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 18 },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 14 },
  text: { fontSize: 16, lineHeight: 24 }
});
