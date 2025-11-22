import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function FooterNav() {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <Text style={styles.link} onPress={() => router.push("/")}>Home</Text>
      <Text style={styles.link} onPress={() => router.push("/about")}>About</Text>
      <Text style={styles.link} onPress={() => router.push("/contact")}>Contact</Text>
      <Text style={styles.link} onPress={() => router.push("/privacy-policy")}>Privacy</Text>
      <Text style={styles.link} onPress={() => router.push("/terms")}>Terms</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    gap: 10,
  },
  link: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
});
