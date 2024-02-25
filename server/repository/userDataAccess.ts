import pool from "../db/pgPool";
import RegisterRequest from "../models/auth/registerRequest";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";

class UserDataAccess {
  constructor() {}

  public async createUser(user: RegisterRequest): Promise<any> {
    const sql =
      "INSERT INTO udb.USERS " +
      "(" +
      "user_id,           display_name,   email," +
      "email_verified,    phone,          user_role," +
      "hut_name,          hut_number" +
      ") " +
      "VALUES" +
      "(" +
      "$1, $2, $3, $4, $5, $6, $7, $8" +
      ");";

    const values = [
      user.UUID,
      user.display_name,
      user.email,
      0,
      user.phone,
      user.role,
      user.hut_name,
      user.hut_number,
    ];
    try {
      const res = await pool.query(sql, values);
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

const userDataAccess = new UserDataAccess();
export default userDataAccess as UserDataAccess;
