import app from "../../server";
import RegisterRequest from "../../models/auth/registerRequest";
import AuthService from "../../services/authService";
import { DatabaseError } from "../../middleware/errorPostgresMiddleware";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import { FirebaseError } from "../../middleware/errorFirebaseMiddleware";

let userToCreate: RegisterRequest;
let state: string;
let stateToken: string;
let server: any;
let firebaseError: FirebaseError = {
  name: "FirebaseError",
  message: "Une erreur de firebase s'est produite",
  errorType: "firebase",
  code: "",
  detail: "",
};

jest.mock("../../repository/userDataAccess", () => {
  return {
    __esModule: true, // Utilisez cette propriété pour simuler un export par défaut
    default: {
      createUser: () => {
        Promise.resolve("success");
      },
    },
  };
});

jest.mock("../../config/firebaseConfig", () => ({
  get FirebaseAdminSingleton() {
    return {
      getFirebaseAuth: jest.fn().mockImplementation(() => {
        return {
          createUser: jest.fn().mockImplementation((register: any) => {
            if (state == "rejected") {
              return Promise.reject({
                code: firebaseError.code,
                message: firebaseError.detail,
              });
            } else {
              return Promise.resolve({
                uid: "new UID",
              });
            }
          }),
          createCustomToken: jest.fn().mockImplementation(() => {
            if (stateToken == "rejected") {
              return Promise.reject({
                code: firebaseError.code,
                message: firebaseError.detail,
              });
            } else {
              return Promise.resolve("un-token-simulé");
            }
          }),
        };
      }),
    };
  },
}));

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

  describe("_firebaseRegister", () => {
    const _firebase = FirebaseAdminSingleton.getFirebaseAuth();
    beforeEach(() => {
      resetError(), resetUser(), resetState();
    });

    const resetError = () => {
      (firebaseError.code = ""), (firebaseError.detail = "");
    };

    const resetState = () => {
      state = "rejected";
      stateToken = "rejected";
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
    describe("createUser", () => {
      beforeEach(() => {
        resetError(), resetUser(), resetState();
      });

      it("should throw an error with an existing email", async () => {
        userToCreate.email = "existingEmail@gmail.com ";
        firebaseError.code = "auth/email-already-exists";
        firebaseError.detail =
          "Cette adresse e-mail est déjà utilisée par un autre compte.";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should throw an error with an invalid email", async () => {
        userToCreate.email = "invalidEmail";
        firebaseError.code = "auth/invalid-email";
        firebaseError.detail = "L'adresse e-mail fournie est invalide.";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should throw an error with an weak password", async () => {
        userToCreate.password = "weak";
        firebaseError.code = "auth/weak-password";
        firebaseError.detail =
          "Le mot de passe fourni est trop faible. Il doit contenir au moins 6 caractères.";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should throw an error with an internal error", async () => {
        firebaseError.code = "auth/internal-error";
        firebaseError.detail =
          "Une erreur interne est survenue. Veuillez réessayer plus tard.";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should throw an error with an invalid phone number", async () => {
        firebaseError.code = "auth/invalid-phone-number";
        firebaseError.detail = "Le numéro de téléphone fourni est invalide.";
        userToCreate.phone = "invalid";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should throw an error with an existing phone number", async () => {
        firebaseError.code = "auth/phone-number-already-exists";
        firebaseError.detail = "Le numéro de téléphone fourni est invalide.";
        userToCreate.phone = "1234567890";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
        await expect(_firebase.createCustomToken).toHaveBeenCalledTimes(0);
      });

      it("should return a userRecord with uid", async () => {
        state = "resolve";
        stateToken = "resolve";

        const serviceResponse = await AuthService.register(userToCreate);

        expect(serviceResponse).toMatch("un-token-simulé");
        expect(_firebase.createUser).toHaveBeenCalled();
      });
    });

    describe("createCustomeToken", () => {
      beforeEach(() => {
        resetError(), resetUser(), resetState();
      });

      it("should throw an error whith invalid uid", async () => {
        stateToken = "rejected";
        state = "resolve";

        firebaseError.code = "auth/invalid-uid";
        firebaseError.detail = "Invalid id pour cette utilisateur";

        await expect(AuthService.register(userToCreate)).rejects.toMatchObject(
          firebaseError
        );

        await expect(_firebase.createUser).toHaveBeenCalled();
        await expect(_firebase.createCustomToken).not.toBe("new UID");
        await expect(_firebase.createCustomToken).rejects.toMatchObject({
          code: firebaseError.code,
          message: firebaseError.detail,
        });
      });
    });
  });

  describe("register", () => {});
});
