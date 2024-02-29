import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import IRegisterRequest from "../models/auth/RegisterRequest";

import { FirebaseError } from "../middleware/errorFirebaseMiddleware";
import userDataAccess from "../repository/userDataAccess";
import { UserRecord } from "firebase-admin/auth";
import RegisterRequest from "../models/auth/RegisterRequest";

class AuthService {
  private _firebaseAuth = FirebaseAdminSingleton.getFirebaseAuth();

  constructor() {}

  public async register(register: IRegisterRequest): Promise<string> {
    let user: {
      register: IRegisterRequest;
      customeToken: string;
    };
    try {
      await this._firebaseAuth
        .getUserByEmail(register.email)
        .then(async (userRecord: UserRecord) => {
          const registerReq: IRegisterRequest =
            RegisterRequest.fromUserContext(userRecord);
          await userDataAccess.createUser(registerReq);
          user.customeToken = "";
          user.register = registerReq;
        })
        .catch(async () => {
          user = await this._firebaseRegister(register); //{ customeToken: "dsds" };
          await userDataAccess.createUser(register);
        });
      return user!.customeToken!;
    } catch (e: any) {
      throw e;
    }
  }

  private async _firebaseRegister(register: IRegisterRequest) {
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
