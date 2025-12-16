import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import TopBar from "../components/TopBar";
import VideoPreview from "../components/VideoPreview";
import OverlayControls from "../components/OverlayControls";

export default function Editor() {
  const { videoUri } = useLocalSearchParams<{ videoUri: string }>();
  const router = useRouter();

  const [duration, setDuration] = useState(0);

  const [overlay, setOverlay] = useState({
    type: "text" as "text" | "image",
    content: "Hello Buttercut",
    imageUri: undefined as string | undefined,
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    start_time: 0,
    end_time: 2,
  });

  return (
    <View style={styles.container}>
      <TopBar
        onBack={() => router.back()}
        onSave={() => console.log("Save later")}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
