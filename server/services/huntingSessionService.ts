import { PoolClient } from "pg";
import { IHuntingSessionModel } from "../models/HuntingSessionModel";
import pool from "../db/pgPool";
import huntingSessionDataAccess from "../repository/huntingSessionDataAccess";
import weatherDataAccess from "../repository/weatherSessionDataAccess";
import duckTeamsDataAccess from "../repository/DuckTeamsDataAccess";
import { IHuntingParticipanModel } from "../models/HuntingPariticpantModel";
import { IWeatherInfoModel } from "../models/WeatherModel";
import { IDuckTeamsModel } from "../models/DuckTeamsModel";

class HuntingSessionService {
  constructor() {}

  public async create(huntSession: IHuntingSessionModel) {
    const client: PoolClient = await pool.connect();

    try {
      await client.query("BEGIN");

      const huntSessionID = await huntingSessionDataAccess.create(
        huntSession,
        client
      );

      console.log("HUT CREATE");
      for (const participant of huntSession.participants!)
        await huntingSessionDataAccess.addParticipant(
          huntSessionID,
          participant,
          client
        );

      await weatherDataAccess.createWeather(
        huntSessionID,
        huntSession.weather!,
        client
      );

      for (const duckPosition of huntSession.duckTeams!)
        await duckTeamsDataAccess.create(duckPosition, client, huntSessionID);

      await client.query("COMMIT");
    } catch (e: any) {
      await client.query("ROLLBACK");
      client.release();
      throw e;
    } finally {
      client.release();
    }
  }

  public async getCurrentByUserId(userID: string) {
    try {
      const huntSession: IHuntingSessionModel =
        await huntingSessionDataAccess.getCurrentByUserId(userID);

      const participants: IHuntingParticipanModel[] =
        await huntingSessionDataAccess.getParticipantByHuntingSessionID(
          huntSession.id!
        );
      const weather: IWeatherInfoModel =
        await weatherDataAccess.getByHuntinSessionsID(huntSession.id!);
      const duckTeams: IDuckTeamsModel[] =
        await duckTeamsDataAccess.getByHuntSessionID(huntSession.id!);

      huntSession.duckTeams = duckTeams;
      huntSession.participants = participants;
      huntSession.weather = weather;

      return huntSession;
    } catch (e: any) {
      throw e;
    }
  }
}

const huntingSessionService = new HuntingSessionService();
export default huntingSessionService as HuntingSessionService;
