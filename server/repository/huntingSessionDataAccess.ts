import HuntingSessionModel, {
  IHuntingSessionModel,
} from "../models/huntingSession/HuntingSessionModel";
import pool from "../db/pgPool";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../models/huntingParticipant/HuntingPariticpantModel";

import { Database } from "firebase/database";
import { PoolClient } from "pg";

class HuntingSessionDataAccess {
  constructor() {}
  public async create(
    huntSession: IHuntingSessionModel,
    client: PoolClient
  ): Promise<any> {
    const sql = `INSERT INTO udb.Hunting_Session (hut_id, creator_id, from_date, to_date, is_finish) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const values = [
      huntSession.hutID,
      huntSession.creatorID,
      huntSession.fromDate,
      null,
      huntSession.isFinish,
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

  public async getActiveHuntByUserId(
    userID: string
  ): Promise<IHuntingSessionModel | void> {
    try {
      const query =
        "SELECT hs.* FROM udb.hunting_session as hs " +
        "INNER JOIN udb.hunting_session_participant as hsp " +
        "ON hsp.hunting_session_id = hs.id " +
        "WHERE (hs.creator_id = $1 OR hsp.participant_id = $1) " +
        "AND hs.is_finish = false ;";
      const value = [userID];

      const res = await pool.query(query, value);

      if (res.rowCount == 0) return;
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

  public async getById(
    huntingID: number
  ): Promise<IHuntingSessionModel | void> {
    try {
      const query =
        "SELECT hs.* " +
        "FROM udb.hunting_session as hs " +
        "WHERE hs.id = $1 ;";
      const value = [huntingID];

      const res = await pool.query(query, value);

      if (res.rowCount == 0) return;
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

  public async addParticipant(
    huntSessionid: number,
    participant: IHuntingParticipanModel,
    client: PoolClient
  ): Promise<any> {
    const sql =
      "INSERT INTO udb.Hunting_Session_Participant " +
      "(" +
      "participant_id,      display_name, hunting_session_id " +
      ")" +
      "VALUES " +
      "(" +
      "$1, $2, $3" +
      ");";
    const participantId =
      participant.role != "Invité" ? participant.userID : null;
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

  public async getHistoryDateHuntingSessionID(
    userId: string
  ): Promise<{ huntingId: number; fromDate: String }[]> {
    try {
      const query =
        "SELECT DISTINCT hs.id, hs.from_date " +
        "FROM udb.hunting_session as hs " +
        "INNER JOIN udb.hunting_session_participant as hsp " +
        "ON hs.id = hsp.hunting_session_id " +
        "WHERE hs.is_finish = true " +
        "AND " +
        "( " +
        "hsp.participant_id = $1 " +
        "OR " +
        "hs.creator_id = $1 " +
        ") " +
        "ORDER BY hs.from_date ASC;";

      const values = [userId];
      const res = await pool.query(query, values);
      let huntings: { huntingId: number; fromDate: String }[] = [];

      for (const hunting of res.rows)
        huntings.push({ huntingId: hunting.id, fromDate: hunting.from_date });

      return huntings;
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

  public async finishSession(huntSessionID: number) {
    const sql =
      "UPDATE udb.Hunting_Session " +
      "SET is_finish = true, " +
      "to_date = CURRENT_DATE " +
      "WHERE id = $1;";
    const values = [huntSessionID];
    try {
      const rs = await pool.query(sql, values);
      if (rs.rowCount == 0)
        throw new Error("No record with the provided ID was found to update.");
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
}
const huntingSessionDataAccess = new HuntingSessionDataAccess();
export default huntingSessionDataAccess as HuntingSessionDataAccess;
