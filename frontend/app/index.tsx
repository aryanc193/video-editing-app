import { View, Text, StyleSheet } from "react-native";
import VideoPicker from "../components/VideoPicker";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ButtercutAI</Text>
      <Text style={styles.subtitle}>
        Simple, focused video overlays
      </Text>

      <VideoPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666",
    marginBottom: 32,
  },
});
