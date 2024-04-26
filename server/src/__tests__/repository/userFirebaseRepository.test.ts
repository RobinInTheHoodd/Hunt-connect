import { Database, Reference } from "firebase-admin/database";
import userFirebaseRepository, {
  IUserFirebaseRepository,
} from "../../repository/firebase/userFirebaseRepository";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import { generateUniqueNumberID } from "../../utils/helper";
import { FirebaseError } from "../../models/error/FirebaseError";
import HutHunterModel from "../../models/hutHunterModel";
import exp from "constants";

describe("Hunt Firebase Repository", () => {
  let _mockFirebaseDB: Database;
  let _userFirebaseRepository: IUserFirebaseRepository;
  let _userRef: Reference;

  let _user: IRegisterRequest;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _userFirebaseRepository = userFirebaseRepository;
    _userRef = _mockFirebaseDB.ref("hunt");
    _user = generateRegisterRequestModelData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    let _createUser: any;

    beforeEach(() => {
      _createUser = {
        UIID: _user.UUID,
        displayName: _user.display_name,
        email: _user.email,
        phone: _user.phone,
        role: _user.role,
        cguAccepted: true,
        createDate: new Date(),
        updateDate: new Date(),
      };
    });

    it("should successfully create a user", async () => {
      (_userRef.set as jest.Mock).mockResolvedValue(null);

      await _userFirebaseRepository.create(_user, _userRef);

      expect(_userRef.set).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when setting data fails", async () => {
      const error = new FirebaseError(
        "timeout",
        "Firebase set operation failed"
      );

      (_userRef.set as jest.Mock).mockRejectedValue(error);

      await expect(
        _userFirebaseRepository.create(_user, _userRef)
      ).rejects.toThrow(error);

      expect(_userRef.set).toHaveBeenCalledTimes(1);
    });
  });

  describe("getIDByEmail", () => {
    let _email = "user@example.com";

    it("should return the UIID when a matching email is found", async () => {
      const expectedUIID = "123abc";
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        forEach: jest.fn((callback) => {
          callback({
            key: expectedUIID,
            val: () => ({ email: _email }),
          });
          return true;
        }),
      });

      const UIID = await _userFirebaseRepository.getIDByEmail(_email, _userRef);

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(UIID).toBe(expectedUIID);
    });

    it("should return an empty string if no matching email is found", async () => {
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        forEach: jest.fn((callback) => {
          callback({
            key: "123abc",
            val: () => ({ email: "not_matching@example.com" }),
          });
          return false;
        }),
      });

      const UIID = await _userFirebaseRepository.getIDByEmail(_email, _userRef);

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(UIID).toBe("");
    });

    it("should throw a FirebaseError if no data exists", async () => {
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
      });

      await expect(
        _userFirebaseRepository.getIDByEmail(_email, _userRef)
      ).rejects.toThrow(
        new FirebaseError("user-not-found", "The user account is not found.")
      );

      expect(_userRef.once).toHaveBeenCalledWith("value");
    });

    it("should handle errors during Firebase operations", async () => {
      const error = new Error("Firebase operation failed");
      (_userRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _userFirebaseRepository.getIDByEmail(_email, _userRef)
      ).rejects.toBe(error);

      expect(_userRef.once).toHaveBeenCalledWith("value");
    });
  });

  describe("addHuntSessionID", () => {
    const _huntId = 123456;

    it("should initialize hunt session array if no current data exists", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(null);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHuntSessionID(_huntId, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );

      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual({
        huntSession: [_huntId],
      });
    });

    it("should add a hunt session ID to an existing array", async () => {
      const existingData = { huntSession: [111222] };

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHuntSessionID(_huntId, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        huntSession: [existingData.huntSession[0], _huntId],
      });
    });

    it("should not add a duplicate hunt session ID", async () => {
      const existingData = { huntSession: [_huntId] };

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHuntSessionID(_huntId, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual(existingData);
    });

    it("should handle errors during transaction", async () => {
      const error = new Error("Transaction failed");
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(error, false);
          return Promise.reject(error);
        }
      );

      await expect(
        _userFirebaseRepository.addHuntSessionID(_huntId, _userRef)
      ).rejects.toThrow(error);
    });

    it("should handle uncommitted transactions", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(null, false);
          return Promise.resolve();
        }
      );

      await expect(
        _userFirebaseRepository.addHuntSessionID(_huntId, _userRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );
    });
  });

  describe("addPersonnalHutID", () => {
    const _personalHutID = 123456;

    it("should initialize data with personal hut ID when no current data exists", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(null);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addPersonnalHutID(_personalHutID, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );

      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual({
        personnal_hunt: [_personalHutID],
      });
    });

    it("should update existing data with personal hut ID", async () => {
      const existingData = { otherData: "existing" };

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addPersonnalHutID(_personalHutID, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );

      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        ...existingData,
        personnalHutID: _personalHutID,
      });
    });

    it("should handle transaction errors", async () => {
      const error = new FirebaseError("timeout", "Transaction failed");

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(error, false);
          return Promise.reject(error);
        }
      );

      await expect(
        _userFirebaseRepository.addPersonnalHutID(_personalHutID, _userRef)
      ).rejects.toThrow(error);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should handle uncommitted transactions", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(null, false);
          return Promise.resolve();
        }
      );

      await expect(
        _userFirebaseRepository.addPersonnalHutID(_personalHutID, _userRef)
      ).rejects.toThrow("Transaction not committed");

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
    });
  });

  describe("addObservationID", () => {
    const _observationID = 101010;

    it("should initialize observations if no current data exists", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(null);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addObservationID(_observationID, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual({
        observations: [_observationID],
      });
    });

    it("should add a new observation ID to an existing array", async () => {
      const existingData = { observations: [123456] };

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addObservationID(_observationID, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        ...existingData,
        observations: [existingData.observations[0], _observationID],
      });
    });

    it("should not add a duplicate observation ID", async () => {
      const existingData = { observations: [_observationID] };

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addObservationID(_observationID, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual(existingData);
    });

    it("should handle transaction errors", async () => {
      const error = new FirebaseError("timeout", "Transaction failed");

      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(error, false);
          return Promise.reject(error);
        }
      );

      await expect(
        _userFirebaseRepository.addObservationID(_observationID, _userRef)
      ).rejects.toThrow(error);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
    });

    it("should handle uncommitted transactions", async () => {
      (_userRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, onComplete) => {
          onComplete(null, false);
          return Promise.resolve();
        }
      );

      await expect(
        _userFirebaseRepository.addObservationID(_observationID, _userRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );
    });
  });

  describe("deleteObservationID", () => {
    let _observationID = 202020;

    it("should remove the observation ID if it exists in the list", async () => {
      const existingObservations = [_observationID, 303030, 404040];
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ observations: existingObservations }),
      });

      await _userFirebaseRepository.deleteObservationID(
        _observationID,
        _userRef
      );

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(_userRef.update).toHaveBeenCalledWith({
        observations: [303030, 404040],
      });
    });

    it("should leave the list unchanged if the observation ID is not found", async () => {
      const existingObservations = [303030, 404040];
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ observations: existingObservations }),
      });

      await _userFirebaseRepository.deleteObservationID(
        _observationID,
        _userRef
      );

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(_userRef.update).toHaveBeenCalledWith({
        observations: existingObservations,
      });
    });

    it("should not perform any operation if there are no observations", async () => {
      (_userRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({}),
      });

      await expect(
        _userFirebaseRepository.deleteObservationID(_observationID, _userRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(_userRef.update).not.toHaveBeenCalled();
    });

    it("should handle errors during Firebase operations", async () => {
      const error = new FirebaseError("timout", "Firebase operation failed");
      (_userRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _userFirebaseRepository.deleteObservationID(_observationID, _userRef)
      ).rejects.toThrow("Firebase operation failed");

      expect(_userRef.once).toHaveBeenCalledWith("value");
      expect(_userRef.update).not.toHaveBeenCalled();
    });
  });

  describe("addHutID", () => {
    const _hutID = 1001;
    const _hutName = "Mountain View";

    it("should initialize the hut list with a new hut if no current data exists", async () => {
      (_userRef.transaction as jest.Mock).mockImplementation(
        (updateFunction, onComplete) => {
          const result = updateFunction(null);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHutID(_hutID, _hutName, _userRef);

      expect(_userRef.transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function)
      );
      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual({
        hut: [{ hutID: _hutID, hutName: _hutName }],
      });
    });

    it("should add a new hut if the hut ID is not present", async () => {
      const existingData = { hut: [{ hutID: 1002, hutName: "Lake Side" }] };

      (_userRef.transaction as jest.Mock).mockImplementation(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHutID(_hutID, _hutName, _userRef);

      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        ...existingData,
        hut: [existingData.hut[0], { hutID: _hutID, hutName: _hutName }],
      });
    });

    it("should not add a hut if the hut ID already exists", async () => {
      const existingData = {
        hut: [{ hutID: _hutID, hutName: "Mountain View" }],
      };

      (_userRef.transaction as jest.Mock).mockImplementation(
        (updateFunction, onComplete) => {
          const result = updateFunction(existingData);
          onComplete(null, true);
          return Promise.resolve(result);
        }
      );

      await _userFirebaseRepository.addHutID(_hutID, _hutName, _userRef);

      expect(
        (_userRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual(existingData);
    });

    it("should handle transaction errors", async () => {
      const error = new FirebaseError("timeout", "Transaction failed");
      (_userRef.transaction as jest.Mock).mockImplementation(
        (updateFunction, onComplete) => {
          onComplete(error, false);
          return Promise.reject(error);
        }
      );

      await expect(
        _userFirebaseRepository.addHutID(_hutID, _hutName, _userRef)
      ).rejects.toThrow(error);
    });

    it("should handle uncommitted transactions", async () => {
      (_userRef.transaction as jest.Mock).mockImplementation(
        (updateFunction, onComplete) => {
          onComplete(null, false);
          return Promise.resolve();
        }
      );

      await expect(
        _userFirebaseRepository.addHutID(_hutID, _hutName, _userRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );
    });
  });
});
