import { View, StyleSheet, Text, Pressable, Linking } from "react-native";

const API_BASE = "http://192.168.1.10:8000";

type JobStatus = "idle" | "queued" | "processing" | "completed";

interface Props {
  status: JobStatus;
  isSaving: boolean;
  jobId: string | null;
  onSave: () => void;
}

export default function RenderFooter({
  status,
  isSaving,
  jobId,
  onSave,
}: Props) {
  // COMPLETED
  if (status === "completed" && jobId) {
    return (
      <View style={styles.container}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => Linking.openURL(`${API_BASE}/result/${jobId}`)}
        >
          <Text style={styles.primaryText}>Download Video</Text>
        </Pressable>
      </View>
    );
  }

  // PROCESSING
  if (status === "queued" || status === "processing") {
    return (
      <View style={styles.container}>
        <Text style={styles.processingText}></Text>
      </View>
    );
  }

  // IDLE
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.primaryButton, isSaving && styles.disabled]}
        onPress={onSave}
        disabled={isSaving}
      >
        <Text style={styles.primaryText}>Save Video</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  processingText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
