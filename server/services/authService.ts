import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import RegisterRequest from "../models/auth/registerRequest";

import { FirebaseError } from "../middleware/errorFirebaseMiddleware";
import userDataAccess from "../repository/userDataAccess";

class AuthService {
  private _firebaseAuth = FirebaseAdminSingleton.getFirebaseAuth();

  constructor() {}

  public async register(register: RegisterRequest): Promise<string> {
    try {
      const user = await this._firebaseRegister(register);

      await userDataAccess.createUser(register);

      return user!.customeToken;
    } catch (e: any) {
      throw e;
    }
  }

  private async _firebaseRegister(register: RegisterRequest) {
    try {
      const userRecord = await this._firebaseAuth.createUser({
        displayName: register.display_name,
        email: register.email,
        emailVerified: false,
        password: register.password,
        phoneNumber: register.phone,
        disabled: false,
      });

      register.UUID = userRecord.uid;

      const customeToken = await this._firebaseAuth.createCustomToken(
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
  }
}

const authService = new AuthService();
export default authService as AuthService;
