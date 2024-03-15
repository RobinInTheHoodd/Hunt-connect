import { PoolClient } from "pg";
import pool from "../db/pgPool";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";
import DuckTeamsModel, { IDuckTeamsModel } from "../models/DuckTeamsModel";

class DuckTeamsDataAccess {
  constructor() {}

  public async create(
    duckTeam: IDuckTeamsModel,
    client: PoolClient,
    huntID: number
  ): Promise<any> {
    const sql =
      "INSERT INTO udb.Hunting_Session_Duck_Teams " +
      "(" +
      "hunting_session_id,      duck_position," +
      "specimen,                sex,         duck_type" +
      ") " +
      "VALUES" +
      "(" +
      "$1, POINT($2,$3), $4, $5, $6" +
      ");";
    const values = [
      huntID,
      duckTeam.longitude,
      duckTeam.latitude,
      duckTeam.specimen,
      duckTeam.sex,
      duckTeam.type,
    ];
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

  public async getByHuntSessionID(id: number) {
    try {
      const sql =
        "SELECT * FROM udb.hunting_session_duck_teams WHERE hunting_session_id = $1 ;";
      const value = [id];
      const res = await pool.query(sql, value);
      let duckTeam: IDuckTeamsModel[] = [];

      for (const duck of res.rows)
        duckTeam.push(DuckTeamsModel.fromQuery(duck));

      return duckTeam;
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
const duckTeamsDataAccess = new DuckTeamsDataAccess();
export default duckTeamsDataAccess as DuckTeamsDataAccess;
