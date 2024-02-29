import React, { createContext, useContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { UserContext } from "../../model/UserContext";
import * as SecureStore from "expo-secure-store";
import { authService } from "../../service/authService";
import { AxiosError } from "axios";
import Constants from "expo-constants";

async function save(key: any, value: any) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: any) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log(result);
  } else {
  }
}

export interface IAuthContext {
  currentUser: UserContext;
  login: (email: string, password: string) => {};
  googleLogin: () => {};
  facebookLogin: () => {};
  signOut: () => {};
}

const AuthContext = createContext<IAuthContext>({
  currentUser: new UserContext(),
  login: async (email: string, password: string) => {},
  googleLogin: async () => {},
  facebookLogin: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserContext>(
    new UserContext()
  );
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    try {
      return auth().signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      throw e;
    }
  }

  async function googleLogin() {
    try {
      GoogleSignin.configure({
        webClientId: "", //Constants.manifest2?.extra.EXPO_PUBLIC_API_URL_GOOGLE_WEB_ID,
        forceCodeForRefreshToken: true,
        offlineAccess: true,
      });

      const googleCredential = await GoogleSignin.signIn().then((user) => {
        return auth.GoogleAuthProvider.credential(user.idToken);
      });

      let user: FirebaseAuthTypes.UserCredential =
        await auth().signInWithCredential(googleCredential);

      if (user.additionalUserInfo?.isNewUser) {
        let userSignUp: ISignUpModel = {
          display_name: user.user.displayName!,
          email: user.user.email!,
          phone: user.user.phoneNumber || "",
          role: 1,
          hut_name: "",
          hut_number: "11234",
        };

        await authService.userRegister(userSignUp);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function facebookLogin() {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);
      if (result.isCancelled) {
        throw "User cancelled the login process";
      }
      console.log(result);
      const data = await AccessToken.getCurrentAccessToken();
      console.log(data);
      if (!data) {
        throw "Something went wrong obtaining access token";
      }

      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );
      console.log(facebookCredential);

      let user: FirebaseAuthTypes.UserCredential =
        await auth().signInWithCredential(facebookCredential);
      console.log(user);
      if (user.additionalUserInfo?.isNewUser) {
        let userSignUp: ISignUpModel = {
          UUID: user.user.uid,
          display_name: user.user.displayName!,
          email: user.user.email!,
          phone: user.user.phoneNumber || "",
          role: 1,
          hut_name: "",
          hut_number: "11234",
        };

        await authService.userRegister(userSignUp);
      }

      return;
    } catch (error: any) {
      let err: AxiosError = error;
      console.log(err.response);
      console.error(err);
    }
  }

  function signOut() {
    getValueFor("Token");
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
            save("Token", idToken);
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
