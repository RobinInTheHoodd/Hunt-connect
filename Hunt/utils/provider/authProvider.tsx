import React, { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { UserContext } from "../../model/UserContext";
import { AxiosError } from "axios";
import { ISignUpForm, SignUpForm } from "../../model/SignUpForm";
import { AuthContext } from "../context/authContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserContext>(
    new UserContext()
  );

  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    try {
      return await auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      throw e;
    }
  }

  async function googleLogin(): Promise<any> {
    try {
      GoogleSignin.configure({
        webClientId:
          "811814541175-a1m3scn0j132t5174v88a7598tv8vdqc.apps.googleusercontent.com",
        forceCodeForRefreshToken: true,
        offlineAccess: true,
      });

      const googleCredential = await GoogleSignin.signIn()
        .then((user) => {
          return auth.GoogleAuthProvider.credential(user.idToken);
        })
        .catch(() => {});

      let user: FirebaseAuthTypes.UserCredential =
        await auth().signInWithCredential(googleCredential);

      if (user.additionalUserInfo?.isNewUser)
        return { isNew: true, signUpForm: SignUpForm.fromUserCredential(user) };
      else return { isNew: false, signUpForm: new SignUpForm() };
    } catch (error) {
      console.log(error);
    }
  }

  async function facebookLogin(): Promise<any> {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        throw "User cancelled the login process";
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw "Something went wrong obtaining access token";
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      let user: FirebaseAuthTypes.UserCredential =
        await auth().signInWithCredential(facebookCredential);

      if (user.additionalUserInfo?.isNewUser)
        return { isNew: true, signUpForm: SignUpForm.fromUserCredential(user) };
      else return { isNew: false, signUpForm: new SignUpForm() };
    } catch (error: any) {
      let err: AxiosError = error;
    }
  }

  function signOut() {
    LoginManager.logOut();
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
    return auth().signOut();
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (user: FirebaseAuthTypes.User | null) => {
        if (user) {
          let userContext = new UserContext(
            user.uid,
            user.providerData[0].providerId,
            user.displayName!,
            user.email!
          );
          setCurrentUser(userContext);
          user.getIdToken(true).then((idToken) => {
            console.log(idToken);
          });
        }
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    googleLogin,
    facebookLogin,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
