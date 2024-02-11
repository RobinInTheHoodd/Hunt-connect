import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UtilsSign } from "../service/sign/utils";

export default function SignInScreen() {
  const [signForm, setSignForm] = useState<SignInForm>({
    email: "",
    password: "",
  });

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
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
            <TextInput
              value={signForm.email}
              onChangeText={(value) =>
                setSignForm({ ...signForm, email: value })
              }
              placeholder="Email"
              style={styles.input}
            />
          </View>

          <Text style={styles.inputTag}>Password</Text>
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} style={styles.icon} />
            <TextInput
              value={signForm.password}
              onChangeText={(value) =>
                setSignForm({ ...signForm, password: value })
              }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
  },
  signInText: {
    fontSize: 35,
    color: "white",
    fontWeight: "normal",
  },
  whiteBackgroundContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 50,
    paddingTop: 70,
    flex: 1,
    width: "100%",
    padding: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  inputTag: {
    color: "green",
    fontWeight: "bold",
    fontSize: 15,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 18,
    color: "black",
  },
  signInButton: {
    padding: 0,
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 70,
  },
  signInButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  signUpContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingVertical: 20,
    marginTop: 80,
  },
  textNormal: {
    fontSize: 16,
    color: "gray",
  },
  textSignUp: {
    fontSize: 18,
    color: "black",
    marginTop: 5,
    fontWeight: "bold",
  },
});
