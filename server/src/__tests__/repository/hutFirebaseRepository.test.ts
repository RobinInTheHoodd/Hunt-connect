import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { generateRegisterRequestModelData } from "../../models/auth/RegisterRequestTestData";
import { Database, Reference } from "firebase-admin/database";
import hutFirebaseRepository, {
  IHutFirebaseRepository,
} from "../../repository/firebase/hutFirebaseRepository";
import { generateUniqueNumberID } from "../../utils/helper";
import { FirebaseError } from "../../models/error/FirebaseError";
import HutHunterModel from "../../models/hutHunterModel";

describe("Hut Firebase Repository", () => {
  let _mockFirebaseDB: Database;
  let _hutFirebaseRepository: IHutFirebaseRepository;
  let _hutRef: Reference;

  let _hutFakeData: IRegisterRequest;
  let _hutIDFakeData: number;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _hutFirebaseRepository = hutFirebaseRepository;
    _hutRef = _mockFirebaseDB.ref("hut");
    _hutIDFakeData = generateUniqueNumberID();
    _hutFakeData = generateRegisterRequestModelData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create a hut in Firebase", async () => {
      (_hutRef.set as jest.Mock).mockResolvedValue(null);

      await _hutFirebaseRepository.create(
        _hutIDFakeData,
        _hutFakeData,
        _hutRef
      );

      expect(_hutRef.set).toHaveBeenCalledTimes(1);
      expect(_hutRef.set).toHaveBeenCalledWith({
        id: _hutIDFakeData,
        ownerId: _hutFakeData.UUID,
        hunters: [],
        hut_name: _hutFakeData.hut_name,
        hut_number: _hutFakeData.hut_number,
        location: _hutFakeData.postalLocation,
        day: {
          start: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
          end: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
        },
        observations: [],
      });
    });

    it("should handle Firebase errors during the creation process", async () => {
      const error = new FirebaseError(
        "network-error",
        "Temporary service issue. Please try again later."
      );

      (_hutRef.set as jest.Mock).mockRejectedValue(error);

      await expect(
        _hutFirebaseRepository.create(_hutIDFakeData, _hutFakeData, _hutRef)
      ).rejects.toThrow(error);
      expect(_hutRef.set).toHaveBeenCalled();
    });
  });

  describe("createPersonnal", () => {
    it("should successfully create a personnal hut in Firebase", async () => {
      (_hutRef.set as jest.Mock).mockResolvedValue(null);

      await _hutFirebaseRepository.createPersonnal(
        _hutIDFakeData,
        _hutFakeData,
        _hutRef
      );

      expect(_hutRef.set).toHaveBeenCalledTimes(1);
      expect(_hutRef.set).toHaveBeenCalledWith({
        id: _hutIDFakeData,
        ownerId: _hutFakeData.UUID,
        hunters: [],
        hut_name: "Personnelle",
        hut_number: "000000000000",
        location: "H3S 1L4",
        day: {
          start: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
          end: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
        },
        observations: [],
      });
    });

    it("should handle Firebase errors during the creation process", async () => {
      const error = new FirebaseError(
        "unavailable",
        "Temporary service issue. Please try again later."
      );

      (_hutRef.set as jest.Mock).mockRejectedValue(error);

      await expect(
        _hutFirebaseRepository.createPersonnal(
          _hutIDFakeData,
          _hutFakeData,
          _hutRef
        )
      ).rejects.toThrow(error);
      expect(_hutRef.set).toHaveBeenCalled();
    });
  });

  describe("addHuntSession", () => {
    it("should initialize huntSession if it does not exist", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(null);
          callback(null, true, { val: () => result });
        }
      );

      await _hutFirebaseRepository.addHuntSessionID(_hutIDFakeData, _hutRef);

      expect(_hutRef.transaction).toHaveBeenCalled();
      expect((_hutRef.transaction as jest.Mock).mock.calls[0][0](null)).toEqual(
        {
          huntSession: [_hutIDFakeData],
        }
      );
    });

    it("should add a huntSessionId to an existing array", async () => {
      const existingData = { huntSession: [456] };

      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(existingData);
          callback(null, true, { val: () => result });
          return result;
        }
      );

      await _hutFirebaseRepository.addHuntSessionID(_hutIDFakeData, _hutRef);

      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);

      expect(
        (_hutRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        huntSession: [456, _hutIDFakeData],
      });
    });

    it("should handle transaction errors", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(null, false, null);
        }
      );

      await expect(
        _hutFirebaseRepository.addHuntSessionID(_hutIDFakeData, _hutRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );
      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);
    });

    it("should handle uncommitted transactions", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(null, false, null);
        }
      );

      await expect(
        _hutFirebaseRepository.addHuntSessionID(_hutIDFakeData, _hutRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );
      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateHunterDay", () => {
    const _authorizeDay = HutHunterModel.generateAuthorizeDay();

    it("should update the authorize day for the specified hunter", async () => {
      const hunters = [{ hunterID: _hutFakeData.UUID, authorizeDay: {} }];

      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(hunters);
          callback(null, true, { val: () => result });
          return result;
        }
      );

      await _hutFirebaseRepository.updateHunterDay(
        _hutFakeData.UUID!,
        _authorizeDay,
        _hutRef
      );

      expect(_hutRef.transaction).toHaveBeenCalled();
      expect(
        (_hutRef.transaction as jest.Mock).mock.calls[0][0](hunters)
      ).toEqual([{ hunterID: _hutFakeData.UUID, authorizeDay: _authorizeDay }]);
    });

    it("should handle null hunters data", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(null);
          callback(null, true, { val: () => result });
          return null;
        }
      );

      await _hutFirebaseRepository.updateHunterDay(
        _hutFakeData.UUID!,
        _authorizeDay,
        _hutRef
      );

      expect(_hutRef.transaction).toHaveBeenCalled();
      expect(
        (_hutRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toBeNull();
    });

    it("should not update if hunter ID does not match", async () => {
      const hunters = [{ hunterID: "otherID", authorizeDay: {} }];
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(hunters);
          callback(null, true, { val: () => result });
          return result;
        }
      );

      await _hutFirebaseRepository.updateHunterDay(
        _hutFakeData.UUID!,
        _authorizeDay,
        _hutRef
      );

      expect(_hutRef.transaction).toHaveBeenCalled();
      expect(
        (_hutRef.transaction as jest.Mock).mock.calls[0][0](hunters)
      ).toEqual(hunters);
    });

    it("should throw an error if the transaction fails", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(
            new FirebaseError("transaction", "Transaction failed"),
            false,
            null
          );
        }
      );

      await expect(
        _hutFirebaseRepository.updateHunterDay(
          _hutFakeData.UUID!,
          _authorizeDay,
          _hutRef
        )
      ).rejects.toThrow(new FirebaseError("transaction", "Transaction failed"));

      expect(_hutRef.transaction).toHaveBeenCalled();
    });

    it("should throw a FirebaseError if the transaction is not committed", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(null, false, null);
        }
      );

      await expect(
        _hutFirebaseRepository.updateHunterDay(
          _hutFakeData.UUID!,
          _authorizeDay,
          _hutRef
        )
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );

      expect(_hutRef.transaction).toHaveBeenCalled();
    });
  });

  describe("addObservationID", () => {
    const _observationID = 99999999;

    it("should initialize observation array with given ID if current data is null", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction) => {
          const result = updateFunction(null);
          return Promise.resolve(result);
        }
      );

      await _hutFirebaseRepository.addObservationID(_observationID, _hutRef);

      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);
      expect((_hutRef.transaction as jest.Mock).mock.calls[0][0](null)).toEqual(
        {
          observation: [_observationID],
        }
      );
    });

    it("should add observation ID to an existing array", async () => {
      const existingData = { observation: [456789] };

      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(existingData);
          callback(null, true, { val: () => result });
          return result;
        }
      );

      await _hutFirebaseRepository.addObservationID(_observationID, _hutRef);

      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);
      expect(
        (_hutRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        observation: [existingData.observation[0], _observationID],
      });
    });

    it("should handle errors in transaction", async () => {
      (_hutRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(
            new FirebaseError("unavailable", "Transaction not committed."),
            false,
            null
          );
        }
      );

      await expect(
        _hutFirebaseRepository.addObservationID(_observationID, _hutRef)
      ).rejects.toThrow(
        new FirebaseError("unavailable", "Transaction not committed.")
      );

      expect(_hutRef.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteHutHunter", () => {
    it("should delete the specified hunter when found", async () => {
      const hunters = [
        { hunterID: "hunter123", name: "John" },
        { hunterID: _hutFakeData.UUID, name: "Doe" },
      ];
      const expectedHunters = [hunters[0]];

      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ hunter: hunters }),
      });

      (_hutRef.update as jest.Mock).mockResolvedValue(null);

      await _hutFirebaseRepository.deleteHutHunter(_hutFakeData.UUID!, _hutRef);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
      expect(_hutRef.update).toHaveBeenCalledWith({ hunter: expectedHunters });
    });

    it("should not modify data if hunter ID does not match any hunters", async () => {
      const hunters = [{ hunterID: "hunter456", name: "Doe" }];

      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ hunter: hunters }),
      });

      (_hutRef.update as jest.Mock).mockResolvedValue(null);

      await _hutFirebaseRepository.deleteHutHunter(_hutFakeData.UUID!, _hutRef);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
      expect(_hutRef.update).toHaveBeenCalledWith({ hunter: hunters });
    });
    it("should throw an error if no data exists", async () => {
      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
        val: jest.fn().mockReturnValue(null),
      });

      await expect(
        _hutFirebaseRepository.deleteHutHunter(_hutFakeData.UUID!, _hutRef)
      ).rejects.toThrow(
        new FirebaseError("user-not-found", "The user account is not found.")
      );

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });

    it("should propagate errors during Firebase operations", async () => {
      const error = new Error("Firebase error");
      (_hutRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _hutFirebaseRepository.deleteHutHunter(_hutFakeData.UUID!, _hutRef)
      ).rejects.toBe(error);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });
  });

  describe("getHutName", () => {
    const expectedHutName = "Mountain Retreat";

    it("should return the hut name when it exists", async () => {
      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ hut_name: expectedHutName }),
      });

      const hutName = await _hutFirebaseRepository.getHutName(_hutRef);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
      expect(hutName).toBe(expectedHutName);
    });

    it("should throw an error if no data exists", async () => {
      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
        val: jest.fn().mockReturnValue(null),
      });

      await expect(_hutFirebaseRepository.getHutName(_hutRef)).rejects.toThrow(
        new FirebaseError("user-not-found", "The user account is not found.")
      );

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });

    it("should propagate errors during Firebase operations", async () => {
      const error = new Error("Firebase error");
      (_hutRef.once as jest.Mock).mockRejectedValue(error);

      await expect(_hutFirebaseRepository.getHutName(_hutRef)).rejects.toBe(
        error
      );

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });
  });

  describe("addHunter", () => {
    let _hutHunter: HutHunterModel = HutHunterModel.generateHutHunterModel();

    it("should add a hunter to an existing list of hunters", async () => {
      const existingHunters = [
        { hunterID: "hunter456", name: "Existing Hunter" },
      ];

      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({ hunter: existingHunters }),
      });

      await _hutFirebaseRepository.addHunter(_hutHunter, _hutRef);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
      expect(_hutRef.update).toHaveBeenCalledWith({
        hunter: [...existingHunters, _hutHunter],
      });
    });

    it("should initialize a new list with the hunter if none exists", async () => {
      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest.fn().mockReturnValue({}),
      });

      await _hutFirebaseRepository.addHunter(_hutHunter, _hutRef);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
      expect(_hutRef.update).toHaveBeenCalledWith({ hunter: [_hutHunter] });
    });

    it("should throw an error if no data exists", async () => {
      (_hutRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
        val: jest.fn().mockReturnValue(null),
      });

      await expect(
        _hutFirebaseRepository.addHunter(_hutHunter, _hutRef)
      ).rejects.toThrow(
        new FirebaseError("user-not-found", "The user account is not found.")
      );

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });

    it("should propagate errors during Firebase operations", async () => {
      const error = new Error("Firebase error");
      (_hutRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _hutFirebaseRepository.addHunter(_hutHunter, _hutRef)
      ).rejects.toBe(error);

      expect(_hutRef.once).toHaveBeenCalledWith("value");
    });
  });

  describe("getHutLocationByHuntingId", () => {
    it("should return the location when data exists", async () => {
      (_hutRef.get as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
        val: jest
          .fn()
          .mockReturnValue({ location: _hutFakeData.postalLocation }),
      });

      const location = await _hutFirebaseRepository.getHutLocationByHuntingId(
        _hutIDFakeData,
        _hutRef
      );

      expect(_hutRef.get).toHaveBeenCalledTimes(1);
      expect(location).toEqual(_hutFakeData.postalLocation);
    });

    it("should return an empty array when no data exists", async () => {
      (_hutRef.get as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
        val: jest.fn().mockReturnValue({}),
      });

      const location = await _hutFirebaseRepository.getHutLocationByHuntingId(
        _hutIDFakeData,
        _hutRef
      );

      expect(_hutRef.get).toHaveBeenCalledTimes(1);
      expect(location).toEqual([]);
    });

    it("should propagate errors during Firebase operations", async () => {
      const error = new Error("Firebase error");
      (_hutRef.get as jest.Mock).mockRejectedValue(error);

      await expect(
        _hutFirebaseRepository.getHutLocationByHuntingId(
          _hutIDFakeData,
          _hutRef
        )
      ).rejects.toBe(error);

      expect(_hutRef.get).toHaveBeenCalledTimes(1);
    });
  });
});

/*



  
  test("Firebase set test with dynamic resolve", async () => {
    // Modifier le mock pour cette instance spécifique
    (_mockFirebaseDB.ref().set as jest.Mock).mockImplementation(() =>
      Promise.resolve("Nouvelle valeur résolue")
    );
    await _mockFirebaseDB.ref("path/to/data").set({ key: "new value" });
    expect(_mockFirebaseDB.ref().set).toHaveBeenCalledWith({
      key: "new value",
    });
  });

  test("Firebase set test with dynamic reject", async () => {
    const db = _mockFirebaseDB;
    (_mockFirebaseDB.ref().set as jest.Mock).mockImplementation(() =>
      Promise.reject(new Error("Erreur simulée"))
    );
    await expect(
      db.ref("path/to/data").set({ key: "new value" })
    ).rejects.toThrow("Erreur simulée");
  });
});

*/
