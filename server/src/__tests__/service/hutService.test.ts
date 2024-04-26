jest.mock("../../repository/firebase/userFirebaseRepository", () => ({
  create: jest.fn().mockReturnThis(),
  addHutID: jest.fn().mockReturnThis(),
  addPersonnalHutID: jest.fn().mockReturnThis(),
  getIDByEmail: jest.fn().mockReturnThis(),
}));
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
import userFirebaseRepository from "../../repository/firebase/userFirebaseRepository";
import hutFirebaseRepository from "../../repository/firebase/hutFirebaseRepository";
import HuntingParticipantModel from "../../models/huntingParticipant/HuntingPariticpantModel";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import firebase from "firebase/compat/app";

describe("Hunt Firebase Repository", () => {
  let _mockFirebaseDB: Database;
  let _mockFirebaseAuth: Auth;
  let _hutService: IHutService;
  let _register: IRegisterRequest;
  let _hutHunter: HutHunterModel;
  let _hutID: number;
  let _userRef: Reference;
  let _hutRef: Reference;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _mockFirebaseAuth = FirebaseAdminSingleton.getFirebaseAuth();
    _userRef = _mockFirebaseDB.ref("user/");
    _hutService = hutService;
    _hutID = 12345;
    _register = generateRegisterRequestModelData();
    _hutRef = _mockFirebaseDB.ref(`/hut/${_hutID.toString()}`);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    _hutHunter = HutHunterModel.generateHutHunterModel();
  });

  describe("create", () => {
    it("should create user and hut when hut_name is provided", async () => {
      let ref = _userRef.child(_hutID.toString());

      await _hutService.create(_register, ref); // Make sure to await here

      expect(_mockFirebaseDB.ref).toHaveBeenCalledWith(
        "/hut/" + _hutID.toString()
      );
      expect(userFirebaseRepository.create).toHaveBeenCalledWith(
        _register,
        ref
      );
      expect(userFirebaseRepository.addHutID).toHaveBeenCalledWith(
        _hutID,
        _register.hut_name,
        ref
      );
      expect(hutFirebaseRepository.create).toHaveBeenCalledWith(
        _hutID,
        _register,
        ref
      );
    });

    it("should not perform any operations when hut_name is empty", async () => {
      const mockUser = { hut_name: "" };
      const mockUserRef = { update: jest.fn() };
      _register.hut_name = "";
      await hutService.create(_register, _userRef);

      expect(userFirebaseRepository.create).not.toHaveBeenCalled();
      expect(userFirebaseRepository.addHutID).not.toHaveBeenCalled();
      expect(hutFirebaseRepository.create).not.toHaveBeenCalled();
      expect(
        FirebaseAdminSingleton.getFirebaseDatabase().ref
      ).not.toHaveBeenCalled();
    });

    it("should throw an error if any of the Firebase operations fail", async () => {
      const error = new FirebaseError("timeout", "Firebase operation failed");
      _register.hut_name = "Mountain Hut";
      (userFirebaseRepository.create as jest.Mock).mockRejectedValue(error);

      await expect(hutService.create(_register, _userRef)).rejects.toThrow(
        "Firebase operation failed"
      );

      expect(userFirebaseRepository.addHutID).not.toHaveBeenCalled();
      expect(hutFirebaseRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if any of the Firebase operations fail", async () => {
      const error = new FirebaseError("timeout", "Firebase operation failed");

      (userFirebaseRepository.create as jest.Mock).mockRejectedValue(error);

      await expect(hutService.create(_register, _userRef)).rejects.toThrow(
        error
      );

      expect(userFirebaseRepository.addHutID).not.toHaveBeenCalled();
      expect(hutFirebaseRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("createPersonnal", () => {
    it("should create a personal hut and register it correctly", async () => {
      await hutService.createPersonnal(_register, _userRef);

      expect(generateUniqueNumberID).toHaveBeenCalled();
      expect(_mockFirebaseDB.ref).toHaveBeenCalledWith("/hut/12345");
      expect(userFirebaseRepository.addPersonnalHutID).toHaveBeenCalledWith(
        12345,
        _userRef
      );
    });

    it("should throw an error if the creation or registration fails", async () => {
      const error = new FirebaseError(
        "timeout",
        "Failed to create or register hut"
      );

      (hutFirebaseRepository.createPersonnal as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        hutService.createPersonnal(_register, _userRef)
      ).rejects.toThrow(error);

      expect(generateUniqueNumberID).toHaveBeenCalled();
      expect(userFirebaseRepository.addPersonnalHutID).not.toHaveBeenCalled();
    });

    it("should throw an error if the creation or registration fails", async () => {
      const error = new FirebaseError(
        "timeout",
        "Failed to create or register hut"
      );

      (hutFirebaseRepository.createPersonnal as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        _hutService.createPersonnal(_register, _userRef)
      ).rejects.toThrow(error);

      expect(userFirebaseRepository.addPersonnalHutID).not.toHaveBeenCalled();
    });
  });

  describe("updateHunterDay", () => {
    beforeEach(() => {});

    it("should update hunter day successfully", async () => {
      await expect(
        hutService.updateHunterDay(_hutID, _hutHunter)
      ).resolves.not.toThrow();
      expect(hutFirebaseRepository.updateHunterDay).toHaveBeenCalledWith(
        _hutHunter.hunterID,
        _hutHunter.authorizeDay,
        _hutRef
      );
    });

    it("should attempt to rollback if there is an error", async () => {
      const error = new FirebaseError("timeout", "Update failed");

      (hutFirebaseRepository.updateHunterDay as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        hutService.updateHunterDay(_hutID, _hutHunter)
      ).rejects.toThrow(error);
      expect(_hutRef.remove).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during rollback", async () => {
      const updateError = new FirebaseError("timout", "Update failed");
      const rollbackError = new Error("Rollback failed");
      (_hutRef.remove as jest.Mock).mockRejectedValue(rollbackError);
      (hutFirebaseRepository.updateHunterDay as jest.Mock).mockRejectedValue(
        updateError
      );

      await expect(
        hutService.updateHunterDay(_hutID, _hutHunter)
      ).rejects.toThrow(updateError);

      expect(_hutRef.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteHutHunter", () => {
    it("should successfully delete the hut hunter", async () => {
      await expect(
        hutService.deleteHutHunter(_hutID, _hutHunter.hunterID)
      ).resolves.not.toThrow();

      expect(hutFirebaseRepository.deleteHutHunter).toHaveBeenCalledWith(
        _hutHunter.hunterID,
        _hutRef
      );
    });

    it("should attempt to rollback if there is an error", async () => {
      const error = new FirebaseError("timeout", "Deletion failed");
      (hutFirebaseRepository.deleteHutHunter as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        hutService.deleteHutHunter(_hutID, _hutHunter.hunterID)
      ).rejects.toThrow(error);

      expect(_hutRef.remove).toHaveBeenCalledTimes(1);
    });

    it("should handle errors during rollback", async () => {
      const deletionError = new FirebaseError("timeout", "Deletion failed");
      const rollbackError = new Error("Rollback failed");
      (_hutRef.remove as jest.Mock).mockRejectedValue(rollbackError);
      (hutFirebaseRepository.deleteHutHunter as jest.Mock).mockRejectedValue(
        deletionError
      );

      await expect(
        hutService.deleteHutHunter(_hutID, _hutHunter.hunterID)
      ).rejects.toThrow("Deletion failed");
      expect(_hutRef.remove).toHaveBeenCalledTimes(1);
      console.error(
        "Failed to rollback Firebase data at MockHutRefPath",
        rollbackError
      );
    });
  });

  describe("addHunter", () => {
    it("should add a hunter when hunter ID is found", async () => {
      (hutFirebaseRepository.getHutName as jest.Mock).mockResolvedValue(
        "Mountain Hut"
      );
      (userFirebaseRepository.getIDByEmail as jest.Mock).mockResolvedValue(
        "hunter123"
      );

      await expect(
        hutService.addHunter(_hutID, _register.email)
      ).resolves.not.toThrow();

      expect(hutFirebaseRepository.getHutName).toHaveBeenCalledWith(_hutRef);
      expect(userFirebaseRepository.getIDByEmail).toHaveBeenCalledWith(
        _register.email,
        _userRef
      );
      expect(userFirebaseRepository.addHutID).toHaveBeenCalled();
      expect(hutFirebaseRepository.addHunter).toHaveBeenCalled();
    });

    it("should not perform any operations if hunter ID is not found", async () => {
      (userFirebaseRepository.getIDByEmail as jest.Mock).mockResolvedValue(
        undefined
      );

      await expect(
        hutService.addHunter(_hutID, _register.email)
      ).resolves.toBeUndefined();

      expect(userFirebaseRepository.addHutID).not.toHaveBeenCalled();
      expect(hutFirebaseRepository.addHunter).not.toHaveBeenCalled();
    });

    it("should rollback changes and throw error if any operation fails", async () => {
      const error = new FirebaseError("timeout", "Operation failed");
      (hutFirebaseRepository.getHutName as jest.Mock).mockRejectedValue(error);

      await expect(
        hutService.addHunter(_hutID, _register.email)
      ).rejects.toThrow(error);

      expect(_userRef.remove).toHaveBeenCalled();
      expect(_hutRef.remove).toHaveBeenCalled();
    });
  });
});
