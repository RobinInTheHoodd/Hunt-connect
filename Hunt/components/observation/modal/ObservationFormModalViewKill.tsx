import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { View, useWindowDimensions, StyleSheet, Text } from "react-native";
import InputText from "../../Input/InputText";
import ObservationFormQuantity from "../../../model/observation/ObservationFormQuantity";
import ObservationForm from "../../../model/observation/ObservationForm";

interface IObservationFormViewKillProps {
  form: ObservationFormQuantity;
  setForm: React.Dispatch<React.SetStateAction<ObservationForm>>;
}

export default function ObservationFormViewKill({
  form,
  setForm,
}: IObservationFormViewKillProps) {
  const { height, width } = useWindowDimensions();
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          flex: 1,
        }}
      >
        <InputText
          tagName={"Nombre"}
          value={form.view?.toString()}
          onChangeText={(value) => {
            const rs = ObservationFormQuantity.validateView(
              Number(value),
              form
            );
            setForm((prev) => {
              return { ...prev, quantity: rs };
            });
          }}
          onBlur={() => {}}
          placeholder="0"
          iconName={faLocation}
          isTouched={false}
          isValid={true}
          errorMessage={""}
          require={false}
          isPassword={false}
          styles={InputTextStyle(width, height)}
          isIconRight={false}
          keyboard="numeric"
        />
        <InputText
          tagName={"Tués"}
          value={form.kill?.toString()}
          onChangeText={(value) => {
            const rs = ObservationFormQuantity.validateKill(
              Number(value),
              form
            );
            setForm((prevSate) => {
              return { ...prevSate, quantity: rs };
            });
          }}
          onBlur={() => {}}
          placeholder="0"
          iconName={faLocation}
          isTouched={false}
          isValid={true}
          errorMessage={""}
          require={false}
          isPassword={false}
          styles={InputTextStyle(width, height)}
          isIconRight={false}
          keyboard="numeric"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          {form.viewIsValid == false && form.viewErrorMessage != "" ? (
            <Text style={{ color: "red", paddingBottom: 5 }}>
              {form.viewErrorMessage}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          {form.killIsValid == false && form.killErrorMessage != "" ? (
            <Text style={{ color: "red", paddingBottom: 5 }}>
              {form.killErrorMessage}
            </Text>
          ) : null}
        </View>
      </View>
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
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    bubbleButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      //backgroundColor: "#2196F3",
    },
    selectedBubbleButton: {
      borderRadius: 50,
      borderWidth: 4,
      borderColor: "#38761d",
    },
  });
