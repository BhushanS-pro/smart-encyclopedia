import { useColorScheme } from "@/components/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {/* Navigation Screens */}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Article Screen */}
          <Stack.Screen
            name="article/[slug]"
            options={{
              headerTitle: "",
              headerBackTitle: "Back",
            }}
          />

          {/* These show header automatically */}
          <Stack.Screen name="about" options={{ title: "About Us" }} />
          <Stack.Screen name="contact" options={{ title: "Contact" }} />
          <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
          <Stack.Screen name="terms" options={{ title: "Terms & Conditions" }} />
        </Stack>

        {/* 🌍 Footer inside scrolling screens - horizontal layout */}
        <View style={styles.footer}>
          <Link href="/" style={styles.footerLink}>Home</Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/about" style={styles.footerLink}>About</Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/contact" style={styles.footerLink}>Contact</Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/privacy-policy" style={styles.footerLink}>Privacy</Link>
          <Text style={styles.separator}>•</Text>
          <Link href="/terms" style={styles.footerLink}>Terms</Link>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  footerLink: {
    fontSize: 14,
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  separator: {
    fontSize: 14,
    color: "#94a3b8",
  },
});
