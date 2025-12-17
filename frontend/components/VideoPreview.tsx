import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";

const { width } = Dimensions.get("window");
const W = width - 32;
const H = 420;

export default function VideoPreview({ videoUri, overlay, onDuration }: any) {
  return (
    <View style={styles.wrapper}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        onLoad={(status) => {
          if (status.isLoaded && status.durationMillis) {
            onDuration(status.durationMillis / 1000);
          }
        }}
      />

      {/* CENTERED OVERLAY */}
      <View style={styles.overlayWrapper}>
        {overlay.type === "text" ? (
          <Text style={[styles.text, { fontSize: 22 * overlay.scale }]}>
            {overlay.content}
          </Text>
        ) : (
          overlay.imageUri && (
            <Image
              source={{ uri: overlay.imageUri }}
              resizeMode="contain"
              style={{
                width: 80 * overlay.scale,
                height: 80 * overlay.scale,
              }}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: W,
    height: H,
    margin: 16,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  // THIS guarantees true center
  overlayWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 6,
  },
});
