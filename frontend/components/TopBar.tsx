import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TopBar({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  return (
    <View style={styles.bar}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.action}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Editor</Text>

      <TouchableOpacity onPress={onSave}>
        <Text style={styles.action}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    marginTop: 30,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
  },
  action: {
    color: "#007AFF",
    fontSize: 16,
  },
});
