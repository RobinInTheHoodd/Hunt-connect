import { DatabaseError, PoolClient } from "pg";
import { IHuntingSessionModel } from "../models/HuntingSessionModel";
import pool from "../db/pgPool";
import huntingSessionDataAccess from "../repository/huntingSessionDataAccess";
import weatherDataAccess from "../repository/weatherSessionDataAccess";
import duckTeamsDataAccess from "../repository/DuckTeamsDataAccess";
import { IHuntingParticipanModel } from "../models/HuntingPariticpantModel";
import { IWeatherInfoModel } from "../models/WeatherModel";
import { IDuckTeamsModel } from "../models/DuckTeamsModel";
import ObservationModel, {
  IObservationModel,
} from "../models/ObservationModel";
import observationDataAccess from "../repository/observationDataAccess";
import ObservationDuckPositionModel from "../models/ObservationDuckPositionModel";
import { PollingWatchKind } from "typescript";

class ObservationService {
  constructor() {}

  public async create(observation: IObservationModel) {
    const poolClient: PoolClient = await pool.connect();

    try {
      await poolClient.query("BEGIN");
      const observationID = await observationDataAccess.create(
        observation,
        poolClient
      );
      for (const duckPosition of observation.specimenPosition)
        await observationDataAccess.createPosition(
          observationID,
          duckPosition,
          poolClient
        );
      await poolClient.query("COMMIT");
    } catch (e: any) {
      let err: DatabaseError = e;
      await poolClient.query("ROLLBACK");
      throw e;
    } finally {
      poolClient.release();
    }
  }

  public async update(observation: IObservationModel) {
    const poolClient: PoolClient = await pool.connect();

    try {
      await poolClient.query("BEGIN");

      await observationDataAccess.update(
        observation.id!,
        observation,
        poolClient
      );

      for (const duckPosition of observation.specimenPosition)
        await observationDataAccess.updatePosition(duckPosition, poolClient);

      await poolClient.query("COMMIT");
    } catch (e: any) {
      await poolClient.query("ROLLBACK");
      throw e;
    } finally {
      poolClient.release();
    }
  }

  public async deleteObservation(observationId: number) {
    const poolClient: PoolClient = await pool.connect();

    try {
      await poolClient.query("BEGIN");

      await observationDataAccess.deletePosition(observationId, poolClient);

      await observationDataAccess.deleteObservations(observationId, poolClient);

      await poolClient.query("COMMIT");
    } catch (e: any) {
      console.log(e);
      await poolClient.query("ROLLBACK");
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
}

const observationService = new ObservationService();
export default observationService as ObservationService;
