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
      user = await this._firebaseRegister(register);
      await userDataAccess.createUser(user.register).catch((e: any) => {
        this._firebaseAuth.deleteUser(user.register.UUID!);
        throw e;
      });
      return user!.customeToken!;
    } catch (e: any) {
      throw e;
    }
  }

  private async _firebaseRegister(register: IRegisterRequest) {
    let registerReq: IRegisterRequest = register;
    let customeToken: string;
    try {
      this._firebaseAuth
        .getUserByEmail(register.email)
        .then(async (userRecord: UserRecord) => {
          registerReq = RegisterRequest.fromUserContext(userRecord);
        })
        .catch(async () => {
          const userRecord = await this._firebaseAuth.createUser({
            displayName: register.display_name,
            email: register.email,
            emailVerified: false,
            password: register.password,
            phoneNumber: register.phone,
            disabled: false,
          });
          registerReq.UUID = userRecord.uid;
        });
      customeToken = await this._firebaseAuth.createCustomToken(
        registerReq.UUID!
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
