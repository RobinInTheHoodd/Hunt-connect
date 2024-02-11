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
    errorMessage: {
      color: "red",
      fontSize: 14,
      marginBottom: height * 0.02,
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
      marginBottom: height * 0.01,
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
      marginTop: height * 0.05,
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
    footerContainer: {
      justifyContent: "flex-end",
      alignItems: "center",
    },
    socialMediaLoginText: {
      fontSize: 14,
      color: "black",
      paddingVertical: height * 0.04,
    },
    socialMediaIcons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    socialIcon: {
      marginHorizontal: width * 0.05,
      backgroundColor: "black",
      borderRadius: width + height / 2,
      width: width * 0.1,
      height: height * 0.1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: width * 0.1,
    },
    iconButton: {
      marginHorizontal: width * 0.05,
      borderRadius: (width * 0.19) / 2,
      width: width * 0.19,
      height: width * 0.19,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
  });

export default SignInStyle;
