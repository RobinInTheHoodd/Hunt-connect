import { firebase } from "@react-native-firebase/database";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hook";

import {
  removeObservation,
  updateObservation,
} from "../reducers/observationSlice";
import HuntingSessionModel from "../../model/HuntingSession";
import ObservationModel from "../../model/form/ObservationModel";

export const useObservation = () => {
  const dispatch = useAppDispatch();
  const hunt: HuntingSessionModel = useAppSelector(
    (state) => state.huntSession!
  );

  const handleObservation = useCallback(
    (observationID: any) => {
      const observationRef = firebase
        .database()
        .ref(`/observations/${observationID}`);

      const onValueChange = (snapshot: any) => {
        if (snapshot.exists()) {
          const obsData = ObservationModel.fromFirebase(snapshot.val());
          dispatch(updateObservation(JSON.stringify(obsData)));
        }
      };

      observationRef.on("value", onValueChange);
      return () => {
        observationRef.off("value", onValueChange);
        dispatch(removeObservation());
      };
    },
    [dispatch]
  );

  useEffect(() => {
    if (!hunt || !hunt.observation || hunt.observation.length === 0) {
      dispatch(removeObservation());
      return;
    }

    hunt.observation.forEach(handleObservation);
  }, [hunt, handleObservation, dispatch]);
};
