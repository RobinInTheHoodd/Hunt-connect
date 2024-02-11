import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckCircle, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";

export default function SignUpScreen() {
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
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
              />
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone or Gmail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <FontAwesomeIcon
                icon={faEyeSlash}
                size={20}
                style={styles.icon}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
              />
              <FontAwesomeIcon
                icon={faEyeSlash}
                size={20}
                style={styles.icon}
              />
            </View>

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
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Nom de la hutte"
                    value={hutteName}
                    onChangeText={setHutteName}
                    style={styles.input}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Numéro de la hutte"
                    value={hutteNumber}
                    onChangeText={setHutteNumber}
                    style={styles.input}
                  />
                </View>
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
              onPress={() => console.log("Resgister")}
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

const styles = StyleSheet.create({
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
    marginVertical: 20,
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
