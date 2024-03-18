import LottieView from "lottie-react-native";
import { View, Text } from "react-native";
import animationData from "../../assets/DuckWalking.json";

export default function DuckTeamFormHeader() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 10,
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Droid Sans Mono",
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#34651e",
          }}
        >
          Attelage
        </Text>
      </View>
      <LottieView
        source={animationData}
        autoPlay={true}
        loop={true}
        speed={1}
        resizeMode="contain"
        style={{ height: 100, width: 100, marginRight: 30 }}
      />
    </View>
  );
}
