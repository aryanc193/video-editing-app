import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function VideoPicker() {
  const router = useRouter();

  const pickVideo = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!res.canceled) {
      router.push({
        pathname: "/editor",
        params: { videoUri: res.assets[0].uri },
      });
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={pickVideo}>
      <Text style={styles.text}>Start Editing</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
