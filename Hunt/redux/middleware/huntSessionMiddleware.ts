import { firebase } from "@react-native-firebase/database";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hook";

import {
  addHuntSession,
  removeHuntSession,
} from "../reducers/huntSessionSlice";
import HutModel from "../../model/HutModel";

export const useHuntSession = () => {
  const dispatch = useAppDispatch();
  const hut: HutModel = useAppSelector((state) => state.hut!);

  const handleHuntSession = useCallback(
    (huntSessionID: any) => {
      const sessionRef = firebase
        .database()
        .ref(`/huntSessions/${huntSessionID}`);

      const onValueChange = (snapshot: any) => {
        if (snapshot.exists()) {
          const sessionData = snapshot.val();
          if (!sessionData.isFinish) {
            dispatch(addHuntSession(JSON.stringify(sessionData)));
            return;
          }
        }
      };

      sessionRef.on("value", onValueChange);
      return () => {
        sessionRef.off("value", onValueChange);
        dispatch(removeHuntSession());
      };
    },
    [dispatch]
  );

  useEffect(() => {
    if (!hut || !hut.huntSession) {
      dispatch(removeHuntSession());
      return;
    }
    hut.huntSession.forEach(handleHuntSession);
  }, [hut, dispatch]);
};
