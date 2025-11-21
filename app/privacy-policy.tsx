import { useColorScheme } from "@/components/useColorScheme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ScrollView
      style={{ backgroundColor: isDark ? "#020617" : "#f8fafc", flex: 1 }}
      contentContainerStyle={{ padding: 20 }}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Privacy Policy
        </Text>

        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Introduction
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Smart Encyclopedia (“we”, “our”, or “the Service”) provides factual
          information through our mobile and web application. This Privacy Policy
          explains how we collect, use, and protect your information while using our Service.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Information We Collect
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          We do not collect any personally identifiable information.
          However, we may collect non-personal usage data such as:
        </Text>

        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Search terms</Text>
        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Pages you view</Text>
        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Device type and browser</Text>
        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Anonymous analytics</Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Google AdSense & Cookies
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Our app and website use Google AdSense, which may use cookies to:
        </Text>

        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Show personalized or non-personalized ads</Text>
        <Text style={[styles.listItem, { color: isDark ? "#e2e8f0" : "#334155" }]}>• Improve ad relevance</Text>

        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Google may collect information such as IP address, browser type, and interactions
          with ads. To learn more, please visit:
          https://policies.google.com/privacy
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Third-Party Links
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Articles may contain links to external websites such as Wikipedia.
          We are not responsible for their privacy practices.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Children’s Privacy
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          Our Service does not knowingly collect personal data from children.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Changes to This Policy
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          We may update this Privacy Policy from time to time. Updates will appear on this page.
        </Text>

        <Text style={[styles.sectionTitle, { color: isDark ? "#f8fafc" : "#0f172a" }]}>
          Contact Us
        </Text>
        <Text style={[styles.text, { color: isDark ? "#e2e8f0" : "#334155" }]}>
          If you have questions about our Privacy Policy, please contact us at:
          support@smartencyclopedia.uk
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginTop: 24, marginBottom: 6 },
  text: { fontSize: 15, lineHeight: 22, marginBottom: 8 },
  listItem: { fontSize: 15, marginLeft: 12, marginBottom: 4 },
});
