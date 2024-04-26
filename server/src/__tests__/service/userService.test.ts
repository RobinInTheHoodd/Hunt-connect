jest.mock("../../services/hutService", () => ({
  create: jest.fn(),
  createPersonnal: jest.fn(),
}));

import { Database, Reference } from "firebase-admin/database";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import authService, { IAuthService } from "../../services/authService";
import { auth } from "firebase-admin";
import { Auth } from "firebase-admin/auth";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import { generateUniqueNumberID } from "../../utils/helper";
import hutService from "../../services/hutService";
import { FirebaseError } from "../../models/error/FirebaseError";

describe("User Services", () => {
  let _mockFirebaseDB: Database;
  let _mockFirebaseAuth: Auth;
  let _authService: IAuthService;
  let _register: IRegisterRequest;
  let _token: any;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _mockFirebaseAuth = FirebaseAdminSingleton.getFirebaseAuth();
    _authService = authService;
    _register = generateRegisterRequestModelData();
    _token = generateUniqueNumberID;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    beforeEach(() => {
      (_mockFirebaseAuth.getUserByEmail as jest.Mock).mockRejectedValue(
        new FirebaseError("user-not-found", "User not found")
      );

      (_mockFirebaseAuth.createCustomToken as jest.Mock).mockResolvedValue(
        _token
      );
    });

    it("should successfully register a new user and return a custom token", async () => {
      (_mockFirebaseAuth.createUser as jest.Mock).mockResolvedValue({
        uid: _register.UUID,
      });
      const token = await authService.register(_register);

      expect(_mockFirebaseAuth.createUser).toHaveBeenCalledWith({
        displayName: _register.display_name,
        email: _register.email,
        emailVerified: false,
        password: _register.password,
        phoneNumber: "+1" + _register.phone,
        disabled: false,
      });
      expect(hutService.create).toHaveBeenCalledWith(
        _register,
        expect.anything()
      );
      expect(hutService.createPersonnal).toHaveBeenCalledWith(
        _register,
        expect.anything()
      );
      expect(token).toBe(_token);
    });
  });
});
