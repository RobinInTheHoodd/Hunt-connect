import pool from "../../db/pgPool";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import HuntingParticipantModel from "../../models/huntingParticipant/HuntingPariticpantModel";
import { generateHuntingParticipantModelData } from "../../models/huntingParticipant/huntingParticipantModelTestData";
import hutDataAccess from "../../repository/hutDataAccess";
import app from "../../server";

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

describe("Hut DataAccess", () => {
  let server: any;
  let fakeRegisterRequest: IRegisterRequest;
  let fakeHutParticipant: HuntingParticipantModel[];

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
    fakeRegisterRequest = generateRegisterRequestModelData();
    fakeHutParticipant = generateHuntingParticipantModelData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [
        fakeRegisterRequest.UUID,
        fakeRegisterRequest.hut_name,
        fakeRegisterRequest.hut_number,
        fakeRegisterRequest.postalLocation,
      ];

      sqlStatement =
        "INSERT INTO udb.hut" +
        "(" +
        "owner_id, display_name, display_number, postal_code" +
        ")" +
        "VALUES" +
        "($1, $2, $3, $4)";
    });

    it("should throw if null input", async () => {
      const typeConstraintError = generateDatabaseError(
        "23502",
        "Attempted to insert NULL into a column that cannot be null"
      );

      (pool.query as jest.Mock).mockRejectedValue(typeConstraintError);

      await expect(hutDataAccess.create(fakeRegisterRequest)).rejects.toEqual(
        typeConstraintError
      );

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getParticipantsByHutID", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [0];

      sqlStatement =
        "SELECT u.user_id, u.display_name " +
        "FROM udb.hut_participant as hp " +
        "INNER JOIN udb.users as u " +
        "ON hp.user_id = u.user_id " +
        "WHERE hp.hut_id = $1 ;";
    });

    it("should return empty participant", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(
        hutDataAccess.getParticipantsByHutID(sqlValues[0])
      ).resolves.toEqual([]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });

    it("should return participant Array", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rows: fakeHutParticipant,
      });

      await expect(
        hutDataAccess.getParticipantsByHutID(sqlValues[0])
      ).resolves.toEqual(fakeHutParticipant);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });

  describe("getHutLocationByHuntingId", () => {
    let sqlValues: any;
    let sqlStatement: string;

    beforeEach(() => {
      sqlValues = [0];
      sqlStatement =
        "SELECT h.postal_code " +
        "FROM udb.hunting_session  as hs " +
        "INNER JOIN udb.hut as h " +
        "ON hs.hut_id = h.id " +
        "WHERE hs.id = $1 ;";
    });

    it("should return empty location", async () => {
      (pool.query as jest.Mock).mockResolvedValue({ rowCount: 0 });

      await expect(
        hutDataAccess.getHutLocationByHuntingId(sqlValues[0])
      ).resolves.toEqual([]);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });

    it("should return location", async () => {
      (pool.query as jest.Mock).mockResolvedValue({
        rowCount: 1,
        rows: [fakeRegisterRequest.postalLocation],
      });

      await expect(
        hutDataAccess.getHutLocationByHuntingId(sqlValues[0])
      ).resolves.toEqual(fakeRegisterRequest.postalLocation);

      expect(pool.query).toHaveBeenCalled();
      expect(pool.query).toHaveBeenCalledWith(sqlStatement, sqlValues);
    });
  });
});
