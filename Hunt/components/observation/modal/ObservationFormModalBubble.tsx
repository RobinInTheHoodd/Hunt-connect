import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import image from "../../../assets/canardVol.png";
import duckPos from "../../../assets/canardPos.webp";
import ObservationForm from "../../../model/observation/ObservationForm";
import ObservationFormBubbleModel from "../../../model/observation/ObservationFormBubbleModel";

interface IObservationFormBubbleProps {
  form: ObservationFormBubbleModel;
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
  selectedButton: number | null;
  setSelectedButton: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function ObservationFormBubble({
  form,
  setForm,
  selectedButton,
  setSelectedButton,
}: IObservationFormBubbleProps) {
  const { height, width } = useWindowDimensions();
  const styles = InputTextStyle(width, height);

  return (
    <>
      <View style={styles.buttonContainer}>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
        >
          <Text
            style={{
              color: "#38761d",
              fontWeight: "bold",
              fontSize: width * 0.05,
            }}
          >
            En vol
          </Text>
          <TouchableOpacity
            style={
              selectedButton === 1
                ? styles.selectedBubbleButton
                : styles.bubbleButton
            }
            onPress={() => {
              setForm((prev) => {
                return {
                  ...prev,
                  bubble: {
                    isFly: true,
                    isvalid: true,
                    errorMessage: "",
                  },
                };
              });
              setSelectedButton(1);
            }}
          >
            <Image
              source={image}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
        >
          <Text
            style={{
              color: "#38761d",
              fontWeight: "bold",
              fontSize: width * 0.05,
            }}
          >
            En pose
          </Text>
          <TouchableOpacity
            style={
              selectedButton == 2
                ? styles.selectedBubbleButton
                : styles.bubbleButton
            }
            onPress={() => {
              setForm((prev) => {
                return {
                  ...prev,
                  bubble: {
                    isFly: false,
                    isvalid: true,
                    errorMessage: "",
                  },
                };
              });
              setSelectedButton(2);
            }}
          >
            <Image
              source={duckPos}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
      {form.isvalid == false ? (
        form.errorMessage != "" ? (
          <Text style={{ color: "red", paddingBottom: 5 }}>
            {form.errorMessage}
          </Text>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
}

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
    container: { flex: 1 },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      borderWidth: 1,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderColor: "black",
      marginBottom: height * 0.01,
      marginTop: 5,
      paddingHorizontal: 10,
      backgroundColor: "#FFF",
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "#38761d",
      fontWeight: "bold",
      fontSize: width * 0.05,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: width * 0.008,
      fontWeight: "bold",
      fontSize: width * 0.045,
      color: "black",
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    bubbleButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 4,
      borderColor: "#38761d",
    },
    selectedBubbleButton: {
      borderRadius: 50,
      borderWidth: 4,
      borderColor: "#38761d",
    },
  });
