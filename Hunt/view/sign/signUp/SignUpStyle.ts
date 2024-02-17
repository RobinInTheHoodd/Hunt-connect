import { StyleSheet } from "react-native";
import SignUpScreen from "./SignUpScreen";

const SignUpStyle = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: width * 0.08,
      paddingTop: height * 0.1,
      alignItems: "flex-start",
    },
    headerText: {
      fontSize: width * 0.09,
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
      padding: width * 0.02,
    },
    icon: {
      color: "#6D3358",
      marginRight: width * 0.02,
    },
    button: {
      padding: 0,
      borderRadius: width * 0.05,
      marginTop: height * 0.03,
      paddingBottom: height * 0.01,
      width: "80%",
      alignSelf: "center",
      overflow: "hidden",
    },
    buttonGradient: {
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.09,
      borderRadius: width * 0.05,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontSize: width * 0.045,
      color: "white",
      fontWeight: "bold",
    },
    footerContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      paddingTop: height * 0.02,
    },
    footerText: {
      fontSize: width * 0.04,
      color: "gray",
    },
    signUpText: {
      fontSize: width * 0.045,
      color: "black",
      marginTop: height * 0.005,
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
      width: width * 0.9,
      height: height * 0.3,
    },
  });

export default SignUpStyle;
