import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import { Reference } from "firebase-admin/database";
import { generateUniqueNumberID } from "../utils/helper";
import { IHuntingSessionModel } from "../models/huntingSession/HuntingSessionModel";
import huntFirebaseRepository from "../repository/firebase/huntFirebaseRepository";
import hutFirebaseRepository from "../repository/firebase/hutFirebaseRepository";
import userFirebaseRepository from "../repository/firebase/userFirebaseRepository";
import { FirebaseError } from "../models/error/FirebaseError";

export interface IHuntingSessionService {
  create(huntSession: IHuntingSessionModel): Promise<any>;
  finishSession(huntSessionID: number): Promise<void>;
  getHuntLocation(huntRef: Reference): Promise<String>;
}

class HuntingSessionService implements IHuntingSessionService {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
  constructor() {}

  public async create(huntSession: IHuntingSessionModel): Promise<any> {
    const firebaseRefs: any = [];

    try {
      const huntSessionID = generateUniqueNumberID();

      huntSession.id = huntSessionID;

      const hutRef = this._firebaseDB.ref(`/hut/${huntSession.hutID}`);
      const huntRef = this._firebaseDB.ref(`/huntSessions/${huntSessionID}`);
      const usersRef = this._firebaseDB.ref("/user");

      firebaseRefs.push(hutRef, huntRef);
      for (const user of huntSession.participants!) {
        if (user.hunterID != "") {
          const userRef = usersRef.child(user.hunterID);
          userFirebaseRepository.addHuntSessionID(huntSessionID, userRef);
          firebaseRefs.push(userRef);
        }
      }

      const userRef = usersRef.child(huntSession.creatorID);

      userFirebaseRepository.addHuntSessionID(huntSessionID, userRef);
      await hutFirebaseRepository.addHuntSessionID(huntSessionID, hutRef);
      await huntFirebaseRepository.create(huntSession, huntRef);

      return huntSessionID;
    } catch (e: any) {
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError: any) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    }
  }

  public async finishSession(huntSessionID: number): Promise<void> {
    let firebaseRefs = [];
    try {
      const huntRef = this._firebaseDB.ref("/huntSessions/" + huntSessionID);

      firebaseRefs.push(huntRef);

      await huntRef.update({ isFinish: true });
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

  public async getHuntLocation(huntRef: Reference): Promise<string> {
    try {
      const snapshot = await huntRef.get();

      if (!snapshot.exists())
        throw new FirebaseError("location-not-found", "location not found");

      const hutID = snapshot.val().hutID;
      const hutRef = this._firebaseDB.ref("/hut/" + hutID);
      const postalCode = await hutFirebaseRepository.getHutLocationByHuntingId(
        hutID,
        hutRef
      );

      return postalCode;
    } catch (e: any) {
      throw e;
    }
  }
}

const huntingSessionService = new HuntingSessionService();
export default huntingSessionService as HuntingSessionService;
