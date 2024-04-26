import { Reference } from "firebase-admin/database";
import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import { IRegisterRequest } from "../models/auth/RegisterRequest";
import HutHunterModel from "../models/hutHunterModel";
import hutFirebaseRepository from "../repository/firebase/hutFirebaseRepository";
import userFirebaseRepository from "../repository/firebase/userFirebaseRepository";
import { generateUniqueNumberID } from "../utils/helper";

export interface IHutService {
  create(user: IRegisterRequest, userRef: Reference): void;
  createPersonnal(user: IRegisterRequest, userRef: Reference): void;
  updateHunterDay(hutID: number, hunter: HutHunterModel): void;
  deleteHutHunter(hutID: number, hunterID: string): void;
  addHunter(hutID: number, hunterEmail: string): void;
}

class HutService implements IHutService {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();

  public async create(user: IRegisterRequest, userRef: Reference) {
    try {
      if (user.hut_name != "") {
        let hutId: number = generateUniqueNumberID();
        const hutRef = this._firebaseDB.ref("/hut/" + hutId);

        await userFirebaseRepository.create(user, userRef);
        await userFirebaseRepository.addHutID(hutId, user.hut_name!, userRef);
        await hutFirebaseRepository.create(hutId, user, hutRef);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createPersonnal(user: IRegisterRequest, userRef: Reference) {
    const personnalHutID = generateUniqueNumberID();
    try {
      const hutPersonnalRef = this._firebaseDB.ref("/hut/" + personnalHutID);
      await hutFirebaseRepository.createPersonnal(
        personnalHutID,
        user,
        hutPersonnalRef
      );
      await userFirebaseRepository.addPersonnalHutID(personnalHutID, userRef);
    } catch (e) {
      throw e;
    }
  }

  public async updateHunterDay(hutID: number, hunter: HutHunterModel) {
    const firebaseRefs = [];

    try {
      const hutRef = this._firebaseDB.ref(`/hut/${hutID.toString()}`);
      firebaseRefs.push(hutRef);
      await hutFirebaseRepository.updateHunterDay(
        hunter.hunterID,
        hunter.authorizeDay,
        hutRef
      );
    } catch (e: any) {
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    }
  }

  public async deleteHutHunter(hutID: number, hunterID: string) {
    const firebaseRefs = [];
    try {
      const hutRef = this._firebaseDB.ref(`/hut/${hutID.toString()}`);
      firebaseRefs.push(hutRef);

      await hutFirebaseRepository.deleteHutHunter(hunterID, hutRef);
    } catch (e: any) {
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    }
  }

  public async addHunter(hutID: number, hunterEmail: string) {
    const firebaseRefs = [];
    const authorizeDay = HutHunterModel.generateAuthorizeDay();

    try {
      const userRef = this._firebaseDB.ref(`/user/`);
      const hutRef = this._firebaseDB.ref(`/hut/${hutID.toString()}`);

      firebaseRefs.push(userRef);
      firebaseRefs.push(hutRef);

      const hutName = await hutFirebaseRepository.getHutName(hutRef);
      const hunterID = await userFirebaseRepository.getIDByEmail(
        hunterEmail,

        userRef
      );

      if (hunterID === undefined) return;

      const newHunter = new HutHunterModel(
        hunterID,
        hutID,
        authorizeDay,
        "Chasseur"
      );

      await userFirebaseRepository.addHutID(
        hutID,
        hutName,
        userRef.child(hunterID)
      );
      await hutFirebaseRepository.addHunter(newHunter, hutRef);
    } catch (e: any) {
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    }
  }
}

const hutService = new HutService();
export default hutService as HutService;
