import { Reference } from "firebase-admin/database";
import { FirebaseError } from "../../models/error/FirebaseError";

export interface IObservationFirebaseRepository {
  create(observation: any, ref: Reference): Promise<void>;
  delete(observationId: number, ref: Reference): Promise<void>;
}

class ObservationFirebaseRepository implements IObservationFirebaseRepository {
  constructor() {}

  public async create(observation: any, ref: Reference): Promise<void> {
    try {
      ref.transaction(
        (currentData) => {
          if (currentData === null) {
            return observation;
          } else {
            return { ...currentData, ...observation };
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

  public async delete(observationId: number, ref: Reference): Promise<void> {
    try {
      const observationSnapshot = await ref.once("value");
      if (!observationSnapshot.exists()) {
        throw new FirebaseError(
          "observation-not-found",
          "The observation is not found."
        );
      }
      await ref.remove();
    } catch (error) {
      throw error;
    }
  }
}

const observationFirebaseRepository = new ObservationFirebaseRepository();
export default observationFirebaseRepository as ObservationFirebaseRepository;
