import { StyleSheet } from "react-native";
import SignUpScreen from "./SignUpScreen";

const SignUpStyle = (screenWidth: number, screenHeight: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: screenWidth * 0.08,
      paddingTop: screenHeight * 0.1,
      alignItems: "flex-start",
    },
    headerText: {
      fontSize: screenWidth * 0.09,
      color: "white",
      fontWeight: "bold",
    },
    whiteBackgroundContainer: {
      backgroundColor: "white",
      borderTopLeftRadius: screenWidth * 0.07,
      borderTopRightRadius: screenWidth * 0.07,
      marginTop: screenHeight * 0.05,
      paddingTop: screenHeight * 0.05,
      flex: 1,
      width: "100%",
      padding: screenWidth * 0.05,
    },
    input: {
      flex: 1,
      padding: screenWidth * 0.02,
    },
    icon: {
      color: "#6D3358",
      marginRight: screenWidth * 0.02,
    },
    button: {
      padding: 0,
      borderRadius: screenWidth * 0.05,
      marginTop: screenHeight * 0.03,
      paddingBottom: screenHeight * 0.01,
      width: "80%",
      alignSelf: "center",
      overflow: "hidden",
    },
    buttonGradient: {
      paddingVertical: screenHeight * 0.015,
      paddingHorizontal: screenWidth * 0.09,
      borderRadius: screenWidth * 0.05,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: screenWidth * 0.045,
      color: "white",
      fontWeight: "bold",
    },
    footerContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      paddingTop: screenHeight * 0.05,
    },
    footerText: {
      fontSize: screenWidth * 0.04,
      color: "gray",
    },
    signUpText: {
      fontSize: screenWidth * 0.045,
      color: "black",
      marginTop: screenHeight * 0.005,
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
      width: screenWidth * 0.9,
      height: screenHeight * 0.3,
    },
  });

export default SignUpStyle;
