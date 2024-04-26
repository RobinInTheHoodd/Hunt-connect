import { firebase } from "@react-native-firebase/database";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "../hook";

import { UserContext } from "../../model/UserContext";

import { addMigTracking } from "../reducers/migTrackingSlice";

export const useMigTracking = (user: UserContext) => {
  const dispatch = useAppDispatch();

  const handleTracking = useCallback(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyMinutesAgo = now - 30 * 60 * 1000;

    const migTrackerPositionRef = firebase
      .database()
      .ref(`/migTrackerPosition`)
      .orderByChild("viewDate")
      .startAt(sevenDaysAgo)
      .endAt(now).ref;

    const onValueChange = (snapshot: any) => {
      if (snapshot.exists()) {
        const observations: any = [];

        snapshot.forEach((childSnapshot: any) => {
          const observation = childSnapshot.val();

          observation.id = childSnapshot.key;
          observations.push(observation);
        });

        dispatch(addMigTracking(observations));
      }
    };

    migTrackerPositionRef.on("value", onValueChange);
    return () => {
      migTrackerPositionRef.off("value", onValueChange);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!user.isNew) {
      const unsubscribe = handleTracking();
      return unsubscribe;
    }
  }, [user.isNew, handleTracking]);
};
