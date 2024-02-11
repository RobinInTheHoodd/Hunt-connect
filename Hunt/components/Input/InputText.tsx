import {
  IconDefinition,
  faEnvelope,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  View,
  TextInput,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { UtilsSign } from "../../service/sign/utils";
import { StyleSheet } from "react-native";

interface inputTextField {
  tagName: string;
  iconName: IconDefinition; // L'icône à utiliser (e.g., faEnvelope)
  value: any; // La valeur actuelle de l'input
  onChangeText: (value: any) => void; // La fonction à appeler lors de la modification du texte
  onBlur?: () => void; // La fonction à appeler lorsque l'input perd le focus
  placeholder: string; // Le texte indicatif à afficher
  isTouched: boolean; // Booléen pour indiquer si l'input a été touché
  isValid: boolean; // Booléen pour indiquer si la valeur de l'input est valide
  errorMessage: string;
  require: boolean;
  isPassword: boolean;
  setHidePassword?: () => void;
  hiddePassword?: boolean;
}

const InputText = ({
  tagName,
  iconName, // L'icône à utiliser (e.g., faEnvelope)
  value, // La valeur actuelle de l'input
  onChangeText, // La fonction à appeler lors de la modification du texte
  onBlur, // La fonction à appeler lorsque l'input perd le focus
  placeholder, // Le texte indicatif à afficher
  isTouched, // Booléen pour indiquer si l'input a été touché
  isValid, // Booléen pour indiquer si la valeur de l'input est valide
  errorMessage,
  require,
  isPassword,
  setHidePassword,
  hiddePassword,
}: inputTextField) => {
  const { width, height } = useWindowDimensions();
  const styles = InputTextStyle(width, height); // Calculez les styles en fonction des dimensions de la fenêtre

  return (
    <>
      <Text style={styles.inputTag}>
        {tagName}
        {require && <Text style={{ color: "red" }}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputContainer,
          isTouched && (isValid ? styles.validInput : styles.invalidInput),
        ]}
      >
        <FontAwesomeIcon icon={iconName} style={styles.icon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          style={styles.input}
          secureTextEntry={hiddePassword!}
        />
        {isPassword && (
          <TouchableOpacity onPress={setHidePassword}>
            <FontAwesomeIcon
              icon={!hiddePassword ? faEye : faEyeSlash}
              size={25}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.errorMessage}>
        {errorMessage !== "" && errorMessage}
      </Text>
    </>
  );
};

export default InputText;

const InputTextStyle = (width: number, height: number) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      marginBottom: height * 0.01,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    inputTag: {
      color: "green",
      fontWeight: "bold",
      fontSize: width * 0.04,
    },
    input: {
      flex: 1,
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
    },
    icon: {
      marginRight: 10,
    },
    errorMessage: {
      color: "red",
      fontSize: 14,
      marginBottom: height * 0.02,
    },
  });
