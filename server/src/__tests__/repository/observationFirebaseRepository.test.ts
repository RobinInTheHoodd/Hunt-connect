import ObservationModel from "../../models/observation/ObservationModel";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import observationFirebaseRepository, {
  IObservationFirebaseRepository,
} from "../../repository/firebase/observationFirebaseRepository";
import { Database, Reference } from "firebase-admin/database";
import { FirebaseError } from "../../models/error/FirebaseError";

describe("Observation Firebase Repository", () => {
  let _mockFirebaseDB: Database;
  let _observationFirebaseRepository: IObservationFirebaseRepository;
  let _observationRef: Reference;

  let _observation: ObservationModel;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _observationFirebaseRepository = observationFirebaseRepository;
    _observationRef = _mockFirebaseDB.ref("observation");
    _observation = ObservationModel.generateObservation();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create new data if none exists", async () => {
      (_observationRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction) => {
          const result = updateFunction(null);
          return Promise.resolve(result);
        }
      );

      await _observationFirebaseRepository.create(
        _observation,
        _observationRef
      );

      expect(_observationRef.transaction).toHaveBeenCalledTimes(1);
      expect(
        (_observationRef.transaction as jest.Mock).mock.calls[0][0](null)
      ).toEqual(_observation);
    });

    it("should update existing data with new observation", async () => {
      const existingData = { existing: "data" };
      (_observationRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          const result = updateFunction(existingData);

          return existingData;
        }
      );

      await _observationFirebaseRepository.create(
        _observation,
        _observationRef
      );

      expect(_observationRef.transaction).toHaveBeenCalledTimes(1);
      expect(
        (_observationRef.transaction as jest.Mock).mock.calls[0][0](
          existingData
        )
      ).toEqual({
        ...existingData,
        ..._observation,
      });
    });

    it("should handle errors in transaction", async () => {
      let error = new FirebaseError("transaction", "Transaction failed");
      (_observationRef.transaction as jest.Mock).mockImplementationOnce(
        (updateFunction, callback) => {
          callback(error, false, null);
        }
      );

      await expect(
        _observationFirebaseRepository.create(_observation, _observationRef)
      ).rejects.toThrow(error);
      expect(_observationRef.transaction).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("should delete the observation if it exists", async () => {
      (_observationRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(true),
      });

      (_observationRef.remove as jest.Mock).mockResolvedValue(null);

      await _observationFirebaseRepository.delete(
        _observation.id!,
        _observationRef
      );

      expect(_observationRef.once).toHaveBeenCalledWith("value");
      expect(_observationRef.remove).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the observation does not exist", async () => {
      let error = new FirebaseError(
        "observation-not-found",
        "The observation is not found."
      );
      (_observationRef.once as jest.Mock).mockResolvedValue({
        exists: jest.fn().mockReturnValue(false),
      });

      await expect(
        _observationFirebaseRepository.delete(_observation.id!, _observationRef)
      ).rejects.toThrow(error);

      expect(_observationRef.once).toHaveBeenCalledWith("value");
      expect(_observationRef.remove).not.toHaveBeenCalled();
    });

    it("should handle errors during Firebase operations", async () => {
      const error = new FirebaseError(
        "network-error",
        "Temporary service issue. Please try again later."
      );

      (_observationRef.once as jest.Mock).mockRejectedValue(error);

      await expect(
        _observationFirebaseRepository.delete(_observation.id!, _observationRef)
      ).rejects.toBe(error);

      expect(_observationRef.once).toHaveBeenCalledWith("value");
      expect(_observationRef.remove).not.toHaveBeenCalled();
    });
  });
});
