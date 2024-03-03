import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  useWindowDimensions,
} from "react-native";
import {
  faEnvelope,
  faHashtag,
  faLock,
  faPortrait,
  faTent,
  faSquare,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import InputText from "../../../components/Input/InputText";
import CguComponent from "../../../components/Input/CguComponent";
import { UtilsSign } from "../../../service/sign/utils";
import SignUpStyle from "./SignUpStyle";
import { ApiError } from "../../../model/ApiError";
import { ISignUpForm, SignUpForm } from "../../../model/SignUpForm";
import AuthService from "../../../service/authService";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen({ navigation, route }: any) {
  const { height, width } = useWindowDimensions();
  const styles = SignUpStyle(width, height);
  const [signForm, setSignForm] = useState<ISignUpForm>(new SignUpForm());

  const authService = new AuthService();

  const [image, setImage] = useState("");
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

  const doRegister = async () => {
    try {
      await authService.register(signForm);
    } catch (e: any) {
      console.log(e);
      errorRegister(e);
    }
  };

  const errorRegister = (e: any) => {
    const error: ApiError = {
      field: e.response.data.field,
      message: e.response.data.message,
    };

    if (error.field) {
      const formFieldName = UtilsSign.mapApiFieldToForm(error.field);
      const formFieldErrorName = formFieldName + "Error";
      if (formFieldName) {
        setSignForm((prevForm) => ({
          ...prevForm,
          [formFieldErrorName]: error.message,
        }));
      }
    } else {
      // TODO cas générale non connu
    }
  };

  const checkInputForm = () => {
    let checkForm = UtilsSign.checkForm(signForm);
    let isValidForm = UtilsSign.validateForm(checkForm);
    setSignForm(checkForm);
    setShouldRegister(isValidForm);
  };

  useEffect(() => {
    if (shouldRegister) {
      const doRegistration = async () => {
        await doRegister();
        setShouldRegister(false);
      };
      doRegistration();
    }
  }, [signForm, shouldRegister]);

  useEffect(() => {
    const { signForm } = route.params || false;
    if (signForm) {
      setSignForm(signForm);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView>
        <LinearGradient
          colors={["#556b2f", "#8b4513"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={
            (styles.gradient,
            { position: "absolute", top: 0, left: 0, right: 0, height: "25%" })
          }
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Créez votre compte</Text>
          </View>
        </LinearGradient>
        <ScrollView>
          <View style={{ marginTop: height * 0.1 }}>
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
                isTouched={signForm.emailTouched!}
                isValid={signForm.isEmailValid!}
                errorMessage={signForm.emailError!}
                require={true}
                isPassword={false}
                disable={signForm.emailDisable}
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
                disable={signForm.phoneDisable}
              />

              {signForm.passwordDisable && (
                <InputText
                  tagName={"Mot de passe"}
                  value={signForm.password}
                  onChangeText={(value) => {
                    let updateForm = UtilsSign.validatePassword(
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
                  isTouched={signForm.passwordTouched!}
                  isValid={signForm.isPasswordValid!}
                  errorMessage={signForm.passwordError!}
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
              )}

              {signForm.confirmPasswordDisable && (
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
              )}

              <View style={styles.switchContainer}>
                <Text>Propriétaire d'une hutte ?</Text>
                <Switch
                  trackColor={{
                    false: "#767577",
                    true: "#556b2f",
                  }}
                  thumbColor={signForm.isOwner ? "#8b4513" : "#f4f3f4"}
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
                      let updateForm = UtilsSign.validateHutName(
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
                  {/*
                  
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
                  */}
                </>
              )}

              <View style={{ marginTop: "5%" }}>
                <CguComponent />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  checkInputForm();
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
                <Text style={styles.footerText}>Vous avez un compte ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SignIn");
                  }}
                >
                  <Text style={styles.signUpText}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
