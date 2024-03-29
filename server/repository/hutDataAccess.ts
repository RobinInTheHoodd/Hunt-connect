import pool from "../db/pgPool";
import HuntingParticipantModel from "../models/HuntingPariticpantModel";

class HutDataAccess {
  constructor() {}

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
}
const hutDataAccess = new HutDataAccess();
export default hutDataAccess as HutDataAccess;
