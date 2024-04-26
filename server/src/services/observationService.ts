import { DatabaseError, PoolClient } from "pg";

import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import huntingSessionService from "./huntingSessionService";
import { Reference } from "firebase-admin/database";
import ObservationModel, {
  IObservationModel,
} from "../models/observation/ObservationModel";
import huntFirebaseRepository from "../repository/firebase/huntFirebaseRepository";
import observationFirebaseRepository from "../repository/firebase/observationFirebaseRepository";
import userFirebaseRepository from "../repository/firebase/userFirebaseRepository";
import { generateUniqueNumberID } from "../utils/helper";
import { FirebaseError } from "firebase/app";

export interface IObservationService {
  create(observation: IObservationModel): Promise<void>;
  update(observation: IObservationModel, huntId: number): Promise<void>;
  deleteObservation(observationId: number, huntId: number): Promise<void>;
  getCoordinatesForPostalCode(postalCode: any): Promise<any>;
}

class ObservationService implements IObservationService {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
  constructor() {}

  public async create(observation: IObservationModel) {
    const duckPositionsToWrite = [];
    const observationID = generateUniqueNumberID();
    const firebaseRefs = [];

    try {
      const huntRef = this._firebaseDB.ref(
        "/huntSessions/" + observation.huntingSession
      );
      const localtion = await huntingSessionService.getHuntLocation(huntRef);

      const positions = await this.getCoordinatesForPostalCode(localtion);

      for (const duckPosition of observation.specimenPosition) {
        duckPosition.id = generateUniqueNumberID();
        duckPositionsToWrite.push(duckPosition);
      }

      for (const duckPosition of duckPositionsToWrite) {
        const duckPositionRef = this._firebaseDB.ref(
          "/migTrackerPosition/" + duckPosition.id
        );

        firebaseRefs.push(duckPositionRef);

        await duckPositionRef.set({
          ...duckPosition,
          ...positions,
          quantityView: observation.quantityView,
          quantityKill: observation.quantityKill,
          viewDate: observation.viewDate,
          specimen: observation.specimen,
          observation_id: observationID,
        });
      }

      const usersRef: Reference[] =
        await huntFirebaseRepository.fetchParticipantRefs(huntRef);
      const observationRef = this._firebaseDB.ref(
        "/observations/" + observationID
      );
      firebaseRefs.concat(usersRef);
      firebaseRefs.push(huntRef);
      firebaseRefs.push(observationRef);

      for (const userRef of usersRef) {
        await userFirebaseRepository.addObservationID(observationID, userRef);
      }

      await huntFirebaseRepository.addObservationID(observationID, huntRef);

      await observationFirebaseRepository.create(
        {
          ...positions,
          ...observation,
          id: observationID,
          viewDate: new Date(observation.viewDate).getTime(),
        },
        observationRef
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

  public async update(observation: IObservationModel, huntId: number) {
    const firebaseRefs = [];

    try {
      const observationRef = this._firebaseDB.ref(
        "/observations/" + observation.id
      );

      firebaseRefs.push(observationRef);
      await observationRef.update(observation);
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

  public async deleteObservation(observationId: number, huntId: number) {
    const firebaseDataSnapshot: { [key: string]: any } = {};
    let userRefs: Reference[] = [];
    try {
      const huntSessionRef = this._firebaseDB.ref("/huntSessions/" + huntId);
      const observationRef = this._firebaseDB.ref(
        "/observations/" + observationId
      );

      userRefs = await huntFirebaseRepository.fetchParticipantRefs(
        huntSessionRef
      );

      await huntFirebaseRepository.deleteObservationID(
        observationId,
        huntSessionRef
      );
      await observationFirebaseRepository.delete(observationId, observationRef);

      for (const userRef of userRefs) {
        await userFirebaseRepository.deleteObservationID(
          observationId,
          userRef
        );
      }
    } catch (e: any) {
      for (const [path, data] of Object.entries(firebaseDataSnapshot)) {
        const ref = this._firebaseDB.ref(path);
        await ref.set(data).catch((firebaseError) => {
          console.error(
            "Failed to restore Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    }
  }

  public async getCoordinatesForPostalCode(postalCode: any) {
    const apiKey = "AIzaSyDamYRarsYON1ClmgzMYVrwOhTFwqHw4CY";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`
    );
    const data: any = await response.json();

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new FirebaseError(
        "coordinate-not-found",
        "Unable to find coordinates for the given postal code"
      );
    }
  }
}

const observationService = new ObservationService();
export default observationService as ObservationService;
