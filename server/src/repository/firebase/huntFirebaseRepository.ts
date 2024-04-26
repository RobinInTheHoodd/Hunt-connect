import { Reference } from "firebase-admin/database";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import HuntingSessionModel from "../../models/huntingSession/HuntingSessionModel";
import { FirebaseError } from "../../models/error/FirebaseError";

export interface IHuntFirebaseRepository {
  create(hunt: HuntingSessionModel, ref: Reference): Promise<void>;
  addObservationID(observationId: number, ref: Reference): Promise<void>;
  deleteObservationID(observationId: number, ref: Reference): Promise<void>;
  fetchParticipantRefs(sessionRef: Reference): Promise<Reference[]>;
}

class HuntFirebaseRepository implements IHuntFirebaseRepository {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
  constructor() {}

  public async create(
    hunt: HuntingSessionModel,
    ref: Reference
  ): Promise<void> {
    try {
      await ref.set(hunt);
    } catch (e: any) {
      throw e;
    }
  }

  public async addObservationID(
    observationId: number,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData) => {
          if (currentData === null) {
            return { observation: [observationId] };
          } else {
            const updatedhuntSession = currentData.observation || [];

            if (!updatedhuntSession.includes(observationId)) {
              updatedhuntSession.push(observationId);
            }

            return { ...currentData, observation: updatedhuntSession };
          }
        },
        (error, committed, snapshot) => {
          if (error) {
            throw error;
          } else if (!committed) {
            throw new FirebaseError(
              "unavailable",
              "Transaction not committed."
            );
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  public async deleteObservationID(
    observationId: number,
    ref: Reference
  ): Promise<void> {
    try {
      const huntSessionSnapshot = await ref.once("value");

      if (huntSessionSnapshot.exists()) {
        const huntSession = huntSessionSnapshot.val();
        if (huntSession.observation) {
          const updatedObservations = huntSession.observation.filter(
            (observation: any) => observation.id === observationId
          );
          await ref.update({ observation: updatedObservations });
        }
      }
    } catch (e) {
      throw e;
    }
  }

  public async fetchParticipantRefs(
    sessionRef: Reference
  ): Promise<Reference[]> {
    try {
      const sessionSnapshot = await sessionRef.once("value");

      const sessionData = sessionSnapshot.val();
      if (sessionData && sessionData.participants) {
        const userRefs = sessionData.participants
          .filter((participant: any) => participant.hunterID !== "")
          .map((participant: any) =>
            this._firebaseDB.ref(`/user/${participant.hunterID}`)
          );

        userRefs.push(this._firebaseDB.ref(`/user/${sessionData.creatorID}`));
        return userRefs;
      }

      return [];
    } catch (e) {
      throw e;
    }
  }
}

const huntFirebaseRepository = new HuntFirebaseRepository();
export default huntFirebaseRepository as HuntFirebaseRepository;
