import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;
  isNew: boolean;
  huntSession: number[];
  observations: number[];
  personnalHutID: number;
}

export class UserContext implements IUser {
  UIID: string;
  provider: string;
  displayName: string;
  email: string;
  isNew: boolean;
  hut: number[];
  huntSession: number[];
  observations: number[];
  personnalHutID: number;

  constructor(
    UIID?: string,
    provider?: string,
    displayName?: string,
    email?: string,
    isNew?: boolean,
    hut?: number[],
    huntSession?: number[],
    observations?: number[],
    personnalHutID?: number
  ) {
    this.UIID = UIID || "";
    this.provider = provider || "";
    this.displayName = displayName || "";
    this.email = email || "";
    this.isNew = isNew == undefined ? true : isNew;
    this.hut = hut || [];
    this.huntSession = huntSession || [];
    this.observations = observations || [];
    this.personnalHutID = personnalHutID || 0;
  }

  static fromUserFirebase = (userFirebase: any) => {
    return new UserContext(
      userFirebase.UIID,
      "Firebase",
      userFirebase.displayName,
      userFirebase.email,
      false,
      userFirebase.hut,

      userFirebase.huntSession,
      userFirebase.observations,
      userFirebase.personnalHutID
    );
  };

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
