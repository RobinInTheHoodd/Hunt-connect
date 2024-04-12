import { PoolClient } from "pg";
import pool from "../../db/pgPool";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import ObservationModel from "../../models/observation/ObservationModel";
import { generateObservationModelData } from "../../models/observation/ObservationModelTestData";
import { generateObservationDuckModelData } from "../../models/observationDuck/ObservationDuckModelTestData";
import app from "../../server";
import observationnDataAccess from "../../repository/observationDataAccess";

function generateDatabaseError(
  code: string = "",
  detail: string = ""
): DatabaseError {
  return {
    name: "DatabaseError",
    message: "Une erreur de base de données s'est produite",
    errorType: "postgres",
    code,
    detail,
  };
}

jest.mock("pg", () => {
  const mPoolClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  const mPool = {
    connect: jest.fn().mockResolvedValue(mPoolClient),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("Observation DataAccess", () => {
  let server: any;
  let fakeObservation: ObservationModel;
  let poolClient: PoolClient;

  beforeAll((done) => {
    server = app.listen(0, done);
  });
  afterAll((done) => {
    server.close(() => {
      console.log("Server down");
      done();
    });
  });

  beforeEach(async () => {
    poolClient = await pool.connect();
    fakeObservation = generateObservationModelData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [
        fakeObservation.hunterId,
        fakeObservation.huntingSession,
        fakeObservation.specimen,
        fakeObservation.isInFlight,
        fakeObservation.isInPose,
        fakeObservation.viewDate,
        fakeObservation.killDate,
        fakeObservation.quantityKill,
        fakeObservation.quantityView,
      ];

      sqlStatement = "INSERT INTO udb.hunting_observation VALUES ( ";
      "DEFAULT, " +
        "$1, $2, $3, " +
        "$4, $5, $6, " +
        "$7, $8, $9 " +
        ") RETURNING id;";
    });

    it("should it throw error if null input", async () => {
      const typeConstraintError = generateDatabaseError(
        "23502",
        "Attempted to insert NULL into a column that cannot be null"
      );

      (poolClient.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(
        observationnDataAccess.create(fakeObservation, poolClient)
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("Update", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [
        fakeObservation.hunterId,
        fakeObservation.specimen,
        fakeObservation.isInFlight,
        fakeObservation.isInPose,
        fakeObservation.viewDate,
        fakeObservation.killDate,
        fakeObservation.quantityKill,
        fakeObservation.quantityView,
        fakeObservation.id,
      ];

      sqlStatement =
        "UPDATE udb.hunting_observation " +
        "SET hunter_id = $1, " +
        "specimen = $2, " +
        "is_in_flight = $3, " +
        "is_in_pose = $4, " +
        "view_date = $5, " +
        "kill_date = $6, " +
        "quantity_kill = $7, " +
        "quantity_view = $8 " +
        "WHERE id = $9;";
    });

    it("should it throw error if null input", async () => {
      const typeConstraintError = generateDatabaseError(
        "23502",
        "Attempted to insert NULL into a column that cannot be null"
      );

      (poolClient.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(
        observationnDataAccess.update(
          fakeObservation.id!,
          fakeObservation,
          poolClient
        )
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });
});
