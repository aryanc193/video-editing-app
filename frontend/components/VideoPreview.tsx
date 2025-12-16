// components/VideoPreview.tsx
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRef } from "react";

const { width } = Dimensions.get("window");
const W = width - 32;
const H = 420;

export default function VideoPreview({
  videoUri,
  overlay,
  setOverlay,
  onDuration,
}: any) {
  const pan = useRef(
    new Animated.ValueXY({
      x: overlay.position.x * W,
      y: overlay.position.y * H,
    })
  ).current;

  const responder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, g) => {
      setOverlay((p: any) => ({
        ...p,
        position: {
          x: g.moveX / W,
          y: g.moveY / H,
        },
      }));
    },
  });

  return (
    <View style={styles.wrapper}>
      <Video
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        onLoad={(status) => {
          if (!status.isLoaded) return;

          if (status.durationMillis != null) {
            onDuration(status.durationMillis / 1000);
          }
        }}
      />

      <Animated.View
        {...responder.panHandlers}
        style={[styles.overlay, { transform: pan.getTranslateTransform() }]}
      >
        {overlay.type === "text" ? (
          <Text style={[styles.text, { fontSize: 22 * overlay.scale }]}>
            {overlay.content}
          </Text>
        ) : (
          overlay.imageUri && (
            <Image
              source={{ uri: overlay.imageUri }}
              style={{
                width: 80 * overlay.scale,
                height: 80 * overlay.scale,
              }}
            />
          )
        )}
      </Animated.View>
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
  overlay: {
    position: "absolute",
  },
  text: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 6,
  },
});
