import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Use } from "react-native-svg";

interface IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;
  isNew: boolean;
}

export class UserContext implements IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;
  isNew: boolean;

  constructor(
    UIID?: string,
    provider?: string,
    displayName?: string,
    email?: string,
    isNew?: boolean
  ) {
    this.UIID = UIID || "";
    this.provider = provider || "";
    this.displayName = displayName || "";
    this.email = email || "";
    this.isNew = isNew == undefined ? true : isNew;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromUserCredential = (
    userCredential: FirebaseAuthTypes.UserCredential
  ) => {
    console.log(userCredential.additionalUserInfo!.isNewUser ? true : false);
    return new UserContext(
      userCredential.user.uid || "",
      userCredential.user.providerId || "",
      userCredential.user.displayName || "",
      userCredential.user.email!,
      userCredential.additionalUserInfo!.isNewUser
    );
  };
}
