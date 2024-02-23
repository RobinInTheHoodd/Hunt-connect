// userDataAccess.js
import e from "express";
import pool from "../db/pgPool";
import RegisterRequest from "../models/auth/registerRequest";

const createUser = async (user: RegisterRequest) => {
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

  const value = [
    user.UUID,
    user.display_name,
    user.email,
    0,
    user.phone,
    user.role,
    user.hut_name,
    user.hut_number,
  ];
  pool.query(sql, value, (err, res) => {
    if (err) {
      throw err;
    } else {
      return res.rows[0];
    }
  });
};

export default { createUser };
