import LottieView from "lottie-react-native";
import { View, Text, TouchableOpacity } from "react-native";
import animationData from "../../assets/binoclar.json";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

export default function ObservationFormHeader() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          borderWidth: 2,
          borderColor: "white",
          paddingVertical: 2,
          paddingHorizontal: 10,
          marginLeft: 10,
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} color="black" size={30} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 25,
        }}
      >
        <Text
          style={{
            fontFamily: "Droid Sans Mono",
            fontSize: 27,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#34651e",
          }}
        >
          Nouvelle Observation
        </Text>
      </View>
      <LottieView
        source={animationData}
        autoPlay={true}
        loop={true}
        speed={0.5}
        resizeMode="contain"
        style={{ height: 100, width: 150 }}
      />
    </View>
  );
}
