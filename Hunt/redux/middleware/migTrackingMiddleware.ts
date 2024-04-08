import { firebase } from "@react-native-firebase/database";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hook";

import { useSelector } from "react-redux";
import { UserContext } from "../../model/UserContext";
import {
  addHuntSession,
  removeHuntSession,
  updateHuntSession,
} from "../reducers/huntSessionSlice";
import HuntingSessionModel from "../../model/HuntingSession";
import { addMigTracking } from "../reducers/migTrackingSlice";

export const useMigTracking = (user: UserContext) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const migTrackingRef = firebase.database().ref("observations");

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    const userHuntSessionsQuery = migTrackingRef
      .orderByChild("viewDate")
      .startAt(sevenDaysAgo)
      .endAt(now);

    const onValueChange = (snapshot: any) => {
      const observations: any = [];
      snapshot.forEach((childSnapshot: any) => {
        const observation = childSnapshot.val();
        observation.id = childSnapshot.key;
        observations.push(observation);
      });
      dispatch(addMigTracking(observations));
    };

    userHuntSessionsQuery.on("value", onValueChange);

    return () => {
      userHuntSessionsQuery.off("value", onValueChange);
    };
  }, [user?.UIID, dispatch]);
};
