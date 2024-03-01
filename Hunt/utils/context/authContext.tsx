import React, { createContext, useContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { UserContext } from "../../model/UserContext";
import * as SecureStore from "expo-secure-store";
import { authService } from "../../service/authService";
import { AxiosError } from "axios";
import Constants from "expo-constants";
import { SignUpModel } from "../../model/SignUpModel";
import { ISignUpForm, SignUpForm } from "../../model/SignUpForm";

export interface IAuthContext {
  currentUser: UserContext;
  login: (email: string, password: string) => {};
  googleLogin: () => Promise<{ isNew: boolean; signUpForm: ISignUpForm }>;
  facebookLogin: () => Promise<{ isNew: boolean; signUpForm: ISignUpForm }>;
  signOut: () => {};
}

export const AuthContext = createContext<IAuthContext>({
  currentUser: new UserContext(),
  login: async (email: string, password: string) => {},
  googleLogin: async (): Promise<{
    isNew: boolean;
    signUpForm: ISignUpForm;
  }> => {
    return { isNew: false, signUpForm: new SignUpForm() };
  },
  facebookLogin: async (): Promise<{
    isNew: boolean;
    signUpForm: ISignUpForm;
  }> => {
    return { isNew: false, signUpForm: new SignUpForm() };
  },
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
