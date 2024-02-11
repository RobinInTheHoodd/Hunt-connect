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
import {
  faGoogle,
  faApple,
  faInstagram,
  faTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faL,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
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

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [hidePassword, setHidePassword] = useState(true);

  const validateEmail = () => {
    setEmailError(isEmailValid ? "" : "Adresse email invalide");
    setPasswordError(isEmailValid ? "" : "password invalide");
  };

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

          <Text style={styles.errorMessage}>
            {emailError !== "" && emailError}
          </Text>

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
              secureTextEntry={hidePassword}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
              <FontAwesomeIcon
                icon={!hidePassword ? faEye : faEyeSlash}
                size={25}
              ></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
          <Text style={styles.errorMessage}>
            {passwordError !== "" && passwordError}
          </Text>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => validateEmail()}
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

          <View style={styles.footerContainer}>
            <Text style={styles.socialMediaLoginText}>
              Connectez-vous avec les réseaux sociaux
            </Text>
            <View style={styles.socialMediaIcons}>
              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.iconButton}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <FontAwesomeIcon icon={faGoogle} size={40} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.iconButton}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <FontAwesomeIcon icon={faApple} size={40} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.iconButton}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    size={40}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>

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
