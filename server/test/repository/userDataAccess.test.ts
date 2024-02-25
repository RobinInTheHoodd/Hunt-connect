import request from "supertest";
import app from "../../server";
import RegisterRequest from "../../models/auth/registerRequest";
import userDataAccess from "../../repository/userDataAccess";
import e from "express";
import AuthService from "../../services/authService";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import { Pool } from "pg";
import pool from "../../db/pgPool";
import { experimentalSetDeliveryMetricsExportedToBigQueryEnabled } from "firebase/messaging/sw";
import { getValue } from "firebase/remote-config";

let dynamicError: DatabaseError = {
  name: "DatabaseError",
  message: "Une erreur de base de données s'est produite",
  errorType: "postgres",
  code: "",
  detail: "",
};

let userToCreate: RegisterRequest;

jest.mock("pg", () => {
  return {
    Pool: jest.fn().mockImplementation(() => {
      return {
        query: jest.fn().mockImplementation((queryText, params) => {
          if (queryText.includes("INSERT")) {
            return Promise.reject({
              code: dynamicError.code,
              detail: dynamicError.detail,
            });
          }
          return Promise.resolve({ rows: [], rowCount: 0 });
        }),
      };
    }),
  };
});

describe("Service Authentication", () => {
  beforeAll((done) => {
    server = app.listen(0, done);
  });
  afterAll((done) => {
    server.close(() => {
      console.log("Server down");
      done();
    });
  });

  describe("createUser", () => {
    const sqlStatement: string =
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

    let sqlValue: any[];

    beforeEach(() => {
      resetUser();
      resetError;
    });

    const resetError = () => {
      dynamicError.code = "";
      dynamicError.detail = "";
    };
    const resetUser = () => {
      userToCreate = {
        UUID: "uuid-test",
        display_name: "Test User",
        email: "test@example.com",
        phone: "+11234567890",
        role: 1,
        hut_name: "Test Hut",
        hut_number: "1",
      };
    };
    const getSqlValue = () => {
      return [
        userToCreate.UUID,
        userToCreate.display_name,
        userToCreate.email,
        0,
        userToCreate.phone,
        userToCreate.role,
        userToCreate.hut_name,
        userToCreate.hut_number,
      ];
    };

    it("should throw error with existing email", async () => {
      dynamicError.code = "23505";
      dynamicError.detail = "La valeur pour le champ email existe déjà.";
      userToCreate.email = "existingEmail@gmail.com";

      await expect(
        userDataAccess.createUser(userToCreate)
      ).rejects.toMatchObject(dynamicError!);

      expect(pool.query).toHaveBeenCalledWith(sqlStatement, getSqlValue());
    });

    it("should throw error with non existing role", async () => {
      dynamicError.code = "23503";
      dynamicError.detail = "La valeur 0 pour le champ role n'existe pas.";
      userToCreate.role = -1;

      await expect(
        userDataAccess.createUser(userToCreate)
      ).rejects.toMatchObject(dynamicError!);

      expect(pool.query).toHaveBeenCalledWith(sqlStatement, getSqlValue());
    });

    it("should throw error with null value", async () => {
      dynamicError.code = "23502";
      dynamicError.detail = "Une valeur est requise pour le champ email";
      userToCreate.email = "";

      await expect(
        userDataAccess.createUser(userToCreate)
      ).rejects.toMatchObject(dynamicError!);

      expect(pool.query).toHaveBeenCalledWith(sqlStatement, getSqlValue());
    });

    it("should throw error with invalid format ", async () => {
      dynamicError.code = "22P02";
      dynamicError.detail =
        "Format invalide pour la valeur email. Attendu: exemple@exemple.com";
      userToCreate.email = "invalid format email";

      await expect(
        userDataAccess.createUser(userToCreate)
      ).rejects.toMatchObject(dynamicError!);

      expect(pool.query).toHaveBeenCalledWith(sqlStatement, getSqlValue());
    });

    it("should throw error with unknown error ", async () => {
      dynamicError.code = "#####";
      dynamicError.detail = "Erreur interne du serveur.";
      userToCreate.email = "invalid format email";

      await expect(
        userDataAccess.createUser(userToCreate)
      ).rejects.toMatchObject(dynamicError!);

      expect(pool.query).toHaveBeenCalledWith(sqlStatement, getSqlValue());
    });
  });
});

let server: any;
