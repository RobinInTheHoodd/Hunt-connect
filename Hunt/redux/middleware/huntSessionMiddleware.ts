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

export const useHuntSession = (user: UserContext) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user?.UIID) return;

    const huntSessionsRef = firebase.database().ref("/huntSessions");

    const userHuntSessionsQuery = huntSessionsRef
      .orderByChild("creatorID")
      .equalTo(user.UIID);

    const onValueChange = (snapshot: any) => {
      let huntSessions: any = null;

      snapshot.forEach((childSnapshot: any) => {
        const session = childSnapshot.val();

        if (!session.isFinish) {
          huntSessions = session;
        } else huntSessions = null;
      });
      const hunt: HuntingSessionModel = huntSessions;

      dispatch(addHuntSession(hunt));
    };

    userHuntSessionsQuery.on("value", onValueChange);

    return () => {
      userHuntSessionsQuery.off("value", onValueChange);
    };
  }, [user?.UIID, dispatch]);
};
