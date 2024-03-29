import pool from "../db/pgPool";
import { DatabaseError } from "../middleware/errorPostgresMiddleware";
import { DatabaseError as PG, PoolClient } from "pg";
import { IObservationModel } from "../models/ObservationModel";
import ObservationDuckPositionModel, {
  IObservationDuckPositionModel,
} from "../models/ObservationDuckPositionModel";

class ObservationDataAccess {
  constructor() {}
  public async create(
    observation: IObservationModel,
    poolClient: PoolClient
  ): Promise<number> {
    const sql = `
      INSERT INTO udb.hunting_observation 
      VALUES
      (
      DEFAULT,
      $1, $2, $3,
      $4, $5, $6,
      $7, $8, $9
      ) RETURNING id;`;
    const values = [
      observation.hunterId,
      observation.huntingSession,
      observation.specimen,
      observation.isInFlight,
      observation.isInPose,
      observation.viewDate,
      observation.killDate,
      observation.quantityKill,
      observation.quantityView,
    ];
    try {
      const res = await poolClient.query(sql, values);
      return res.rows[0].id;
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

  public async update(
    observationId: number,
    observation: IObservationModel,
    poolClient: PoolClient
  ): Promise<number> {
    const sql = `
      UPDATE udb.hunting_observation
      SET hunter_id = $1,
          specimen = $2,
          is_in_flight = $3,
          is_in_pose = $4,
          view_date = $5,
          kill_date = $6,
          quantity_kill = $7,
          quantity_view = $8
      WHERE id = $9;`;

    const values = [
      observation.hunterId,
      observation.specimen,
      observation.isInFlight,
      observation.isInPose,
      observation.viewDate,
      observation.killDate,
      observation.quantityKill,
      observation.quantityView,
      observation.id,
    ];

    try {
      await poolClient.query(sql, values);
      return observationId;
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

  public async deleteObservations(
    observationId: number,
    poolClient: PoolClient
  ): Promise<void> {
    const sql = `
      DELETE FROM udb.hunting_observation 
      WHERE id = $1
    `;
    const values = [observationId];
    try {
      await poolClient.query(sql, values);
    } catch (err: any) {
      const errr: PG = err;
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

  public async getObservations(huntingId: number): Promise<any> {
    const sql = `
      SELECT * FROM udb.hunting_observation 
      WHERE hunting_id = $1
    `;
    const values = [huntingId];
    try {
      const res = await pool.query(sql, values);
      return res.rows;
    } catch (err: any) {
      const errr: PG = err;
      console.log(errr);
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

  public async createPosition(
    huntingId: number,
    duckPostion: IObservationDuckPositionModel,
    poolClient: PoolClient
  ): Promise<void> {
    const sql = `
      INSERT INTO udb.observation_duck_position 
      VALUES 
      (
      DEFAULT, $1,
      POINT($2,$3), 
      $4, $5
      );`;
    const values = [
      huntingId,
      duckPostion.longitude,
      duckPostion.latitude,
      duckPostion.quantity,
      duckPostion.isKill,
    ];
    try {
      const res = await poolClient.query(sql, values);
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

  public async updatePosition(
    duckPostion: IObservationDuckPositionModel,
    poolClient: PoolClient
  ): Promise<void> {
    const sql = `
      UPDATE udb.observation_duck_position
      SET position =  POINT($1, $2),
                      quantity = $3,
                      is_kill = $4
      WHERE id = $5;
    `;
    const values = [
      duckPostion.longitude,
      duckPostion.latitude,
      duckPostion.quantity,
      duckPostion.isKill,
      duckPostion.id,
    ];
    try {
      await poolClient.query(sql, values);
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

  public async deletePosition(
    positionId: number,
    poolClient: PoolClient
  ): Promise<void> {
    const sql = `
      DELETE FROM udb.observation_duck_position
      WHERE observation_id = $1;
    `;
    const values = [positionId];
    try {
      await poolClient.query(sql, values);
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

  public async getPosition(observationId: number): Promise<any> {
    const sql = `
      SELECT * FROM udb.observation_duck_position 
      WHERE observation_id = $1;
    `;
    const values = [observationId];
    try {
      const res = await pool.query(sql, values);
      let obsevationsDuck: ObservationDuckPositionModel[] = [];

      for (const obsevationDuck of res.rows)
        obsevationsDuck.push(
          ObservationDuckPositionModel.fromQuery(obsevationDuck)
        );

      return obsevationsDuck;
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
const observationnDataAccess = new ObservationDataAccess();
export default observationnDataAccess as ObservationDataAccess;
