import { DatabaseError, PoolClient } from "pg";
import { IHuntingSessionModel } from "../models/huntingSession/HuntingSessionModel";
import pool from "../db/pgPool";
import huntingSessionDataAccess from "../repository/huntingSessionDataAccess";
import weatherDataAccess from "../repository/weatherSessionDataAccess";
import duckTeamsDataAccess from "../repository/DuckTeamsDataAccess";
import { IHuntingParticipanModel } from "../models/huntingParticipant/HuntingPariticpantModel";
import { IWeatherInfoModel } from "../models/weather/WeatherModel";
import { IDuckTeamsModel } from "../models/duckTeams/DuckTeamsModel";
import ObservationModel, {
  IObservationModel,
} from "../models/observation/ObservationModel";
import observationDataAccess from "../repository/observationDataAccess";
import ObservationDuckPositionModel from "../models/observationDuck/ObservationDuckPositionModel";
import { PollingWatchKind } from "typescript";
import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import { snapshotEqual } from "firebase/firestore/lite";
import hutDataAccess from "../repository/hutDataAccess";
import hutService from "./hutService";
import huntingSessionService from "./huntingSessionService";

class ObservationService {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
  constructor() {}

  public async create(observation: IObservationModel) {
    const poolClient: PoolClient = await pool.connect();
    const duckPositionsToWrite = [];
    let observationID;
    const firebaseRefs = [];

    try {
      await poolClient.query("BEGIN");

      console.log(observation.huntingSession);
      const localtion = await huntingSessionService.getHuntLocation(
        observation.huntingSession
      );

      const positions = await this.getCoordinatesForPostalCode(localtion);

      observationID = await observationDataAccess.create(
        observation,
        poolClient
      );

      for (const duckPosition of observation.specimenPosition) {
        const id = await observationDataAccess.createPosition(
          observationID,
          duckPosition,
          poolClient
        );
        duckPosition.id = id;

        duckPositionsToWrite.push(duckPosition);
      }

      for (const duckPosition of duckPositionsToWrite) {
        const duckPositionRef = this._firebaseDB.ref(
          "/observationsPosition/" + duckPosition.id
        );
        firebaseRefs.push(duckPositionRef);
        await duckPositionRef.set({
          ...duckPosition,
          observation_id: observationID,
        });
      }

      const huntObservationRef = this._firebaseDB.ref(
        "/huntSessions/" + observation.huntingSession
      );
      const observationRef = this._firebaseDB.ref(
        "/observations/" + observationID
      );
      firebaseRefs.push(huntObservationRef);
      firebaseRefs.push(observationRef);

      const snapshot = await huntObservationRef.child("observations").get();
      if (snapshot.exists()) {
        const existingObservations = snapshot.val() || [];

        const updatedObservations = [
          ...existingObservations,
          {
            ...observation,
            id: observationID,
          },
        ];

        await huntObservationRef.update({ observations: updatedObservations });
      } else {
        // S'il n'y a pas d'observations existantes, créez simplement le tableau avec la nouvelle observation
        await huntObservationRef.update({
          observations: [
            {
              ...observation,
              id: observationID,
            },
          ],
        });
      }

      await observationRef.set({
        ...positions,
        ...observation,
        id: observationID,
        viewDate: new Date(observation.viewDate).getTime(),
      });

      await poolClient.query("COMMIT");
    } catch (e: any) {
      console.log(JSON.stringify(e, null, 2));
      let err: DatabaseError = e;
      await poolClient.query("ROLLBACK");
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    } finally {
      poolClient.release();
    }
  }

  public async update(observation: IObservationModel, huntId: number) {
    const poolClient: PoolClient = await pool.connect();
    const firebaseRefs = [];

    try {
      await poolClient.query("BEGIN");

      await observationDataAccess.update(
        observation.id!,
        observation,
        poolClient
      );

      for (const duckPosition of observation.specimenPosition)
        await observationDataAccess.updatePosition(duckPosition, poolClient);

      const observationRef = this._firebaseDB.ref(
        "/observations/" + observation.id
      );

      firebaseRefs.push(observationRef);
      await observationRef.update(observation);

      const huntSessionRef = this._firebaseDB.ref("/huntSessions/" + huntId);

      const huntSessionSnapshot = await huntSessionRef.once("value");

      if (huntSessionSnapshot.exists()) {
        const huntSession = huntSessionSnapshot.val();

        // Vérifier si la liste d'observations existe et contient l'observation à supprimer
        if (huntSession.observations) {
          // Supprimer l'observation de la liste
          const updatedObservations = huntSession.observations.map(
            (obser: any) => {
              if (obser.id === observation.id) {
                return {
                  ...observation,
                };
              }
              return obser;
            }
          );

          await huntSessionRef.update({ observations: updatedObservations });
        }
      }

      await poolClient.query("COMMIT");
    } catch (e: any) {
      await poolClient.query("ROLLBACK");
      for (const ref of firebaseRefs) {
        await ref.remove().catch((firebaseError) => {
          console.error(
            "Failed to rollback Firebase data at " + ref.toString(),
            firebaseError
          );
        });
      }
      throw e;
    } finally {
      poolClient.release();
    }
  }

  public async deleteObservation(observationId: number, huntId: number) {
    const poolClient: PoolClient = await pool.connect();
    const firebaseRefs = [];
    const firebaseDataSnapshot: { [key: string]: any } = {};

    try {
      await poolClient.query("BEGIN");

      await observationDataAccess.deletePosition(observationId, poolClient);

      await observationDataAccess.deleteObservations(observationId, poolClient);

      const huntSessionRef = this._firebaseDB.ref("/huntSessions/" + huntId);

      const huntSessionSnapshot = await huntSessionRef.once("value");

      if (huntSessionSnapshot.exists()) {
        const huntSession = huntSessionSnapshot.val();

        // Vérifier si la liste d'observations existe et contient l'observation à supprimer
        if (huntSession.observations) {
          // Supprimer l'observation de la liste
          const updatedObservations = huntSession.observations.filter(
            (observation: any) => observation.id !== observationId
          );

          // Mettre à jour la session de chasse avec la nouvelle liste d'observations
          await huntSessionRef.update({ observations: updatedObservations });
        }
      }

      const observationRef = this._firebaseDB.ref(
        "/observations/" + observationId
      );

      const observationSnapshot = await observationRef.once("value");

      firebaseDataSnapshot[`/observations/${observationId}`] =
        observationSnapshot.val();

      firebaseRefs.push({
        path: `/observations/${observationId}`,
        ref: observationRef,
      });

      for (const { ref } of firebaseRefs) {
        await ref.remove();
      }

      await poolClient.query("COMMIT");
    } catch (e: any) {
      console.log("ERREUR");
      console.log(JSON.stringify(e, null, 2));
      await poolClient.query("ROLLBACK");
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
    } finally {
      poolClient.release();
    }
  }

  public async getObservations(huntingId: number) {
    try {
      const observations: ObservationModel[] =
        await observationDataAccess.getObservations(huntingId);
      for (const observation of observations) {
        observation.specimenPosition = await observationDataAccess.getPosition(
          observation.id!
        );
      }

      return observations;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  }

  public async getCoordinatesForPostalCode(postalCode: any) {
    const apiKey = "AIzaSyDamYRarsYON1ClmgzMYVrwOhTFwqHw4CY";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${apiKey}`
    );
    const data = await response.json();

    console.log(JSON.stringify(data, null, 2));

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Unable to find coordinates for the given postal code");
    }
  }
}

const observationService = new ObservationService();
export default observationService as ObservationService;
