import { StyleSheet } from "react-native";

const SignInStyle = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientBackground: {
      flex: 1,
    },
    headerContainer: {
      paddingHorizontal: "8%",
      paddingTop: height * 0.1,
      alignItems: "flex-start",
    },
    headerText: {
      fontSize: width * 0.08,
      color: "white",
      fontWeight: "bold",
    },
    signInText: {
      fontSize: width * 0.08,
      color: "white",
      fontWeight: "normal",
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
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      marginBottom: height * 0.06,
    },
    invalidInput: {
      borderBottomColor: "red",
    },
    validInput: {
      borderBottomColor: "green",
    },
    icon: {
      marginRight: 10,
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
    forgotPassword: {
      alignSelf: "flex-end",
    },
    forgotPasswordText: {
      fontSize: width * 0.04,
      color: "black",
    },
    signInButton: {
      marginTop: height * 0.04,
      borderRadius: 30,
      overflow: "hidden",
    },
    signInButtonGradient: {
      paddingVertical: height * 0.015,
      paddingHorizontal: width * 0.1,
      alignItems: "center",
      justifyContent: "center",
    },
    signInButtonText: {
      fontSize: width * 0.045,
      color: "white",
      fontWeight: "bold",
    },
    signUpContainer: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      marginTop: height * 0.1,
    },
    textNormal: {
      fontSize: width * 0.04,
      color: "gray",
    },
    textSignUp: {
      fontSize: width * 0.045,
      color: "black",
      marginTop: 5,
      fontWeight: "bold",
    },
  });

export default SignInStyle;
