import { Reference } from "firebase-admin/database";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import HutHunterModel, { IAuthorizeDay } from "../../models/hutHunterModel";
import { FirebaseError } from "../../models/error/FirebaseError";

export interface IHutFirebaseRepository {
  addHuntSessionID(huntSessionId: number, ref: Reference): Promise<void>;
  create(hutId: number, hut: IRegisterRequest, ref: Reference): Promise<void>;
  createPersonnal(
    hutId: number,
    hut: IRegisterRequest,
    ref: Reference
  ): Promise<any>;
  updateHunterDay(
    hunterID: string,
    authorizeDay: IAuthorizeDay,
    ref: Reference
  ): Promise<void>;
  addObservationID(observationId: number, ref: Reference): Promise<void>;
  deleteHutHunter(hunterID: string, ref: Reference): any;
  getHutName(ref: Reference): any;
  getHutLocationByHuntingId(huntingId: number, ref: Reference): Promise<any>;
  addHunter(hunter: HutHunterModel, ref: Reference): any;
}

class HutFirebaseRepository implements IHutFirebaseRepository {
  constructor() {}

  public async create(
    hutId: number,
    hut: IRegisterRequest,
    ref: Reference
  ): Promise<void> {
    try {
      await ref.set({
        id: hutId,
        ownerId: hut.UUID,
        hunters: [],
        hut_name: hut.hut_name,
        hut_number: hut.hut_number,
        location: hut.postalLocation,
        day: {
          start: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
          end: new Date(2024, 0, 1).setHours(12, 0, 0, 0),
        },
        observations: [],
      });
    } catch (e: any) {
      throw e;
    }
  }

  public async createPersonnal(
    hutId: number,
    hut: IRegisterRequest,
    ref: Reference
  ): Promise<any> {
    try {
      await ref.set({
        id: hutId,
        ownerId: hut.UUID,
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
    } catch (e: any) {
      throw e;
    }
  }

  public async addHuntSessionID(
    huntSessionId: number,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData) => {
          if (currentData === null) {
            return { huntSession: [huntSessionId] };
          } else {
            const updatedhuntSession = currentData.huntSession || [];
            if (!updatedhuntSession.includes(huntSessionId)) {
              updatedhuntSession.push(huntSessionId);
            }
            return { ...currentData, huntSession: updatedhuntSession };
          }
        },
        (error, committed, snapshot: any) => {
          if (error) {
            throw error;
          } else if (!committed) {
            throw new FirebaseError(
              "unavailable",
              "Transaction not committed."
            );
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  public async updateHunterDay(
    hunterID: string,
    authorizeDay: IAuthorizeDay,
    ref: Reference
  ): Promise<void> {
    try {
      ref.child("hunter").transaction(
        (hunters) => {
          if (hunters === null) {
            return hunters;
          }
          const updatedHunters = hunters.map((hunter: HutHunterModel) => {
            if (hunter.hunterID === hunterID) {
              return { ...hunter, authorizeDay: authorizeDay };
            }
            return hunter;
          });

          return updatedHunters;
        },
        (error, committed, snapshot) => {
          if (error) {
            throw error;
          } else if (!committed) {
            throw new FirebaseError(
              "unavailable",
              "Transaction not committed."
            );
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  public async addObservationID(
    observationId: number,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData) => {
          if (currentData === null) {
            return { observation: [observationId] };
          } else {
            const updatedhuntSession = currentData.observation || [];

            if (!updatedhuntSession.includes(observationId)) {
              updatedhuntSession.push(observationId);
            }
            return { ...currentData, observation: updatedhuntSession };
          }
        },
        (error, committed, snapshot) => {
          if (error) {
            throw error;
          } else if (!committed) {
            throw new FirebaseError(
              "unavailable",
              "Transaction not committed."
            );
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  public async deleteHutHunter(hunterID: string, ref: Reference) {
    try {
      const snapshot = await ref.once("value");

      if (snapshot.exists()) {
        const currentData = snapshot.val();

        const updatedhunters = currentData.hunter.filter(
          (hunter: HutHunterModel) => hunter.hunterID !== hunterID
        );

        await ref.update({ hunter: updatedhunters });
      } else {
        throw new FirebaseError(
          "user-not-fount",
          "The user account is not found."
        );
      }
    } catch (e) {
      throw e;
    }
  }

  public async getHutName(ref: Reference) {
    try {
      let hutName: string = "";
      const snapshot = await ref.once("value");

      if (snapshot.exists()) {
        const currentData = snapshot.val();
        hutName = currentData.hut_name;
      } else {
        throw new FirebaseError(
          "user-not-fount",
          "The user account is not found."
        );
      }
      return hutName;
    } catch (e) {
      throw e;
    }
  }

  public async addHunter(hunter: HutHunterModel, ref: Reference) {
    let updatedhunters: any;
    let snapshot: any;
    try {
      snapshot = await ref.once("value");
      if (snapshot.exists()) {
        const currentData = snapshot.val();

        if (currentData.hunter !== undefined) {
          updatedhunters = [...currentData.hunter, hunter];
        } else {
          updatedhunters = [hunter];
        }

        await ref.update({ hunter: updatedhunters });
      } else {
        throw new FirebaseError(
          "user-not-fount",
          "The user account is not found."
        );
      }
    } catch (e) {
      throw e;
    }
  }

  public async getHutLocationByHuntingId(
    huntingId: number,
    ref: Reference
  ): Promise<any> {
    try {
      const snapshot = await ref.get();

      if (snapshot.exists()) {
        return snapshot.val().location;
      } else {
        return [];
      }
    } catch (e: any) {
      throw e;
    }
  }
}

const hutFirebaseRepository = new HutFirebaseRepository();
export default hutFirebaseRepository as HutFirebaseRepository;
