import { memo, useCallback, useEffect, useState } from "react";
import { firebase } from "@react-native-firebase/database";
import { useAppDispatch } from "../hook";
import { addHut, removeHut } from "../reducers/hutSlice";

const useHutListener = async (hutId: any) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();

  const handleValueChange = useCallback(
    (snapshot: any) => {
      if (snapshot.exists()) {
        dispatch(addHut(JSON.stringify(snapshot.val())));
      } else {
        dispatch(removeHut());
      }
      setLoading(false);
    },
    [dispatch]
  );

  const handleError = useCallback((err: any) => {
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hutId) {
      setLoading(false);
      dispatch(removeHut());
      return;
    }

    const hutRef = firebase.database().ref(`hut/${hutId}`);
    hutRef.on("value", handleValueChange, handleError);
    return () => hutRef.off("value", handleValueChange);
  }, [hutId, handleValueChange, handleError, dispatch]);

  return { loading, error };
};
export default useHutListener;
