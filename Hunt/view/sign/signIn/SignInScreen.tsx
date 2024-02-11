import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faL, faLock } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UtilsSign } from "../../../service/sign/utils";
import SignInStyle from "./SignInStyle";

export default function SignInScreen() {
  const { height, width } = useWindowDimensions();
  const styles = SignInStyle(width, height);

  const [signForm, setSignForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#556b2f", "#8b4513"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Bonjour</Text>
          <Text style={styles.signInText}>Se connecter !</Text>
        </View>

        <View style={styles.whiteBackgroundContainer}>
          <Text style={styles.inputTag}>
            Email<Text style={{ color: "red" }}> *</Text>
          </Text>

          <View
            style={[
              styles.inputContainer,
              emailTouched &&
                (isEmailValid ? styles.validInput : styles.invalidInput),
            ]}
          >
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <TextInput
              value={signForm.email}
              onChangeText={(value) => {
                setSignForm({ ...signForm, email: value });
                if (!emailTouched) setEmailTouched(true);
                setIsEmailValid(UtilsSign.validateEmail(value));
              }}
              onBlur={() => signForm.email == "" && setEmailTouched(false)}
              placeholder="Email"
              style={styles.input}
            />
          </View>

          <Text style={styles.inputTag}>
            Password<Text style={{ color: "red" }}> *</Text>
          </Text>
          <View
            style={[
              styles.inputContainer,
              passwordTouched &&
                (isPasswordValid ? styles.validInput : styles.invalidInput),
            ]}
          >
            <FontAwesomeIcon icon={faLock} style={styles.icon} />
            <TextInput
              value={signForm.password}
              onChangeText={(value) => {
                setSignForm({ ...signForm, password: value });
                if (!passwordTouched) setPasswordTouched(true);
                setIsPasswordValid(UtilsSign.validatePassword(value));
              }}
              onBlur={() => signForm.password == "" && setEmailTouched(false)}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => console.log(UtilsSign.validateEmail(signForm.email))}
          >
            <LinearGradient
              colors={["#556b2f", "#8b4513"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.signInButtonGradient}
            >
              <Text style={styles.signInButtonText}>SE CONNECTER</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.textNormal}>Vous n'avez pas de compte ?</Text>
            <TouchableOpacity onPress={() => console.log("touch")}>
              <Text style={styles.textSignUp}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
