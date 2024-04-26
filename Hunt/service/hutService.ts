import { firebase } from "@react-native-firebase/database";
import HuntingParticipantModel, {
  IHuntingParticipanModel,
} from "../model/HuntingParticipantModel";
import { IHutHunterModel } from "../model/HutHunterModel";
import { HutController } from "./hutController";

export default class HutService {
  async getHutParticipantsByHutID(hutId: number) {
    try {
      const res = await HutController.getParticipantsByHutId(hutId);
      if (res.data != undefined) {
        const participants: IHuntingParticipanModel[] =
          HuntingParticipantModel.fromParticipantModel(res.data);
        res.data;
        return participants;
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }

  async updateHunterDay(hutId: number, hunter: IHutHunterModel) {
    try {
      const res = await HutController.updateHunterDay(hutId, hunter);
      return;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteHutHunter(hutID: number, hunterID: string) {
    try {
      const res = await HutController.deleteHutHunter(hutID, hunterID);
    } catch (e) {
      console.log(e);
    }
  }

  async addHunterByEmail(hunterEmail: string, hutID: number) {
    try {
      const res = await HutController.addHunterByEmail(hunterEmail, hutID);
    } catch (e) {
      console.log(e);
    }
  }

  async getHutHunterInfo(hunters: IHutHunterModel[]) {
    try {
      if (hunters === undefined) return [];
      const promises = hunters.map((hunter) => {
        return new Promise<IHutHunterModel>((resolve, reject) => {
          const userRef = firebase.database().ref(`user/${hunter.hunterID}`);
          userRef.once(
            "value",
            (snapshot) => {
              if (snapshot.exists()) {
                const hunterData = snapshot.val();
                resolve({
                  ...hunter,
                  email: hunterData.email,
                  displayName: hunterData.displayName,
                });
              } else {
                resolve(hunter);
              }
            },
            (error) => {
              reject(error);
            }
          );
        });
      });

      const results = await Promise.all(promises);
      return results;
    } catch (e) {
      throw e;
    }
  }

  async getCountHuntSession(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      let count = 0;
      let huntsID: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");

      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();

        if (hunt.hutID == hutID) count++;
      }

      return count;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getAverageKillByNight(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);
      let count = 0;
      let kill = 0;
      let huntsID: any[] = [];
      let observationsID: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined)
            observationsID.push(...hunt.observation);
          count++;
        }
      }

      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();
        kill += observation.quantityKill;
      }

      if (Number.isNaN(kill / count)) return 0;
      return kill / count;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getAverageViewByNight(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);
      let count = 0;
      let view = 0;
      let huntsID: any[] = [];
      let observationsID: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined)
            observationsID.push(...hunt.observation);
          count++;
        }
      }

      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();
        view += observation.quantityView;
      }

      if (Number.isNaN(view / count)) return 0;
      return view / count;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getTotalKill(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);
      let count = 0;
      let kill = 0;
      let huntsID: any[] = [];
      let observationsID: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined)
            observationsID.push(...hunt.observation);
          count++;
        }
      }

      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();
        kill += observation.quantityKill;
      }

      return kill;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getTotalView(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);
      let count = 0;
      let view = 0;
      let huntsID: any[] = [];
      let observationsID: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");

        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined) {
            observationsID.push(...hunt.observation);
          }
          count++;
        }
      }
      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();
        view += observation.quantityView;
      }

      return view;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getTopSpecimen(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);

      let huntsID: any[] = [];
      let observationsID: any[] = [];

      let totalKill = 0;
      let totalView = 0;
      let specimensCount: {
        [key: string]: {
          quantityKill: number;
          quantityView: number;
          killPercentage?: number;
          viewPercentage?: number;
        };
      } = {};

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined)
            observationsID.push(...hunt.observation);
        }
      }

      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();

        let specimenKey = observation.specimen;
        if (specimensCount[specimenKey]) {
          specimensCount[specimenKey].quantityKill += observation.quantityKill;
          specimensCount[specimenKey].quantityView += observation.quantityView;
        } else {
          specimensCount[specimenKey] = {
            quantityKill: observation.quantityKill,
            quantityView: observation.quantityView,
          };
        }

        totalKill += observation.quantityKill;
        totalView += observation.quantityView;
      }

      for (const specimen in specimensCount) {
        specimensCount[specimen].killPercentage =
          (specimensCount[specimen].quantityKill / totalKill) * 100;
        specimensCount[specimen].viewPercentage =
          (specimensCount[specimen].quantityView / totalView) * 100;
      }

      return specimensCount;
    } catch (e: any) {
      console.log(e);
      return 0;
    }
  }

  async getSpecimenPosition(hutID: string, userID: string) {
    try {
      const userRef = firebase.database().ref(`/user/${userID}`);
      const huntsRef = firebase.database().ref(`/huntSessions`);
      const observationsRef = firebase.database().ref(`/observations`);

      let huntsID: any[] = [];
      let observationsID: any[] = [];
      let specimenPos: any[] = [];

      const userSnapshot = await userRef.once("value");
      if (!userSnapshot.exists()) throw new Error("USER non trouvé");
      huntsID = userSnapshot.val().huntSession || [];

      for (const ID of huntsID) {
        const huntSnapshot = await huntsRef.child(ID.toString()).once("value");
        if (!huntSnapshot.exists()) continue;
        let hunt = huntSnapshot.val();
        if (hunt.hutID == hutID) {
          if (hunt.observation !== undefined)
            observationsID.push(...hunt.observation);
        }
      }

      for (const ID of observationsID) {
        const observationSnapshot = await observationsRef
          .child(ID.toString())
          .once("value");
        if (!observationSnapshot.exists()) continue;
        let observation = observationSnapshot.val();
        specimenPos.push({
          ...observation.specimenPosition[0],
          specimen: observation.specimen,
        });
      }

      return specimenPos;
    } catch (e: any) {
      console.log(e);
      return [];
    }
  }
}
