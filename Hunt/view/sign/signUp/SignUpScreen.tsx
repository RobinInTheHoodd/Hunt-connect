import React, { useState } from "react";
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

export default function SignUpScreen() {
  const { height, width } = useWindowDimensions();
  const styles = SignInStyle(width, height);
  const [signForm, setSignForm] = useState<SignUpForm>({
    fullName: "",
    fullNameTouched: false,
    fullNameError: "",
    isFullNameValid: false,

    email: "",
    emailTouched: false,
    emailError: "",
    isEmailValid: false,

    phone: "",
    phoneTouched: false,
    phoneError: "",
    isPhoneValid: false,

    password: "",
    passwordTouched: false,
    passwordError: "",
    isPasswordValid: false,
    hiddePassword: true,

    confirmPassword: "",
    confirmPasswordTouched: false,
    confirmPasswordError: "",
    isConfirmPasswordValid: false,
    hiddeConfirmPassword: true,

    hutName: "",
    hutNameTouched: false,
    hutNameError: "",
    isHutNameValid: false,

    hutNumber: "",
    hutNumberTouched: false,
    hutNumberError: "",
    isHutNumberValid: false,
  });

  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [isFullNameValid, setIsFullNameValid] = useState(false);
  const [fullNameError, setFullNameError] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOwner, setIsOwner] = useState(false);
  const [hutteName, setHutteName] = useState("");
  const [hutteNumber, setHutteNumber] = useState("");
  const [image, setImage] = useState("");

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
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
                setSignForm({
                  ...signForm,
                  fullName: value,
                  isFullNameValid: UtilsSign.validateEmail(value),
                });
              }}
              onBlur={() =>
                signForm.fullName == ""
                  ? setSignForm({ ...signForm, fullNameTouched: false })
                  : setSignForm({ ...signForm, fullNameTouched: true })
              }
              placeholder="Prénom nom"
              iconName={faPortrait}
              isTouched={signForm.fullNameTouched}
              isValid={signForm.isFullNameValid}
              errorMessage={signForm.fullNameError}
              require={true}
              isPassword={false}
            />

            <InputText
              tagName={"Email"}
              value={signForm.email}
              onChangeText={(value) => {
                setSignForm({
                  ...signForm,
                  email: value,
                  isEmailValid: UtilsSign.validateEmail(value),
                });
              }}
              onBlur={() =>
                signForm.email == ""
                  ? setSignForm({
                      ...signForm,
                      emailTouched: false,
                    })
                  : setSignForm({
                      ...signForm,
                      emailTouched: true,
                    })
              }
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
                setSignForm({
                  ...signForm,
                  phone: value,
                  isPhoneValid: UtilsSign.validateEmail(value),
                });
              }}
              onBlur={() =>
                signForm.phone == ""
                  ? setSignForm({
                      ...signForm,
                      phoneTouched: false,
                    })
                  : setSignForm({
                      ...signForm,
                      phoneTouched: true,
                    })
              }
              placeholder="1234567890"
              iconName={faLock}
              isTouched={signForm.phoneTouched}
              isValid={signForm.isPhoneValid}
              errorMessage={signForm.phoneError}
              require={true}
              isPassword={false}
            />

            <InputText
              tagName={"Mot de passe"}
              value={signForm.password}
              onChangeText={(value) => {
                setSignForm({
                  ...signForm,
                  password: value,
                  isPasswordValid: UtilsSign.validateEmail(value),
                });
              }}
              onBlur={() =>
                signForm.password == ""
                  ? setSignForm({
                      ...signForm,
                      passwordTouched: false,
                    })
                  : setSignForm({
                      ...signForm,
                      passwordTouched: true,
                    })
              }
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
              value={signForm.hiddeConfirmPassword}
              onChangeText={(value) => {
                setSignForm({
                  ...signForm,
                  confirmPassword: value,
                  isConfirmPasswordValid: UtilsSign.validateEmail(value),
                });
              }}
              onBlur={() =>
                signForm.password == ""
                  ? setSignForm({
                      ...signForm,
                      confirmPasswordTouched: false,
                    })
                  : setSignForm({
                      ...signForm,
                      confirmPasswordTouched: true,
                    })
              }
              placeholder="mot de passe"
              iconName={faLock}
              isTouched={signForm.confirmPasswordTouched}
              isValid={signForm.isConfirmPasswordValid}
              errorMessage={signForm.confirmPasswordError}
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
                thumbColor={isOwner ? "#f5dd4b" : "#f4f3f4"}
                onValueChange={() =>
                  setIsOwner((previousState) => !previousState)
                }
                value={isOwner}
              />
            </View>

            {isOwner && (
              <>
                <InputText
                  tagName={"Nom de hutte"}
                  value={signForm.hutName}
                  onChangeText={(value) => {
                    setSignForm({
                      ...signForm,
                      hutName: value,
                      isHutNameValid: UtilsSign.validateEmail(value),
                    });
                  }}
                  onBlur={() =>
                    signForm.hutName == ""
                      ? setSignForm({
                          ...signForm,
                          hutNameTouched: false,
                        })
                      : setSignForm({
                          ...signForm,
                          hutNameTouched: true,
                        })
                  }
                  placeholder="Hutte"
                  iconName={faTent}
                  isTouched={signForm.hutNameTouched}
                  isValid={signForm.isHutNameValid}
                  errorMessage={signForm.hutNameError}
                  require={true}
                  isPassword={false}
                />

                <InputText
                  tagName={"Numéro de hutte"}
                  value={signForm.hutNumber}
                  onChangeText={(value) => {
                    setSignForm({
                      ...signForm,
                      hutNumber: value,
                      isHutNumberValid: UtilsSign.validateEmail(value),
                    });
                  }}
                  onBlur={() =>
                    signForm.hutNumber == ""
                      ? setSignForm({
                          ...signForm,
                          hutNumberTouched: false,
                        })
                      : setSignForm({
                          ...signForm,
                          hutNumberTouched: true,
                        })
                  }
                  placeholder="Hutte"
                  iconName={faHashtag}
                  isTouched={signForm.hutNumberTouched}
                  isValid={signForm.isHutNumberValid}
                  errorMessage={signForm.hutNumberError}
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
              onPress={() =>
                setSignForm({ ...signForm, fullNameError: "Email invlaid" })
              }
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
              <TouchableOpacity onPress={() => console.log("Pas de compte")}>
                <Text style={styles.signUpText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const SignInStyle = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
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

    input: {
      flex: 1,
      padding: 10,
    },
    icon: {
      color: "#6D3358",
      marginRight: 10,
    },
    button: {
      padding: 0,
      borderRadius: 20,
      marginTop: 30,
      width: "80%",
      alignSelf: "center",
      overflow: "hidden",
    },
    buttonGradient: {
      paddingVertical: 12,
      paddingHorizontal: 36,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: 18,
      color: "white",
      fontWeight: "bold",
    },
    footerContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      paddingVertical: 20,
      marginTop: 50,
    },
    footerText: {
      fontSize: 16,
      color: "gray",
    },
    signUpText: {
      fontSize: 18,
      color: "black",
      marginTop: 5,
      fontWeight: "bold",
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    imageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: 350,
      height: 250,
    },
  });
