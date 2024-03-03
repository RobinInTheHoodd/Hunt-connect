import pool from "../db/pgPool";
import IRegisterRequest from "../models/auth/RegisterRequest";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";

class UserDataAccess {
  constructor() {}

  public async createUser(user: IRegisterRequest): Promise<any> {
    const sql =
      "INSERT INTO udb.USERS " +
      "(" +
      "user_id,           display_name,   email," +
      "email_verified,    phone,          user_role," +
      "is_cgu_accepted,   hut_name,       hut_number" +
      ") " +
      "VALUES" +
      "(" +
      "$1, $2, $3, $4, $5, $6, $7, $8, $9" +
      ");";

    const values = [
      user.UUID,
      user.display_name,
      user.email,
      0,
      user.phone,
      user.role,
      true,
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
