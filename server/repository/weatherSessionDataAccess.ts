import { PoolClient } from "pg";
import pool from "../db/pgPool";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";
import WeatherInfoModel, { IWeatherInfoModel } from "../models/WeatherModel";

class WeatherDataAccess {
  constructor() {}

  public async createWeather(
    huntID: number,
    weather: IWeatherInfoModel,
    client: PoolClient
  ) {
    const sql =
      "INSERT INTO udb.Hunting_Session_Weather " +
      "(" +
      "hunting_session_id,  temp_c,   condition_text," +
      "wind_dir,            wind_kph, humidity" +
      ") " +
      "VALUES" +
      "(" +
      "$1, $2, $3, $4, $5, $6" +
      ");";

    const values = [
      huntID,
      weather.tempC,
      weather.conditionText,
      weather.windDir,
      weather.windKph,
      weather.humidity,
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

  public async getByHuntinSessionsID(id: number): Promise<IWeatherInfoModel> {
    try {
      const sql = "SELECT * FROM udb.hunting_session_weather";
      const res = await pool.query(sql);

      return WeatherInfoModel.fromQuery(res.rows[0]);
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

const weatherDataAccess = new WeatherDataAccess();
export default weatherDataAccess as WeatherDataAccess;
