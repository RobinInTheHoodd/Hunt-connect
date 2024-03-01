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
  iconName: IconDefinition; // L'icône à utiliser
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
  disable?: boolean;
}

const InputText = ({
  tagName,
  iconName,
  value,
  onChangeText,
  onBlur,
  placeholder,
  isTouched,
  isValid,
  errorMessage,
  require,
  isPassword,
  setHidePassword,
  hiddePassword,
  disable,
}: inputTextField) => {
  const { width, height } = useWindowDimensions();
  const styles = InputTextStyle(width, height);

  return (
    <>
      <Text style={styles.inputTag}>
        {tagName}
        {require && <Text style={{ color: "red" }}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputContainer,
          isTouched &&
            (errorMessage == "" && isValid
              ? styles.validInput
              : styles.invalidInput),
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
          editable={disable}
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

      <Text
        style={[
          styles.errorMessage,
          { marginBottom: errorMessage === "" ? -20 : height * 0.02 },
        ]}
      >
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
    },
  });
