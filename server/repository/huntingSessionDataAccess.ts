import HuntingSessionModel, {
  IHuntingSessionModel,
} from "../models/HuntingSessionModel";
import pool from "../db/pgPool";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../models/HuntingPariticpantModel";
import { PoolClient } from "pg";

class HuntingSessionDataAccess {
  constructor() {}
  public async create(
    huntSession: IHuntingSessionModel,
    client: PoolClient
  ): Promise<any> {
    const sql =
      "INSERT INTO udb.Hunting_Session " +
      "(" +
      "hut_id,      creator_id," +
      "from_date,   to_date" +
      ") " +
      "VALUES" +
      "(" +
      "$1, $2, $3, $4" +
      ") RETURNING id;";
    const values = [
      huntSession.hutID,
      huntSession.creatorID,
      huntSession.fromDate,
      huntSession.toDate,
    ];
    try {
      const res = await client.query(sql, values);
      return res.rows[0].id;
    } catch (err: any) {
      console.log(err);
      const errorDatabase: DatabaseError = {
        name: "DatabaseError",
        message: "Une erreur de base de données s'est produite",
        errorType: "postgres",
        code: err.code,
        detail: err.detail,
      };
      throw errorDatabase;
    }
  }

  public async addParticipant(
    huntSessionid: number,
    participant: IHuntingParticipanModel,
    client: PoolClient
  ): Promise<any> {
    const sql =
      "INSERT INTO udb.Hunting_Session_Participant " +
      "(" +
      "participant_id,      display_name, hunting_session_id" +
      ") " +
      "VALUES" +
      "(" +
      "$1, $2, $3" +
      ");";
    const participantId =
      participant.userID != undefined ? participant.userID : null;
    const values = [participantId, participant.displayName, huntSessionid];
    try {
      const res = await client.query(sql, values);
      return;
    } catch (err: any) {
      const errorDatabase: DatabaseError = {
        name: "DatabaseError",
        message: "Une erreur de base de données s'est produite",
        errorType: "postgres",
        code: err.code,
        detail: err.detail,
      };
      throw errorDatabase;
    }
  }

  public async getCurrentByUserId(
    userID: string
  ): Promise<IHuntingSessionModel> {
    try {
      const query =
        "SELECT hs.* FROM udb.hunting_session as hs " +
        "INNER JOIN udb.hunting_session_participant as hsp " +
        "ON hsp.hunting_session_id = hs.id " +
        "WHERE (hs.creator_id = $1 OR hsp.participant_id = $1) " +
        "AND CURRENT_DATE BETWEEN hs.from_date AND hs.to_date;";
      const value = [userID];
      const res = await pool.query(query, value);

      if (res.rowCount == 0) throw "Aucune donné";

      return HuntingSessionModel.fromQuery(res.rows[0]);
    } catch (e: any) {
      const errorDatabase: DatabaseError = {
        name: "DatabaseError",
        message: "Une erreur de base de données s'est produite",
        errorType: "postgres",
        code: e.code,
        detail: e.detail,
      };
      throw errorDatabase;
    }
  }

  public async getParticipantByHuntingSessionID(
    id: number
  ): Promise<IHuntingParticipanModel[]> {
    try {
      const query =
        "SELECT * FROM udb.hunting_session_participant WHERE hunting_session_id = $1;";
      const values = [id];
      const res = await pool.query(query, values);
      let participants: IHuntingParticipanModel[] = [];

      for (const participant of res.rows)
        participants.push(HuntingParticipantModel.fromQuery(participant));

      return participants;
    } catch (e: any) {
      const errorDatabase: DatabaseError = {
        name: "DatabaseError",
        message: "Une erreur de base de données s'est produite",
        errorType: "postgres",
        code: e.code,
        detail: e.detail,
      };
      throw errorDatabase;
    }
  }
}
const huntingSessionDataAccess = new HuntingSessionDataAccess();
export default huntingSessionDataAccess as HuntingSessionDataAccess;
