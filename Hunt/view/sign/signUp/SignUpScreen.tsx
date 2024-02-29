import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  useWindowDimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCheckCircle,
  faEnvelope,
  faEyeSlash,
  faHashtag,
  faL,
  faLock,
  faPhone,
  faPortrait,
  faTent,
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import InputText from "../../../components/Input/InputText";
import { UtilsSign } from "../../../service/sign/utils";
import SignUpStyle from "./SignUpStyle";

import axios from "../../../config/axiosConfig";
import { authService } from "../../../service/authService";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../../utils/context/authContext";
import { ApiError } from "../../../model/ApiError";
import { ISignUpForm } from "../../../model/SignUpForm";
import { AxiosError } from "axios";

export default function SignUpScreen({ navigation }: any) {
  const { height, width } = useWindowDimensions();
  const styles = SignUpStyle(width, height);
  const [signForm, setSignForm] = useState<ISignUpForm>({
    fullName: "Robin Mazouni",
    fullNameTouched: false,
    fullNameError: "",
    isFullNameValid: true,

    email: "robin@gmail.com",
    emailTouched: false,
    emailError: "",
    isEmailValid: true,

    phone: "8822093819",
    phoneTouched: false,
    phoneError: "",
    isPhoneValid: true,

    password: "Robin88-",
    passwordTouched: false,
    passwordError: "",
    isPasswordValid: true,
    hiddePassword: true,

    confirmPassword: "Robin88-",
    confirmPasswordTouched: false,
    confirmPasswordError: "",
    isConfirmPasswordValid: true,
    hiddeConfirmPassword: true,

    hutName: "Hut name",
    hutNameTouched: false,
    hutNameError: "",
    isHutNameValid: true,

    hutNumber: "1235467",
    hutNumberTouched: false,
    hutNumberError: "",
    isHutNumberValid: true,

    isOwner: false,
    isValidForm: false,
  });

  const [image, setImage] = useState("");
  const { login } = useAuth();
  const [shouldRegister, setShouldRegister] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const register = async () => {
    console.log("VALID");
    const resgisterRequest: ISignUpModel = {
      display_name: signForm.fullName!,
      email: signForm.email,
      password: signForm.password,
      phone: "+1" + signForm.phone,
      role: 1,
      hut_name: signForm.hutName,
      hut_number: signForm.hutNumber,
    };

    try {
      await authService.userRegisterFirebase(resgisterRequest);

      login(signForm.email, signForm.password);
    } catch (e: any) {
      const error: ApiError = {
        field: e.response.data.field,
        message: e.response.data.message,
      };

      if (error.field) {
        const formFieldName = UtilsSign.mapApiFieldToForm(error.field);
        const formFieldErrorName = formFieldName + "Error";
        console.log(error);
        console.log(formFieldName);
        console.log(formFieldErrorName);

        console.log(error.message);
        if (formFieldName) {
          setSignForm((prevForm) => ({
            ...prevForm,
            [formFieldErrorName]: error.message,
          }));
        }
      } else {
        let errorr: AxiosError = e;
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (shouldRegister) {
      const doRegistration = async () => {
        await register();
        setShouldRegister(false);
        console.log("Registration finished");
      };
      doRegistration();
    }
  }, [signForm, shouldRegister]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient
          colors={["#556b2f", "#8b4513"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Créez votre compte</Text>
          </View>

          <View style={styles.whiteBackgroundContainer}>
            <InputText
              tagName={"Prénom nom"}
              value={signForm.fullName}
              onChangeText={(value) => {
                let updateForm = UtilsSign.validateName(signForm, value);
                setSignForm({
                  ...signForm,
                  ...updateForm,
                });
              }}
              onBlur={() => {}}
              placeholder="Prénom nom"
              iconName={faPortrait}
              isTouched={signForm.fullNameTouched!}
              isValid={signForm.isFullNameValid!}
              errorMessage={signForm.fullNameError!}
              require={true}
              isPassword={false}
            />

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
              placeholder="example@gmail.com"
              iconName={faEnvelope}
              isTouched={signForm.emailTouched}
              isValid={signForm.isEmailValid}
              errorMessage={signForm.emailError}
              require={true}
              isPassword={false}
            />

            <InputText
              tagName={"Téléphone"}
              value={signForm.phone}
              onChangeText={(value) => {
                let updateForm = UtilsSign.validatePhone(signForm, value);
                setSignForm({
                  ...signForm,
                  ...updateForm,
                });
              }}
              onBlur={() => {}}
              placeholder="1234567890"
              iconName={faLock}
              isTouched={signForm.phoneTouched!}
              isValid={signForm.isPhoneValid!}
              errorMessage={signForm.phoneError!}
              require={true}
              isPassword={false}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            ></View>

            <InputText
              tagName={"Mot de passe"}
              value={signForm.password}
              onChangeText={(value) => {
                let updateForm = UtilsSign.validatePassword(signForm, value);
                setSignForm({
                  ...signForm,
                  ...updateForm,
                });
              }}
              onBlur={() => {}}
              placeholder="mot de passe"
              iconName={faLock}
              isTouched={signForm.passwordTouched}
              isValid={signForm.isPasswordValid}
              errorMessage={signForm.passwordError}
              require={true}
              isPassword={true}
              hiddePassword={signForm.hiddePassword}
              setHidePassword={() =>
                setSignForm({
                  ...signForm,
                  hiddePassword: !signForm.hiddePassword,
                })
              }
            />

            <InputText
              tagName={"Confirmation mot de passe"}
              value={signForm.confirmPassword}
              onChangeText={(value) => {
                let updateForm = UtilsSign.validateConfirmPassword(
                  signForm,
                  value
                );
                setSignForm({
                  ...signForm,
                  ...updateForm,
                });
              }}
              onBlur={() => {}}
              placeholder="mot de passe"
              iconName={faLock}
              isTouched={signForm.confirmPasswordTouched!}
              isValid={signForm.isConfirmPasswordValid!}
              errorMessage={signForm.confirmPasswordError!}
              require={true}
              isPassword={true}
              hiddePassword={signForm.hiddeConfirmPassword}
              setHidePassword={() =>
                setSignForm({
                  ...signForm,
                  hiddeConfirmPassword: !signForm.hiddeConfirmPassword,
                })
              }
            />

            <View style={styles.switchContainer}>
              <Text>Propriétaire d'une hutte ?</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={signForm.isOwner ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={() =>
                  setSignForm({ ...signForm, isOwner: !signForm.isOwner })
                }
                value={signForm.isOwner}
              />
            </View>

            {signForm.isOwner && (
              <>
                <InputText
                  tagName={"Nom de hutte"}
                  value={signForm.hutName}
                  onChangeText={(value) => {
                    let updateForm = UtilsSign.validateHutName(signForm, value);
                    setSignForm({
                      ...signForm,
                      ...updateForm,
                    });
                  }}
                  onBlur={() => {}}
                  placeholder="Hutte"
                  iconName={faTent}
                  isTouched={signForm.hutNameTouched!}
                  isValid={signForm.isHutNameValid!}
                  errorMessage={signForm.hutNameError!}
                  require={true}
                  isPassword={false}
                />

                <InputText
                  tagName={"Numéro de hutte"}
                  value={signForm.hutNumber}
                  onChangeText={(value) => {
                    let updateForm = UtilsSign.validateHutNumber(
                      signForm,
                      value
                    );
                    setSignForm({
                      ...signForm,
                      ...updateForm,
                    });
                  }}
                  onBlur={() => {}}
                  placeholder="Hutte"
                  iconName={faHashtag}
                  isTouched={signForm.hutNumberTouched!}
                  isValid={signForm.isHutNumberValid!}
                  errorMessage={signForm.hutNumberError!}
                  require={true}
                  isPassword={false}
                />

                <TouchableOpacity onPress={pickImage} style={styles.button}>
                  <Text style={[styles.buttonText, { color: "black" }]}>
                    Joindre une image
                  </Text>
                </TouchableOpacity>
                {image && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                  </View>
                )}
              </>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let isValidForm = UtilsSign.validateForm(signForm);
                setShouldRegister(isValidForm);
              }}
            >
              <LinearGradient
                colors={["#556b2f", "#8b4513"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>S'INSCRIRE</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Vous n'avez pas de compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={styles.signUpText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
