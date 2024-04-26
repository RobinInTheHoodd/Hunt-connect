jest.mock("../../repository/firebase/userFirebaseRepository");
jest.mock("../../repository/firebase/huntFirebaseRepository");
jest.mock("../../repository/firebase/hutFirebaseRepository");
jest.mock("../../repository/firebase/observationFirebaseRepository");
jest.mock("../../services/huntingSessionService");
jest.mock("../../utils/helper", () => ({
  generateUniqueNumberID: jest.fn().mockImplementation(() => 12345),
}));

import { Database, Reference } from "firebase-admin/database";
import { FirebaseAdminSingleton } from "../../config/firebaseConfig";
import observationService, {
  IObservationService,
} from "../../services/observationService";
import { IObservationModel } from "../../models/observation/ObservationModel";
import { generateObservationModelData } from "../../models/observation/ObservationModelTestData";
import huntingSessionService from "../../services/huntingSessionService";
import huntFirebaseRepository from "../../repository/firebase/huntFirebaseRepository";
import { FirebaseError } from "../../models/error/FirebaseError";
import { error } from "console";
import userFirebaseRepository from "../../repository/firebase/userFirebaseRepository";
import observationFirebaseRepository from "../../repository/firebase/observationFirebaseRepository";

describe("Observation Service", () => {
  let _mockFirebaseDB: Database;
  let _mockObservation: IObservationModel;
  let _mockObservationService: IObservationService;
  let _observationRef: Reference;
  let _huntRef: Reference;
  let _userRef: Reference;

  beforeAll(() => {
    _mockFirebaseDB = FirebaseAdminSingleton.getFirebaseDatabase();
    _mockObservation = generateObservationModelData();
    _mockObservationService = observationService;
    _observationRef = _mockFirebaseDB.ref("/observation");
    _userRef = _mockFirebaseDB.ref("/user");
    _huntRef = _mockFirebaseDB.ref("/huntSessions");
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should successfully create an observation and update all relevant references", async () => {
      const coordinates = { latitude: 10, longitude: 20 };
      (huntingSessionService.getHuntLocation as jest.Mock).mockResolvedValue(
        coordinates
      );
      (
        huntFirebaseRepository.fetchParticipantRefs as jest.Mock
      ).mockResolvedValue([_userRef]);
      jest
        .spyOn(_mockObservationService, "getCoordinatesForPostalCode")
        .mockReturnValueOnce(Promise.resolve(coordinates));

      await _mockObservationService.create(_mockObservation);

      expect(huntingSessionService.getHuntLocation).toHaveBeenCalled();
      expect(
        _mockObservationService.getCoordinatesForPostalCode
      ).toHaveBeenCalledWith(coordinates);

      expect(_mockFirebaseDB.ref).toHaveBeenCalledTimes(6);
    });

    it("should handle errors when fetching hunt location fails", async () => {
      const error = new FirebaseError(
        "location-not-found",
        "Failed to fetch location"
      );
      (huntingSessionService.getHuntLocation as jest.Mock).mockRejectedValue(
        error
      );

      await expect(
        _mockObservationService.create(_mockObservation)
      ).rejects.toThrow(error);

      expect(huntFirebaseRepository.addObservationID).not.toHaveBeenCalled();
    });

    it("should update all relevant Firebase references for users and hunt session", async () => {
      const coordinates = { latitude: 10, longitude: 20 };
      (huntingSessionService.getHuntLocation as jest.Mock).mockResolvedValue(
        coordinates
      );
      jest
        .spyOn(_mockObservationService, "getCoordinatesForPostalCode")
        .mockReturnValueOnce(Promise.resolve(coordinates));
      (
        huntFirebaseRepository.fetchParticipantRefs as jest.Mock
      ).mockResolvedValue([_userRef, _huntRef]);

      await _mockObservationService.create(_mockObservation);

      expect(userFirebaseRepository.addObservationID).toHaveBeenCalledWith(
        12345,
        _userRef
      );
      expect(huntFirebaseRepository.addObservationID).toHaveBeenCalledWith(
        12345,
        _huntRef
      );
    });

    it("should assign unique IDs to each duck position and the observation", async () => {
      const coordinates = { latitude: 10, longitude: 20 };
      (huntingSessionService.getHuntLocation as jest.Mock).mockResolvedValue(
        coordinates
      );
      jest
        .spyOn(_mockObservationService, "getCoordinatesForPostalCode")
        .mockReturnValueOnce(Promise.resolve(coordinates));

      await _mockObservationService.create(_mockObservation);

      expect(_mockFirebaseDB.ref).toHaveBeenCalledWith(
        expect.stringContaining("12345")
      );
      expect(_mockFirebaseDB.ref).toHaveBeenCalledWith(
        expect.stringContaining("observations/12345")
      );
    });

    it("should rollback changes if an error occurs after starting to write to Firebase", async () => {
      const coordinates = { latitude: 10, longitude: 20 };
      const error = new FirebaseError("timeout", "Firebase write error");
      (huntingSessionService.getHuntLocation as jest.Mock).mockResolvedValue(
        coordinates
      );
      jest
        .spyOn(_mockObservationService, "getCoordinatesForPostalCode")
        .mockReturnValueOnce(Promise.resolve(coordinates));
      (
        _mockFirebaseDB.ref("/migTrackerPosition/12345").set as jest.Mock
      ).mockRejectedValue(error);

      await expect(
        _mockObservationService.create(_mockObservation)
      ).rejects.toThrow(error);

      expect(
        _mockFirebaseDB.ref("/migTrackerPosition/12345").remove
      ).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    const huntId = 123;

    it("should successfully update an observation in Firebase", async () => {
      (_mockFirebaseDB.ref as jest.Mock).mockReturnValue(_observationRef);

      await _mockObservationService.update(_mockObservation, huntId);

      expect(_mockFirebaseDB.ref).toHaveBeenCalledWith(
        "/observations/" + _mockObservation.id
      );
      expect(_observationRef.update).toHaveBeenCalledWith(_mockObservation);
    });
  });

  describe("deleteObservation", () => {
    const huntId = 456;
    it("should successfully delete an observation and its references in Firebase", async () => {
      const userRefsMock = [{ set: jest.fn(), toString: () => "/user/1" }];

      (
        huntFirebaseRepository.fetchParticipantRefs as jest.Mock
      ).mockResolvedValue(userRefsMock);
      (
        huntFirebaseRepository.deleteObservationID as jest.Mock
      ).mockResolvedValue(undefined);
      (observationFirebaseRepository.delete as jest.Mock).mockResolvedValue(
        undefined
      );
      (
        userFirebaseRepository.deleteObservationID as jest.Mock
      ).mockResolvedValue(undefined);

      await _mockObservationService.deleteObservation(
        _mockObservation.id!,
        huntId
      );

      expect(huntFirebaseRepository.fetchParticipantRefs).toHaveBeenCalledWith(
        expect.anything()
      );
      expect(huntFirebaseRepository.deleteObservationID).toHaveBeenCalledWith(
        _mockObservation.id!,
        expect.anything()
      );
      expect(observationFirebaseRepository.delete).toHaveBeenCalledWith(
        _mockObservation.id!,
        expect.anything()
      );
      expect(userFirebaseRepository.deleteObservationID).toHaveBeenCalled();
    });

    it("should handle errors and attempt to restore data if a deletion operation fails", async () => {
      const userRefsMock = [{ set: jest.fn(), toString: () => "/user/1" }];

      huntFirebaseRepository.fetchParticipantRefs = jest
        .fn()
        .mockResolvedValue(userRefsMock);
      huntFirebaseRepository.deleteObservationID = jest
        .fn()
        .mockRejectedValue(new Error("Firebase deletion error"));
      userFirebaseRepository.deleteObservationID = jest
        .fn()
        .mockResolvedValue(undefined);

      await expect(
        _mockObservationService.deleteObservation(_mockObservation.id!, huntId)
      ).rejects.toThrow("Firebase deletion error");

      expect(huntFirebaseRepository.deleteObservationID).toHaveBeenCalled();

      for (const userRef of userRefsMock) {
        expect(userRef.set).not.toHaveBeenCalled();
      }
    });
  });

  describe("getCoordinatesForPostalCode", () => {
    it("should return coordinates when API returns status OK", async () => {
      const postalCode = "90210";
      const mockApiResponse = {
        status: "OK",
        results: [
          {
            geometry: {
              location: { lat: 34.07362, lng: -118.400356 },
            },
          },
        ],
      };
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockApiResponse),
        })
      );
      const coordinates =
        await _mockObservationService.getCoordinatesForPostalCode(postalCode);

      expect(coordinates).toEqual({
        latitude: 34.07362,
        longitude: -118.400356,
      });
    });
  });
});
