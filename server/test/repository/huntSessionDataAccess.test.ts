import { PollingWatchKind, convertToObject } from "typescript";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import HuntingSessionModel, {
  IHuntingSessionModel,
} from "../../models/huntingSession/HuntingSessionModel";
import { generateHuntingSessionModelData } from "../../models/huntingSession/HuntingSessionModelTestData";
import huntingSessionDataAccess from "../../repository/huntingSessionDataAccess";
import app from "../../server";
import { Pool, PoolClient } from "pg";
import pool from "../../db/pgPool";

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
        huntSession.hutID,
        huntSession.creatorID,
        huntSession.fromDate,
        null,
        huntSession.isFinish,
      ];
      sqlStatement = `INSERT INTO udb.Hunting_Session (hut_id, creator_id, from_date, to_date, is_finish) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    });

    it("should throw error with null value", async () => {
      const nullConstraintError = generateDatabaseError(
        "23502",
        "La valeur NULL dans un champ non nullable"
      );

      (poolClient.query as jest.Mock).mockRejectedValueOnce(
        nullConstraintError
      );

      await expect(
        huntingSessionDataAccess.create(huntSession, poolClient)
      ).rejects.toEqual(nullConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });

    it("should throw error with wrong object type", async () => {
      const typeConstraintError = generateDatabaseError(
        "22P02",
        "Erreur de typeage: chaîne de caractères au lieu d'un entier"
      );

      (poolClient.query as jest.Mock).mockRejectedValueOnce(
        typeConstraintError
      );

      await expect(
        huntingSessionDataAccess.create(huntSession, poolClient)
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getActiveHuntByUserId", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = "userID";
      sqlStatement =
        "SELECT hs.* FROM udb.hunting_session as hs " +
        "INNER JOIN udb.hunting_session_participant as hsp " +
        "ON hsp.hunting_session_id = hs.id " +
        "WHERE (hs.creator_id = $1 OR hsp.participant_id = $1) " +
        "AND hs.is_finish = false ;";
    });

    it("should return current hunt session", async () => {
      const rs: any = [
        {
          hut_id: huntSession.hutID,
          creator_id: huntSession.creatorID,
          from_date: huntSession.fromDate,
          to_date: huntSession.toDate,
          is_finish: huntSession.isFinish,
          id: 2,
        },
      ];

      (pool.query as jest.Mock).mockResolvedValue({ rows: rs });

      const expectedValue = HuntingSessionModel.fromQuery(rs[0]);

      await expect(
        huntingSessionDataAccess.getActiveHuntByUserId(sqlValues)
      ).resolves.toEqual(expectedValue);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [sqlValues]);
    });

    it("should return void", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(
        huntingSessionDataAccess.getActiveHuntByUserId(sqlValues)
      ).resolves.toBeUndefined();

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [sqlValues]);
    });
  });

  describe("getById", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = "huntingID";
      sqlStatement =
        "SELECT hs.* " +
        "FROM udb.hunting_session as hs " +
        "WHERE hs.id = $1 ;";
    });

    it("should throw error tabble does not exist", async () => {
      const typeConstraintError = generateDatabaseError(
        "42P01",
        "The specified table does not exist."
      );

      (pool.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(huntingSessionDataAccess.getById(sqlValues)).rejects.toEqual(
        typeConstraintError
      );

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [sqlValues]);
    });

    it("should return huntingSession", async () => {
      const rs: any = {
        hut_id: huntSession.hutID,
        creator_id: huntSession.creatorID,
        from_date: huntSession.fromDate,
        to_date: huntSession.toDate,
        is_finish: huntSession.isFinish,
        id: 2,
      };

      let expectedValue = HuntingSessionModel.fromQuery(rs);

      (pool.query as jest.Mock).mockResolvedValue({ rows: [rs] });

      await expect(
        huntingSessionDataAccess.getById(sqlValues)
      ).resolves.toMatchObject(expectedValue);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [sqlValues]);
    });

    it("should return void", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(
        huntingSessionDataAccess.getById(sqlValues)
      ).resolves.toBeUndefined();

      expect(pool.query as jest.Mock).toHaveBeenCalled();
      expect(pool.query as jest.Mock).toHaveBeenCalledWith(sqlStatement, [
        sqlValues,
      ]);
    });
  });

  describe("addParticipant", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = [
        huntSession.participants![0].userID,
        huntSession.participants![0].displayName,
        huntSession.id,
      ];

      sqlStatement =
        "INSERT INTO udb.Hunting_Session_Participant " +
        "(" +
        "participant_id,      display_name, hunting_session_id " +
        ")" +
        "VALUES " +
        "(" +
        "$1, $2, $3" +
        ");";
    });

    it("should throw error participantId is null", async () => {
      huntSession.participants![0].userID = undefined;
      sqlValues[0] = undefined;
      const typeConstraintError = generateDatabaseError(
        "23502",
        "Null value in column participant_id violates not-null constraint"
      );

      (poolClient.query as jest.Mock).mockRejectedValueOnce(
        typeConstraintError
      );

      await expect(
        huntingSessionDataAccess.addParticipant(
          huntSession.id!,
          huntSession.participants![0],
          poolClient
        )
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });

    it("should throw error participantId foreign key not exist", async () => {
      huntSession.participants![0].userID = sqlValues[0] = "test";
      const typeConstraintError = generateDatabaseError(
        "23503",
        "Key participant_id=" + sqlValues[0] + " is not present in table user."
      );

      (poolClient.query as jest.Mock).mockRejectedValueOnce(
        typeConstraintError
      );

      await expect(
        huntingSessionDataAccess.addParticipant(
          huntSession.id!,
          huntSession.participants![0],
          poolClient
        )
      ).rejects.toEqual(typeConstraintError);

      expect(poolClient.query).toHaveBeenCalled();
      expect(poolClient.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getParticipantByHuntingSessionID", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = huntSession.id;
      sqlStatement =
        "SELECT * FROM udb.hunting_session_participant WHERE hunting_session_id = $1;";
    });

    it("Should return empty participants", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      await expect(
        huntingSessionDataAccess.getParticipantByHuntingSessionID(
          huntSession.id!
        )
      ).resolves.toEqual([]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [huntSession.id!]);
    });

    it("Should return participants", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: [
          {
            participant_id: huntSession.participants![0].userID,
            display_name: huntSession.participants![0].displayName,
          },
          {
            participant_id: huntSession.participants![1].userID,
            display_name: huntSession.participants![1].displayName,
          },
        ],
      });

      await expect(
        huntingSessionDataAccess.getParticipantByHuntingSessionID(
          huntSession.id!
        )
      ).resolves.toEqual([
        huntSession.participants![0],
        huntSession.participants![1],
      ]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [huntSession.id!]);
    });
  });

  describe("getHistoryDateHuntingSessionID", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = huntSession.id;
      sqlStatement =
        "SELECT DISTINCT hs.id, hs.from_date " +
        "FROM udb.hunting_session as hs " +
        "INNER JOIN udb.hunting_session_participant as hsp " +
        "ON hs.id = hsp.hunting_session_id " +
        "WHERE hs.is_finish = true " +
        "AND " +
        "( " +
        "hsp.participant_id = $1 " +
        "OR " +
        "hs.creator_id = $1 " +
        ") " +
        "ORDER BY hs.from_date ASC;";
    });

    it("should return empty history", () => {
      (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

      expect(
        huntingSessionDataAccess.getHistoryDateHuntingSessionID(
          huntSession.creatorID
        )
      ).resolves.toEqual([]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [
        huntSession.creatorID,
      ]);
    });

    it("should return history", () => {
      let fakeDate = Date.now().toString();
      const fakeData = [
        {
          id: huntSession.id,
          from_date: fakeDate,
        },
      ];
      (pool.query as jest.Mock).mockResolvedValue({
        rows: fakeData,
      });

      expect(
        huntingSessionDataAccess.getHistoryDateHuntingSessionID(
          huntSession.creatorID
        )
      ).resolves.toEqual([
        {
          huntingId: huntSession.id,
          fromDate: fakeDate,
        },
      ]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [
        huntSession.creatorID,
      ]);
    });
  });

  describe("finishSession", () => {
    let sqlValues: any;
    let sqlStatement: any;

    beforeEach(() => {
      sqlValues = huntSession.id;
      sqlStatement =
        "UPDATE udb.Hunting_Session " +
        "SET is_finish = true, " +
        "to_date = CURRENT_DATE " +
        "WHERE id = $1;";
    });

    it("should throw if hunting not exists", async () => {
      const typeConstraintError = generateDatabaseError();

      (pool.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(
        huntingSessionDataAccess.finishSession(huntSession.id!)
      ).rejects.toEqual(typeConstraintError);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, [huntSession.id]);
    });
  });
});
