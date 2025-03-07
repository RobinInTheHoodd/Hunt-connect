import LottieView from "lottie-react-native";
import { View, Text } from "react-native";
import animationData from "../../assets/Weather.json";

export default function WeatherFormHeader() {
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
          Données Météorologique
        </Text>
      </View>
      <LottieView
        source={animationData}
        autoPlay={true}
        loop={true}
        speed={0.4}
        resizeMode="contain"
        style={{ height: 100, width: 100 }}
      />
    </View>
  );
}
