import firebase from "../config/firebaseConfig";
import RegisterRequest from "../models/auth/registerRequest";

import { FirebaseError } from "../middleware/errorFirebaseMiddleware";
import UserDataAccess from "../repository/userDataAccess";

export default class AuthService {
  private _userDatabase: UserDataAccess = new UserDataAccess();

  constructor() {}

  public register = async (register: RegisterRequest): Promise<string> => {
    try {
      const user = await this._firebaseRegister(register);

      await this._userDatabase.createUser(register);

      return user!.customeToken;
    } catch (e) {
      throw e;
    }
  };

  private _firebaseRegister = async (register: RegisterRequest) => {
    try {
      const userRecord = await firebase.firebaseAuth.createUser({
        displayName: register.display_name,
        email: register.email,
        emailVerified: false,
        password: register.password,
        phoneNumber: register.phone,
        disabled: false,
      });

      register.UUID = userRecord.uid;

      const customeToken = await firebase.firebaseAuth.createCustomToken(
        userRecord.uid
      );

      return { register, customeToken };
    } catch (err: any) {
      const firebaseError: FirebaseError = {
        name: "FirebaseError",
        message: "Une erreur de firebase s'est produite",
        errorType: "firebase",
        code: err.code,
        detail: err.message,
      };

      throw firebaseError;
    }
  };
}
