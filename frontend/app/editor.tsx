import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

import TopBar from "../components/TopBar";
import VideoPreview from "../components/VideoPreview";
import OverlayControls from "../components/OverlayControls";
import RenderFooter from "../components/RenderFooter";

const API_BASE = "http://192.168.1.10:8000";

type OverlayType = "text" | "image";
type JobStatus = "idle" | "queued" | "processing" | "completed";

export default function Editor() {
  const { videoUri } = useLocalSearchParams<{ videoUri: string }>();
  const router = useRouter();

  const [duration, setDuration] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus>("idle");
  const [isSaving, setIsSaving] = useState(false);

  const [overlay, setOverlay] = useState({
    type: "text" as OverlayType,
    content: "Hello Buttercut",
    imageUri: undefined as string | undefined,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    start_time: 0,
    end_time: 2,
  });

  const onSave = async () => {
    if (!videoUri || isSaving) return;

    try {
      setIsSaving(true);
      setJobStatus("queued");

      // FORCE CENTER POSITION
      let overlayPayload: any = {
        ...overlay,
        position: { x: 0.5, y: 0.5 },
      };

      if (overlay.type === "image" && overlay.imageUri) {
        const base64 = await FileSystem.readAsStringAsync(overlay.imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        overlayPayload.imageBase64 = base64;
        delete overlayPayload.imageUri;
      }

      const response = await FileSystem.uploadAsync(
        `${API_BASE}/upload`,
        videoUri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "video",
          parameters: {
            overlay: JSON.stringify(overlayPayload),
          },
        }
      );

      const data = JSON.parse(response.body);
      router.push({
        pathname: "/render",
        params: { jobId: data.job_id },
      });
    } catch (e) {
      console.error(e);
      setJobStatus("idle");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${API_BASE}/status/${jobId}`);
      const data = await res.json();
      setJobStatus(data.status);
      if (data.status === "completed") clearInterval(interval);
    }, 1500);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <View style={styles.container}>
      <TopBar onBack={() => router.back()} onSave={onSave} />

      <VideoPreview
        videoUri={videoUri}
        overlay={overlay}
        setOverlay={setOverlay}
        onDuration={setDuration}
      />

      {duration > 0 && (
        <OverlayControls
          overlay={overlay}
          setOverlay={setOverlay}
          duration={duration}
        />
      )}
      <RenderFooter
        status={jobStatus}
        isSaving={isSaving}
        jobId={jobId}
        onSave={onSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  statusBar: { padding: 16, borderTopWidth: 1, borderColor: "#eee" },
});
