import { Reference } from "firebase-admin/database";

import { unsubscribe } from "node:diagnostics_channel";
import { IRegisterRequest } from "../../models/auth/RegisterRequest";
import { FirebaseError } from "../../models/error/FirebaseError";

export interface IUserFirebaseRepository {
  create(user: IRegisterRequest, ref: Reference): Promise<void>;
  getIDByEmail(email: string, ref: Reference): Promise<any>;
  addHuntSessionID(huntSessionId: number, ref: Reference): Promise<void>;
  addPersonnalHutID(personnalHutID: number, ref: Reference): Promise<void>;
  addObservationID(observationID: number, ref: Reference): Promise<void>;
  deleteObservationID(observationID: number, ref: Reference): Promise<void>;
  addHutID(hutID: number, hutName: string, ref: Reference): Promise<void>;
}

class UserFirebaseRepository implements IUserFirebaseRepository {
  constructor() {}

  public async create(user: IRegisterRequest, ref: Reference): Promise<void> {
    try {
      await ref.set({
        UIID: user.UUID,
        displayName: user.display_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        cguAccepted: true,
        createDate: new Date(),
        updateDate: new Date(),
      });
    } catch (e: any) {
      throw e;
    }
  }

  public async getIDByEmail(email: string, ref: Reference): Promise<any> {
    try {
      let UIID: string = "";
      const snapshot = await ref.once("value");

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.email === email) {
            console;
            UIID = childSnapshot.key;
            return true;
          }
        });
        return UIID;
      } else {
        throw new FirebaseError(
          "user-not-found",
          "The user account is not found."
        );
      }
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
        (currentData: any) => {
          if (currentData === null) {
            return { huntSession: [huntSessionId] };
          } else {
            const updatedHuntSession = currentData.huntSession || [];
            if (!updatedHuntSession.includes(huntSessionId))
              updatedHuntSession.push(huntSessionId);
            return { ...currentData, huntSession: updatedHuntSession };
          }
        },
        (error, committed) => {
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

  public async addPersonnalHutID(
    personnalHutID: number,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData: any) => {
          if (currentData === null) {
            return { personnal_hunt: [personnalHutID] };
          } else {
            return { ...currentData, personnalHutID: personnalHutID };
          }
        },
        (error, committed) => {
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
    observationID: number,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData: any) => {
          if (currentData === null) {
            return { observations: [observationID] };
          } else {
            const updatedObservations = currentData.observations || [];
            if (!updatedObservations.includes(observationID))
              updatedObservations.push(observationID);
            return { ...currentData, observations: updatedObservations };
          }
        },
        (error, committed) => {
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

  public async deleteObservationID(
    observationID: number,
    ref: Reference
  ): Promise<void> {
    try {
      const userSnapShot = await ref.once("value");

      if (userSnapShot.exists()) {
        const user = userSnapShot.val();

        if (user.observations == null || user.observations == undefined)
          throw new FirebaseError("unavailable", "Transaction not committed.");

        const updatedObservations = user.observations.filter(
          (observation: any) => observation !== observationID
        );
        await ref.update({ observations: updatedObservations });
      }
    } catch (e) {
      throw e;
    }
  }

  public async addHutID(
    hutID: number,
    hutName: string,
    ref: Reference
  ): Promise<void> {
    try {
      ref.transaction(
        (currentData: any) => {
          if (currentData === null) {
            return { hut: [{ hutID: hutID, hutName: hutName }] };
          } else {
            const updatedHut = currentData.hut || [];
            if (!updatedHut.some((hut: any) => hut.hutID === hutID)) {
              updatedHut.push({ hutID: hutID, hutName: hutName });
            }
            return { ...currentData, hut: updatedHut };
          }
        },
        (error, committed) => {
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
}

const userFirebaseRepository = new UserFirebaseRepository();
export default userFirebaseRepository as UserFirebaseRepository;
