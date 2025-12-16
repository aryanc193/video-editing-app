// components/OverlayControls.tsx
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import * as ImagePicker from "expo-image-picker";

export default function OverlayControls({
  overlay,
  setOverlay,
  duration,
}: any) {
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!res.canceled) {
      setOverlay((p: any) => ({
        ...p,
        type: "image",
        imageUri: res.assets[0].uri,
      }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Overlay Type */}
      <View style={styles.segment}>
        <Segment
          label="Text"
          active={overlay.type === "text"}
          onPress={() => setOverlay((p: any) => ({ ...p, type: "text" }))}
        />
        <Segment
          label="Image"
          active={overlay.type === "image"}
          onPress={() => pickImage()}
        />
      </View>

      {/* Text Input */}
      {overlay.type === "text" && (
        <>
          <Label>Text</Label>
          <TextInput
            style={styles.input}
            value={overlay.content}
            onChangeText={(v) => setOverlay((p: any) => ({ ...p, content: v }))}
          />
        </>
      )}

      {/* Size */}
      <Label>Size</Label>
      <Slider
        minimumValue={0.5}
        maximumValue={2}
        value={overlay.scale}
        onValueChange={(v) => setOverlay((p: any) => ({ ...p, scale: v }))}
      />

      {/* Timing */}
      <Label>Start: {overlay.start_time.toFixed(1)}s</Label>
      <Slider
        minimumValue={0}
        maximumValue={duration}
        step={0.1}
        value={overlay.start_time}
        onValueChange={(v) => setOverlay((p: any) => ({ ...p, start_time: v }))}
      />

      <Label>End: {overlay.end_time.toFixed(1)}s</Label>
      <Slider
        minimumValue={0}
        maximumValue={duration}
        step={0.1}
        value={overlay.end_time}
        onValueChange={(v) => setOverlay((p: any) => ({ ...p, end_time: v }))}
      />
    </View>
  );
}

function Segment({ label, active, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.segmentBtn, active && styles.segmentActive]}
    >
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Label({ children }: any) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: "#000",
    borderRadius: 12,
  },
  segmentText: {
    color: "#000",
  },
  segmentTextActive: {
    color: "#fff",
  },
});
