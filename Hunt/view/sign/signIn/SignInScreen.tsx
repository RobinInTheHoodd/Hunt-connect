import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faGoogle,
  faApple,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

import { faEnvelope, faL, faLock } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { UtilsSign } from "../../../service/sign/utils";
import SignInStyle from "./SignInStyle";
import InputText from "../../../components/Input/InputText";
import { IAuthContext, useAuth } from "../../../utils/context/authContext";
import { ISignUpForm } from "../../../model/SignUpForm";
import { ApiError } from "../../../model/ApiError";
import { FirebaseError } from "../../../utils/firebaseError";
import { utils } from "@react-native-firebase/app";

export default function SignInScreen({ navigation }: any) {
  const {
    googleLogin,
    facebookLogin,
    signOut,
    currentUser,
    login,
  }: IAuthContext = useAuth();

  const { height, width } = useWindowDimensions();
  const styles = SignInStyle(width, height);
  const [shouldLogin, setShouldLogin] = useState(false);

  const [signForm, setSignForm] = useState<ISignUpForm>({
    email: "robin@gmail.com",
    emailTouched: false,
    emailError: "",
    isEmailValid: true,

    password: "Robin88-",
    passwordTouched: false,
    passwordError: "",
    isPasswordValid: true,
    hiddePassword: true,

    isValidForm: true,
  });

  useEffect(() => {
    if (shouldLogin) {
      doLogin();
    }
  }, [signForm, shouldLogin, currentUser]);

  const doLogin = async () => {
    try {
      await login(signForm.email, signForm.password);
      setShouldLogin(false);
    } catch (e: any) {
      let updateSignForm: any;
      setShouldLogin(false);
      setSignForm((prevForm) => ({
        ...prevForm,
        isValidForm: false,
      }));

      if (e.code) {
        updateSignForm = UtilsSign.ErrorForm(signForm, e.code);
      } else {
        console.log("Autre error");
      }
      setSignForm((prevForm) => ({
        ...prevForm,
        ...updateSignForm,
      }));
    }
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
          <InputText
            tagName={"Email"}
            value={signForm.email}
            onChangeText={(value) => {
              let updateForm = UtilsSign.validateEmail(signForm, value);
              setSignForm({
                ...signForm,
                ...updateForm,
              });
            }}
            onBlur={() => {}}
            placeholder="Email"
            iconName={faEnvelope}
            isTouched={signForm.emailTouched}
            isValid={signForm.isEmailValid}
            errorMessage={signForm.emailError}
            require={true}
            isPassword={false}
          />

          <InputText
            tagName={"Password"}
            value={signForm.password}
            onChangeText={(value) => {
              let updateForm = UtilsSign.validatePassword(signForm, value);
              setSignForm({
                ...signForm,
                ...updateForm,
              });
            }}
            onBlur={() => {}}
            placeholder="Password"
            iconName={faLock}
            isTouched={signForm.passwordTouched}
            isValid={signForm.isPasswordValid}
            errorMessage={signForm.passwordError}
            require={true}
            isPassword={true}
            setHidePassword={() =>
              setSignForm({
                ...signForm,
                hiddePassword: !signForm.hiddePassword,
              })
            }
            hiddePassword={signForm.hiddePassword}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              let isValidForm = UtilsSign.validateForm(signForm);
              console.log(isValidForm);
              console.log(signForm);
              setShouldLogin(isValidForm);
            }}
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
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => googleLogin()}
                >
                  <FontAwesomeIcon icon={faGoogle} size={40} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.iconButton}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => console.log(currentUser)}
                >
                  <FontAwesomeIcon icon={faApple} size={40} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>

              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.iconButton}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => facebookLogin()}
                >
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

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.textSignUp}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
