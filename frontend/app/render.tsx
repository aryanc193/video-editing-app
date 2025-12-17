import { View, Text, StyleSheet, Pressable, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

const API_BASE = "http://192.168.1.10:8000";

type JobStatus = "queued" | "processing" | "completed" | "failed";

export default function RenderScreen() {
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const router = useRouter();

  const [status, setStatus] = useState<JobStatus>("queued");

  useEffect(() => {
    if (progress >= targetProgress) return;

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= targetProgress) {
          clearInterval(timer);
          return targetProgress;
        }
        return p + 1;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [targetProgress]);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/status/${jobId}`);
      const data = await res.json();
      setStatus(data.status);

      if (data.status === "queued") {
        setTargetProgress(15);
      }

      if (data.status === "processing") {
        setTargetProgress(85);
      }

      if (data.status === "completed") {
        setTargetProgress(100);
        clearInterval(interval);
      }

      if (data.status === "failed") {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [jobId]);

  const title =
    status === "completed" ? "Your video is ready" : "Rendering video";

  const subtitle =
    status === "completed"
      ? "You can download it below"
      : "This may take a few moments";

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {status !== "completed" && (
          <Text style={styles.status}>Status: {status}</Text>
        )}

        {status !== "completed" && (
          <Text style={styles.progress}>{progress}%</Text>
        )}
        {status === "completed" && (
          <Pressable
            style={styles.primaryButton}
            onPress={() => Linking.openURL(`${API_BASE}/result/${jobId}`)}
          >
            <Text style={styles.primaryText}>Download Video</Text>
          </Pressable>
        )}
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
        <Text style={styles.secondaryText}>Back to Editor</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "space-between",
  },
  progress: {
    fontSize: 32,
    fontWeight: "600",
    color: "#000",
    marginBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
  },
  status: {
    color: "#999",
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    alignSelf: "center",
    paddingVertical: 12,
  },
  secondaryText: {
    color: "#000",
    fontSize: 14,
  },
});
