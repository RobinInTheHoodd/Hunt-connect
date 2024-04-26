import { generateUniqueNumberID } from "../utils/helper";
import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import { IRegisterRequest } from "../models/auth/RegisterRequest";
import hutFirebaseRepository from "../repository/firebase/hutFirebaseRepository";
import userFirebaseRepository from "../repository/firebase/userFirebaseRepository";

import { FirebaseError } from "../middleware/errorFirebaseMiddleware";
import hutService from "./hutService";

export interface IAuthService {
  register(register: IRegisterRequest): Promise<string>;
}

class AuthService implements IAuthService {
  private _firebaseAuth = FirebaseAdminSingleton.getFirebaseAuth();
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();

  constructor() {}

  public async register(register: IRegisterRequest): Promise<string> {
    const firebaseRefs = [];

    try {
      let user = await this._firebaseRegister(register);

      const userRef = this._firebaseDB.ref("/user/" + user.register.UUID);

      await hutService.create(user.register, userRef);

      await hutService.createPersonnal(user.register, userRef);

      return user!.customeToken!;
    } catch (e: any) {
      throw e;
    }
  }

  private async _firebaseRegister(
    register: IRegisterRequest
  ): Promise<{ register: IRegisterRequest; customeToken: string }> {
    let registerReq: IRegisterRequest = register;
    let customeToken: string = "";

    try {
      await this._firebaseAuth
        .getUserByEmail(register.email)
        .catch(async () => {
          try {
            const userRecord = await this._firebaseAuth.createUser({
              displayName: register.display_name,
              email: register.email,
              emailVerified: false,
              password: register.password,
              phoneNumber: "+1" + register.phone,
              disabled: false,
            });
            registerReq.UUID = userRecord.uid;
          } catch (error) {
            throw error;
          }
        })
        .finally(async () => {
          customeToken = await this._firebaseAuth.createCustomToken(
            registerReq.UUID!
          );
        });

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
