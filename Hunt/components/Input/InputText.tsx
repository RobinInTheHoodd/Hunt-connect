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
  KeyboardTypeOptions,
} from "react-native";
import { UtilsSign } from "../../service/sign/utils";
import { StyleSheet } from "react-native";

interface inputTextField {
  tagName: string;
  iconName: IconDefinition;
  value: any;
  onChangeText: (value: any) => void;
  onBlur?: () => void;
  placeholder: string;
  isTouched: boolean;
  isValid: boolean;
  errorMessage: string;
  require: boolean;
  isPassword: boolean;
  setHidePassword?: () => void;
  hiddePassword?: boolean;
  disable?: boolean;
  styles: any;
  isIconRight?: boolean;
  setIconRight?: () => void;
  IconRight?: IconDefinition;
  keyboard?: KeyboardTypeOptions | undefined;
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
  styles,
  isIconRight,
  setIconRight,
  IconRight,
  keyboard,
}: inputTextField) => {
  const { width, height } = useWindowDimensions();
  //const styles = InputTextStyle(width, height);

  return (
    <View style={styles.container}>
      {tagName && (
        <Text style={styles.inputTag}>
          {tagName}
          {require && <Text style={{ color: "red" }}> *</Text>}
        </Text>
      )}

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
          keyboardType={keyboard != undefined ? keyboard : "default"}
        />
        {isIconRight && (
          <TouchableOpacity onPress={setIconRight}>
            <FontAwesomeIcon icon={IconRight!} size={20}></FontAwesomeIcon>
          </TouchableOpacity>
        )}
        {isPassword && (
          <TouchableOpacity onPress={setHidePassword}>
            <FontAwesomeIcon
              icon={!hiddePassword ? faEye : faEyeSlash}
              size={25}
            ></FontAwesomeIcon>
          </TouchableOpacity>
        )}
      </View>

      {errorMessage !== "" && (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
    </View>
  );
};

export default InputText;
