import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { UserContext } from "../model/UserContext";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setIsNew, signIn, signOut } from "../redux/reducers/userSlice";
import { ISignUpForm, SignUpForm } from "../model/form/SignUpForm";
import { AppDispatch } from "../redux/store";
import { ISignUpModel, SignUpModel } from "../model/SignUpModel";
import { authController } from "./authController";

export default class AuthService {
  dispatch: AppDispatch;
  user = useAppSelector((state) => state.users);
  constructor() {
    this.dispatch = useAppDispatch();
  }

  async register(signForm: ISignUpForm): Promise<void> {
    const resgisterRequest: ISignUpModel = SignUpModel.fromSignUpForm(signForm);

    try {
      await authController.userRegister(resgisterRequest);
      if (resgisterRequest.UUID == "")
        await this.login(signForm.email!, signForm.password!);
      else {
        this.dispatch(setIsNew("false"));
      }
    } catch (e: any) {
      throw e;
    }
  }

  async signOut(): Promise<void> {
    try {
      this.dispatch(signOut());
    } catch (e: any) {}
  }

  async login(email: string, password: string): Promise<void> {
    let userCredential: FirebaseAuthTypes.UserCredential;
    let userContext: UserContext;
    try {
      userCredential = await auth().signInWithEmailAndPassword(email, password);
      userContext = UserContext.fromUserCredential(userCredential);
      this.dispatch(signIn(JSON.stringify(userContext)));
    } catch (e: any) {
      console.log(e);
    }
  }

  async googleLogin(navigation: any): Promise<void> {
    let googleCredential: FirebaseAuthTypes.AuthCredential;
    let userCredential: FirebaseAuthTypes.UserCredential;
    let userContext: UserContext;

    try {
      googleCredential = await this._getGoogleCredential();

      userCredential = await auth().signInWithCredential(googleCredential);

      if (userCredential.additionalUserInfo?.isNewUser) {
        userContext = UserContext.fromUserCredential(userCredential);
        this.dispatch(signIn(JSON.stringify(userContext)));
        navigation.navigate("SignUp", {
          signForm: SignUpForm.fromUserCredential(userCredential),
        });
      } else {
        userContext = UserContext.fromUserCredential(userCredential);
        this.dispatch(signIn(JSON.stringify(userContext)));
      }
    } catch (error) {
      JSON.stringify(error);
      console.log(error);
    }
  }

  private async _getGoogleCredential(): Promise<FirebaseAuthTypes.AuthCredential> {
    GoogleSignin.configure({
      webClientId:
        "811814541175-a1m3scn0j132t5174v88a7598tv8vdqc.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
      offlineAccess: true,
    });

    return await GoogleSignin.signIn()
      .then((user) => {
        return auth.GoogleAuthProvider.credential(user.idToken);
      })
      .catch((e: any) => {
        throw e;
      });
  }

  async facebookLogin(navigation: any): Promise<void> {
    let facebookCredential: FirebaseAuthTypes.AuthCredential;
    let userCredential: FirebaseAuthTypes.UserCredential;
    let userContext: UserContext;

    try {
      facebookCredential = await this._facebookCredential();

      userCredential = await auth().signInWithCredential(facebookCredential);

      if (userCredential.additionalUserInfo?.isNewUser) {
        userContext = UserContext.fromUserCredential(userCredential);
        this.dispatch(signIn(JSON.stringify(userContext)));
        navigation.navigate("SignUp", {
          signForm: SignUpForm.fromUserCredential(userCredential),
        });
      } else {
        userContext = UserContext.fromUserCredential(userCredential);
        this.dispatch(signIn(JSON.stringify(userContext)));
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  private async _facebookCredential(): Promise<FirebaseAuthTypes.AuthCredential> {
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

    return auth.FacebookAuthProvider.credential(data.accessToken);
  }
}
