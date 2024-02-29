import { format } from "path";
import app from "../../server";
import request from "supertest";
import IRegisterRequest from "../../models/auth/RegisterRequest";
import { FirebaseError } from "../../middleware/errorFirebaseMiddleware";
import AuthController from "../../controllers/authController";
import authService from "../../services/authService";
import { NextFunction, Request, Response } from "express";
import exp from "constants";
import { get } from "http";
import router from "../../routes/authRoutes";

let state: string;
let server: any;
let userToCreate: IRegisterRequest;
let error: any = {
  name: "FirebaseError",
  message: "Une erreur de firebase s'est produite",
  errorType: "firebase",
  code: "",
  detail: "",
};

jest.mock("../../services/authService", () => {
  return {
    __esModule: true, // Utilisez cette propriété pour simuler un export par défaut
    default: {
      register: jest.fn().mockImplementation(() => {
        if (state === "rejected") {
          return Promise.reject(error);
        } else {
          return Promise.resolve({ uid: "new UID" });
        }
      }),
    },
  };
});

describe("AuthController", () => {
  let spy: any;
  beforeAll((done) => {
    spy = jest.spyOn(AuthController, "registerController");
    server = app.listen(0, done);
  });
  afterAll((done) => {
    server.close(() => {
      console.log("Server down");
      done();
    });
  });

  beforeEach(() => {
    userToCreate = {
      UUID: "uuid-test",
      display_name: "Test User",
      email: "test@example.com",
      phone: "+11234567890",
      role: 1,
      hut_name: "Test Hut",
      hut_number: "1",
      toJson: () => {},
    };
  });

  describe("/auth/registerFirebase", () => {
    describe("postgres error", () => {
      beforeEach(() => {
        error = {
          name: "DatabaseError",
          message: "Une erreur de base de données s'est produite",
          errorType: "postgres",
          code: "",
          detail: "",
        } as FirebaseError;
      });

      it("should return an error postgres when invalid email", async () => {
        state = "rejected";
        error.code = "23505";
        error.detail = " Key (email)=(alreadyexist@gmail.com) already exists.";

        let result = await request(app)
          .post("/auth/register")
          .send(userToCreate);

        expect(result.statusCode).toEqual(409);
        expect(result.body).toMatchObject({
          message: "La valeur pour le champ 'email' existe déjà.",
          field: "email",
        });
      });

      it("should return an error postgres when invalid role", async () => {
        state = "rejected";
        error.code = "23503";
        error.detail = ' Key (role)=(-1) is not present in table "user_role"';
        userToCreate.role = -1;

        let result = await request(app)
          .post("/auth/register")
          .send(userToCreate);

        expect(result.statusCode).toEqual(422);
        expect(result.body).toMatchObject({
          message: "La valeur '-1' pour le champ 'role' n'existe pas.",
          field: "role",
        });
      });

      it("should return an error postgres when an nullable", async () => {
        state = "rejected";
        error.code = "23502";
        error.detail = 'column "email" ';

        let result = await request(app)
          .post("/auth/register")
          .send(userToCreate);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toMatchObject({
          message: "Une valeur est requise pour le champ 'email'",
          field: "email",
        });
      });

      it("should return an error postgres when invalid data type", async () => {
        state = "rejected";
        error.code = "22P02";
        error.detail = 'invalid input syntax for type integer: "text"';

        let result = await request(app)
          .post("/auth/register")
          .send(userToCreate);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toMatchObject({
          message: "Format invalide pour la valeur 'text'. Attendu: integer.",
          dataType: "integer",
          invalidValue: "text",
        });
      });
    });
  });
});
