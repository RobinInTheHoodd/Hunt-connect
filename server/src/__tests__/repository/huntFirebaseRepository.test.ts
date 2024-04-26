import { Database, Reference } from "firebase-admin/database";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import { generateHuntingSessionModelData } from "../../models/huntingSession/HuntingSessionModelTestData";
import HuntingSessionModel from "../../models/huntingSession/HuntingSessionModel";
import huntFirebaseRepository, {
  IHuntFirebaseRepository,
} from "../../repository/firebase/huntFirebaseRepository";
import { FirebaseError } from "../../models/error/FirebaseError";

describe("Hunt Firebase Repository", () => {
  let _mockFirebaseDB: Database;
  let _huntFirebaseRepository: IHuntFirebaseRepository;
  let _huntRef: Reference;

  let _hunt: HuntingSessionModel;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _huntFirebaseRepository = huntFirebaseRepository;
    _huntRef = _mockFirebaseDB.ref("hunt");
    _hunt = generateHuntingSessionModelData();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create a hunting session", async () => {
      (_huntRef.set as jest.Mock).mockResolvedValue(null);

      await huntFirebaseRepository.create(_hunt, _huntRef);

      expect(_huntRef.set).toHaveBeenCalledWith(_hunt);
    });

    it("should handle errors when setting data fails", async () => {
      const error = new FirebaseError(
        "timeout",
        "Temporary service issue. Please try again later."
      );
      (_huntRef.set as jest.Mock).mockRejectedValue(error);

      await expect(
        _huntFirebaseRepository.create(_hunt, _huntRef)
      ).rejects.toThrow(error);

      expect(_huntRef.set).toHaveBeenCalledWith(_hunt);
    });
  });
  describe("addObservationID", () => {
    let _observationID = 999;
    it("should initialize observation array with given ID if current data is null", async () => {
      (_huntRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction) => {
          const result = updateFunction(null);
          return Promise.resolve(result);
        }
      );

      await _huntFirebaseRepository.addObservationID(_observationID, _huntRef);

      expect(_huntRef.transaction).toHaveBeenCalledTimes(1);

      expect(
        (_huntRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual({
        observation: [_observationID],
      });
    });

    it("should add observation ID to an existing array", async () => {
      const existingData = { observation: [456789] };

      (_huntRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(existingData);
          callback(null, true, { val: () => result });
          return result;
        }
      );

      await _huntFirebaseRepository.addObservationID(_observationID, _huntRef);

      expect(_huntRef.transaction).toHaveBeenCalledTimes(1);

      expect(
        (_huntRef.transaction as jest.Mock).mock.calls[0][0](existingData)
      ).toEqual({
        ...existingData,
        observation: [existingData.observation[0], _observationID],
      });
    });

    it("should handle errors in transaction", async () => {
      const error = new FirebaseError(
        "unavailable",
        "Transaction not committed."
      );

      (_huntRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(error, false, null);
        }
      );

      await expect(
        _huntFirebaseRepository.addObservationID(_observationID, _huntRef)
      ).rejects.toThrow(error);

      expect(_huntRef.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchParticipantRefs", () => {
    it("should return participant and creator references for a session", async () => {
      const participants = [
        { hunterID: "hunter1" },
        { hunterID: "hunter2" },
        { hunterID: "" },
      ];
      const creatorID = "creator1";
      const sessionData = {
        participants,
        creatorID,
      };

      (_huntRef.once as jest.Mock).mockResolvedValue({
        val: jest.fn().mockReturnValue(sessionData),
      });
      (_mockFirebaseDB.ref as jest.Mock).mockImplementation((id) => ({
        refId: id,
      }));

      const result = await _huntFirebaseRepository.fetchParticipantRefs(
        _huntRef
      );

      expect(_huntRef.once).toHaveBeenCalledWith("value");
      expect(result.length).toBe(3);
      expect(result[0]).toEqual({ refId: "/user/hunter1" });
      expect(result[1]).toEqual({ refId: "/user/hunter2" });
      expect(result[2]).toEqual({ refId: "/user/creator1" });
    });

    it("should return an empty array if there are no participants", async () => {
      (_huntRef.once as jest.Mock).mockResolvedValue({
        val: jest.fn().mockReturnValue({}),
      });

      const result = await _huntFirebaseRepository.fetchParticipantRefs(
        _huntRef
      );

      expect(result).toEqual([]);
    });

    it("should handle errors during Firebase operations", async () => {
      const error = new FirebaseError(
        "unavailable",
        "Transaction not committed."
      );

      (_huntRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _huntFirebaseRepository.fetchParticipantRefs(_huntRef)
      ).rejects.toThrow(error);

      expect(_huntRef.once).toHaveBeenCalledWith("value");
    });
  });
});
