import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SignInStyle from "../sign/signIn/SignInStyle";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import AuthService from "../../service/authService";

export default function HomeScreen({ navigation }: any) {
  const { height, width } = useWindowDimensions();
  const styles = SignInStyle(width, height);

  const user = useAppSelector((state) => state.users);
  const authService = new AuthService();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#556b2f", "#8b4513"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Acceuil</Text>
          <Text style={styles.signInText}>Bonjour !</Text>
        </View>

        <Text style={styles.textSignUp}>{user.displayName}</Text>
        <View style={styles.whiteBackgroundContainer}>
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={async () => authService.signOut()}>
              <Text style={styles.textSignUp}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
