jest.mock("../../repository/firebase/userFirebaseRepository");
jest.mock("../../repository/firebase/huntFirebaseRepository");
jest.mock("../../repository/firebase/hutFirebaseRepository");
jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { Database, Reference } from "firebase-admin/database";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import { Auth } from "firebase-admin/auth";
import { generateUniqueNumberID } from "../../utils/helper";
import hutService, { IHutService } from "../../services/hutService";
import { FirebaseError } from "../../models/error/FirebaseError";
import HutHunterModel from "../../models/hutHunterModel";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import { IHuntingSessionModel } from "../../models/huntingSession/HuntingSessionModel";
import { generateHuntingSessionModelData } from "../../models/huntingSession/HuntingSessionModelTestData";
import huntingSessionService, {
  IHuntingSessionService,
} from "../../services/huntingSessionService";
import userFirebaseRepository from "../../repository/firebase/userFirebaseRepository";
import hutFirebaseRepository from "../../repository/firebase/hutFirebaseRepository";
import huntFirebaseRepository from "../../repository/firebase/huntFirebaseRepository";

describe("Hunt Firebase Repository", () => {
  let _mockHunt: IHuntingSessionModel;
  let _mockHuntID: number;
  let _mockHuntService: IHuntingSessionService;
  let _mockFirebaseDB: Database;
  let _hutRef: Reference;
  let _huntRef: Reference;
  let _userRef: Reference;

  //let _observationService: IHutService;

  beforeAll(() => {
    _mockHunt = generateHuntingSessionModelData();
    _mockHuntService = huntingSessionService;
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _userRef = _mockFirebaseDB.ref("/user");
    _huntRef = _mockFirebaseDB.ref("/huntSessions");
    _hutRef = _mockFirebaseDB.ref(`/hut`);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a hunting session and add session IDs to users and huts", async () => {
      const sessionId = await _mockHuntService.create(_mockHunt);

      expect(sessionId).toBe(12345);
      expect(userFirebaseRepository.addHuntSessionID).toHaveBeenCalledTimes(3); // Creator + 2 participants
      expect(hutFirebaseRepository.addHuntSessionID).toHaveBeenCalledWith(
        12345,
        _hutRef
      );
      expect(huntFirebaseRepository.create).toHaveBeenCalledWith(
        _mockHunt,
        _huntRef
      );
    });

    it("should handle errors and perform rollback", async () => {
      const error = new FirebaseError("timeout", "Database error");
      (huntFirebaseRepository.create as jest.Mock).mockRejectedValue(error);

      await expect(_mockHuntService.create(_mockHunt)).rejects.toThrow(error);
      expect(_hutRef.remove).toHaveBeenCalled();
      expect(_huntRef.remove).toHaveBeenCalled();
      expect(_userRef.remove).toHaveBeenCalled();
    });
  });

  describe("finishSession", () => {
    it("should successfully mark the hunting session as finished", async () => {
      await _mockHuntService.finishSession(_mockHuntID);

      expect(
        FirebaseAdminSingleton.getFirebaseDatabase().ref
      ).toHaveBeenCalledWith(`/huntSessions/${_mockHuntID}`);
    });

    it("should attempt to rollback if there is an error during the session finish update", async () => {
      const error = new FirebaseError("timeout", "Update failed");
      (_huntRef.update as jest.Mock).mockRejectedValue(error);

      await expect(_mockHuntService.finishSession(_mockHuntID)).rejects.toThrow(
        error
      );
      expect(_huntRef.remove).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during rollback", async () => {
      const updateError = new FirebaseError("timeout", "Update failed");
      const rollbackError = new Error("Rollback failed");
      (_huntRef.update as jest.Mock).mockRejectedValue(updateError);
      (_huntRef.remove as jest.Mock).mockRejectedValue(rollbackError);

      await expect(_mockHuntService.finishSession(_mockHuntID)).rejects.toThrow(
        updateError
      );
      expect(_huntRef.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe("getHuntLocation", () => {
    const _expectedPostalCode = "12345";

    it("should return postal code when hunt location data exists", async () => {
      (_huntRef.get as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ hutID: _mockHuntID }),
      });

      (
        hutFirebaseRepository.getHutLocationByHuntingId as jest.Mock
      ).mockResolvedValue(_expectedPostalCode);

      const postalCode = await _mockHuntService.getHuntLocation(_huntRef);

      expect(
        FirebaseAdminSingleton.getFirebaseDatabase().ref
      ).toHaveBeenCalledWith(`/hut/${_mockHuntID}`);

      expect(
        hutFirebaseRepository.getHutLocationByHuntingId
      ).toHaveBeenCalledWith(_mockHuntID, _huntRef);
      expect(postalCode).toBe(_expectedPostalCode);
    });

    it("should throw location-not-found error if hunt data does not exist", async () => {
      (_huntRef.get as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
      });

      await expect(_mockHuntService.getHuntLocation(_huntRef)).rejects.toThrow(
        new FirebaseError("location-not-found", "location not found")
      );
    });

    it("should propagate errors from database operations", async () => {
      const error = new FirebaseError("tiemout", "Database access failed");
      (_huntRef.get as jest.Mock).mockRejectedValue(error);

      await expect(_mockHuntService.getHuntLocation(_huntRef)).rejects.toThrow(
        error
      );
    });
  });
});
