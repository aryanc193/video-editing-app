import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Buttercut Editor</Text>
      <Button title="Pick Video" onPress={() => {}} />
    </View>
  );
}
