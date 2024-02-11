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
import { UtilsSign } from "../service/sign/utils";

export default function SignInScreen() {
  const [signForm, setSignForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const { height, width } = useWindowDimensions();
  const styles = getStyles(width, height);

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
          <Text style={styles.inputTag}>Email</Text>
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

          <Text style={styles.inputTag}>Password</Text>
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

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: "8%",
      paddingTop: height * 0.1,
      alignItems: "flex-start",
    },
    headerText: {
      fontSize: width * 0.08,
      color: "white",
      fontWeight: "bold",
    },
    signInText: {
      fontSize: width * 0.08,
      color: "white",
      fontWeight: "normal",
    },
    whiteBackgroundContainer: {
      backgroundColor: "white",
      borderTopLeftRadius: width * 0.07,
      borderTopRightRadius: width * 0.07,
      marginTop: height * 0.05,
      paddingTop: "10%",
      flex: 1,
      width: "100%",
      padding: "10%",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      marginBottom: height * 0.06,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    icon: {
      marginRight: 10,
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
    forgotPassword: {
      alignSelf: "flex-end",
    },
    forgotPasswordText: {
      fontSize: width * 0.04,
      color: "black",
    },
    signInButton: {
      marginTop: height * 0.04,
      borderRadius: 30,
      overflow: "hidden",
    },
    signInButtonGradient: {
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.1,
      alignItems: "center",
      justifyContent: "center",
    },
    signInButtonText: {
      fontSize: width * 0.045,
      color: "white",
      fontWeight: "bold",
    },
    signUpContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginTop: height * 0.1,
    },
    textNormal: {
      fontSize: width * 0.04,
      color: "gray",
    },
    textSignUp: {
      fontSize: width * 0.045,
      color: "black",
      marginTop: 5,
      fontWeight: "bold",
    },
  });
