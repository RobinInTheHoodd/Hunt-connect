import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
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
import { ISignUpForm, SignUpForm } from "../../../model/form/SignUpForm";
import { ApiError } from "../../../model/ApiError";
import AuthService from "../../../service/authService";
import { Utils } from "@react-native-firebase/app";

export default function SignInScreen({ navigation, route }: any) {
  const { height, width } = useWindowDimensions();
  const styles = SignInStyle(width, height);

  const authService = new AuthService();

  const [shouldLogin, setShouldLogin] = useState(false);
  const [signForm, setSignForm] = useState<ISignUpForm>(new SignUpForm());

  useEffect(() => {
    if (shouldLogin) {
      doLogin();
      setShouldLogin(false);
    }
  }, [shouldLogin]);

  useEffect(() => {
    console.log("SIGNIN");
    setSignForm(new SignUpForm());
  }, [route?.params]);

  const signInGoogle = async () => {
    try {
      await authService.googleLogin(navigation);
    } catch (e: any) {
      errorLogin(e);
    }
  };

  const signInFacebook = async () => {
    try {
      await authService.facebookLogin(navigation);
    } catch (e: any) {
      errorLogin(e);
    }
  };

  const doLogin = async () => {
    try {
      await authService.login(signForm.email!, signForm.password!);
    } catch (e: any) {
      setShouldLogin(false);
      errorLogin(e);
    }
  };

  const errorLogin = async (e: any) => {
    let updateSignForm: any;
    console.log(e);
    if (e.code) {
      updateSignForm = UtilsSign.ErrorForm(signForm, e.code);
    } else {
      console.log("Autre error");
    }

    setSignForm((prevForm) => ({
      ...prevForm,
      isValidForm: false,
      ...updateSignForm,
    }));
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
            isTouched={signForm.emailTouched!}
            isValid={signForm.isEmailValid!}
            errorMessage={signForm.emailError!}
            require={true}
            isPassword={false}
            styles={InputTextStyle(width, height)}
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
            isTouched={signForm.passwordTouched!}
            isValid={signForm.isPasswordValid!}
            errorMessage={signForm.passwordError!}
            require={true}
            isPassword={true}
            setHidePassword={() =>
              setSignForm({
                ...signForm,
                hiddePassword: !signForm.hiddePassword,
              })
            }
            hiddePassword={signForm.hiddePassword}
            styles={InputTextStyle(width, height)}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              let isValidForm = UtilsSign.validateSignInForm(signForm);
              if (isValidForm) {
                doLogin();
              } else {
                setSignForm(UtilsSign.checkForm(signForm));
              }
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
                  onPress={async () => {
                    await signInGoogle();
                  }}
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
                  onPress={() => console.log("facebook")}
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
                  onPress={async () => {
                    await signInFacebook();
                  }}
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
