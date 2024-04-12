import { PoolClient } from "pg";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import HuntingSessionModel from "../../models/huntingSession/HuntingSessionModel";
import app from "../../server";
import pool from "../../db/pgPool";
import duckTeamsDataAccess from "../../repository/DuckTeamsDataAccess";
import DuckTeamsModel from "../../models/duckTeams/DuckTeamsModel";
import { generateHuntingSessionModelData } from "../../models/huntingSession/HuntingSessionModelTestData";

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

describe("HuntSession DataAccess", () => {
  let server: any;
  let poolClient: PoolClient;
  let huntSession: HuntingSessionModel;

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
    huntSession = generateHuntingSessionModelData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [
        huntSession.id!,
        huntSession.duckTeams![0].longitude,
        huntSession.duckTeams![0].latitude,
        huntSession.duckTeams![0].specimen,
        huntSession.duckTeams![0].sex,
        huntSession.duckTeams![0].type,
      ];
      sqlStatement =
        "INSERT INTO udb.Hunting_Session_Duck_Teams " +
        "( " +
        "hunting_session_id, duck_position, " +
        "specimen, sex, duck_type " +
        ") " +
        "VALUES " +
        "( " +
        "$1, POINT($2,$3), $4, $5, $6 " +
        ") RETURNING id; ";
    });

    it("should throw if a value is null", async () => {
      let typeConstraintError = generateDatabaseError(
        "23502",
        "Column 'columnName' cannot be null."
      );

      (poolClient.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(
        duckTeamsDataAccess.create(
          huntSession.duckTeams![0],
          poolClient,
          huntSession.id!
        )
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getByHuntSessionID", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeAll(() => {
      sqlValues = [huntSession.id];
      sqlStatement =
        "SELECT * FROM udb.hunting_session_duck_teams WHERE hunting_session_id = $1 ;";
    });

    it("should return empty array", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(
        duckTeamsDataAccess.getByHuntSessionID(huntSession.id!)
      ).resolves.toEqual([]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });

    it("should return duckTeams array", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [
          {
            id: huntSession.duckTeams![0].id!,
            hunting_session_id: huntSession.duckTeams![0].huntingID,
            duck_position: {
              x: huntSession.duckTeams![0].longitude,
              y: huntSession.duckTeams![0].latitude,
            },
            specimen: huntSession.duckTeams![0].specimen,
            sex: huntSession.duckTeams![0].sex,
            duck_type: huntSession.duckTeams![0].type,
          },
        ],
      });

      await expect(
        duckTeamsDataAccess.getByHuntSessionID(huntSession.id!)
      ).resolves.toEqual([huntSession.duckTeams![0]]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });
});
