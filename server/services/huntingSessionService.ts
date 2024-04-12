import { PoolClient } from "pg";
import { IHuntingSessionModel } from "../models/huntingSession/HuntingSessionModel";
import pool from "../db/pgPool";
import huntingSessionDataAccess from "../repository/huntingSessionDataAccess";
import weatherDataAccess from "../repository/weatherSessionDataAccess";
import duckTeamsDataAccess from "../repository/DuckTeamsDataAccess";
import { IHuntingParticipanModel } from "../models/huntingParticipant/HuntingPariticpantModel";
import { IWeatherInfoModel } from "../models/weather/WeatherModel";
import { IDuckTeamsModel } from "../models/duckTeams/DuckTeamsModel";
import { FirebaseAdminSingleton } from "../config/firebaseConfig";
import hutDataAccess from "../repository/hutDataAccess";

class HuntingSessionService {
  private _firebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
  constructor() {}

  public async create(huntSession: IHuntingSessionModel) {
    const client: PoolClient = await pool.connect();
    const firebaseRefs = [];

    try {
      await client.query("BEGIN");
      const huntSessionID = await huntingSessionDataAccess.create(
        huntSession,
        client
      );

      for (const participant of huntSession.participants!)
        await huntingSessionDataAccess.addParticipant(
          huntSessionID,
          participant,
          client
        );

      await weatherDataAccess.create(
        huntSessionID,
        huntSession.weather!,
        client
      );

      for (const duckPosition of huntSession.duckTeams!)
        await duckTeamsDataAccess.create(duckPosition, client, huntSessionID);

      const observationRef = this._firebaseDB.ref(
        "/huntSessions/" + huntSessionID
      );

      firebaseRefs.push(observationRef);
      await observationRef.set({
        ...huntSession,
        id: huntSessionID,
        observations: [],
      });

      await client.query("COMMIT");
      return huntSessionID;
    } catch (e: any) {
      console.log(e);
      await client.query("ROLLBACK");
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
      client.release();
    }
  }

  public async finishSession(huntSessionID: number) {
    let firebaseRefs = [];
    try {
      await huntingSessionDataAccess.finishSession(huntSessionID);

      const huntObservationRef = this._firebaseDB.ref(
        "/huntSessions/" + huntSessionID
      );

      firebaseRefs.push(huntObservationRef);
      await huntObservationRef.update({ isFinish: true });

      return;
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

  public async getHuntLocation(huntingId: number) {
    try {
      const postalCode = await hutDataAccess.getHutLocationByHuntingId(
        huntingId
      );

      return postalCode.postal_code;
    } catch (e: any) {
      throw e;
    }
  }

  public async getCurrentByUserId(userID: string) {
    try {
      const huntSession: IHuntingSessionModel | void =
        await huntingSessionDataAccess.getActiveHuntByUserId(userID);
      if (huntSession == undefined) return;
      const participants: IHuntingParticipanModel[] =
        await huntingSessionDataAccess.getParticipantByHuntingSessionID(
          huntSession!.id!
        );
      const weather: IWeatherInfoModel =
        await weatherDataAccess.getByHuntinSessionsID(huntSession!.id!);
      const duckTeams: IDuckTeamsModel[] =
        await duckTeamsDataAccess.getByHuntSessionID(huntSession!.id!);

      huntSession!.duckTeams = duckTeams;
      huntSession!.participants = participants;
      huntSession!.weather = weather;

      return huntSession;
    } catch (e: any) {
      throw e;
    }
  }

  public async getById(huntinID: number) {
    try {
      const huntSession: IHuntingSessionModel | void =
        await huntingSessionDataAccess.getById(huntinID);
      if (huntSession == undefined) return;
      const participants: IHuntingParticipanModel[] =
        await huntingSessionDataAccess.getParticipantByHuntingSessionID(
          huntSession!.id!
        );
      const weather: IWeatherInfoModel =
        await weatherDataAccess.getByHuntinSessionsID(huntSession!.id!);
      const duckTeams: IDuckTeamsModel[] =
        await duckTeamsDataAccess.getByHuntSessionID(huntSession!.id!);

      huntSession!.duckTeams = duckTeams;
      huntSession!.participants = participants;
      huntSession!.weather = weather;

      return huntSession;
    } catch (e: any) {
      throw e;
    }
  }

  public async getHistoryDateHuntingSession(userId: string): Promise<
    {
      huntingId: number;
      fromDate: String;
    }[]
  > {
    try {
      let historySession: {
        huntingId: number;
        fromDate: String;
      }[];

      historySession =
        await huntingSessionDataAccess.getHistoryDateHuntingSessionID(userId);

      return historySession;
    } catch (e) {
      throw e;
    }
  }
}

const huntingSessionService = new HuntingSessionService();
export default huntingSessionService as HuntingSessionService;
