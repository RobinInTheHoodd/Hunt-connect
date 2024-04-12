import pool from "../db/pgPool";
import HuntingParticipantModel from "../models/huntingParticipant/HuntingPariticpantModel";
import { IRegisterRequest } from "../models/auth/RegisterRequest";

class HutDataAccess {
  constructor() {}

  public async create(
    hut: IRegisterRequest
  ): Promise<HuntingParticipantModel[]> {
    const sql =
      "INSERT INTO udb.hut" +
      "(" +
      "owner_id, display_name, display_number, postal_code" +
      ")" +
      "VALUES" +
      "($1, $2, $3, $4)";

    const values = [hut.UUID, hut.hut_name, hut.hut_number, hut.postalLocation];
    const res = await pool.query(sql, values);

    if (res.rowCount != 0) return res.rows;
    else return [];
    try {
    } catch (e) {
      throw e;
    }
  }

  public async getParticipantsByHutID(
    hutID: number
  ): Promise<HuntingParticipantModel[]> {
    const sql =
      "SELECT u.user_id, u.display_name " +
      "FROM udb.hut_participant as hp " +
      "INNER JOIN udb.users as u " +
      "ON hp.user_id = u.user_id " +
      "WHERE hp.hut_id = $1 ;";

    const values = [hutID];
    const res = await pool.query(sql, values);

    if (res.rowCount != 0) return res.rows;
    else return [];
    try {
    } catch (e) {
      throw e;
    }
  }

  public async getHutLocationByHuntingId(huntingId: number): Promise<any> {
    const sql =
      "SELECT h.postal_code " +
      "FROM udb.hunting_session  as hs " +
      "INNER JOIN udb.hut as h " +
      "ON hs.hut_id = h.id " +
      "WHERE hs.id = $1 ;";

    const values = [huntingId];
    const res = await pool.query(sql, values);

    if (res.rowCount != 0) return res.rows[0];
    else return [];
    try {
    } catch (e) {
      throw e;
    }
  }
}
const hutDataAccess = new HutDataAccess();
export default hutDataAccess as HutDataAccess;
