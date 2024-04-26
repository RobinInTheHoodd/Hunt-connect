import { firebase } from "@react-native-firebase/database";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hook";

import { UserContext } from "../../model/UserContext";
import { signIn } from "../reducers/userSlice";

export const useUser = async () => {
  const user = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const onValueChange = useCallback(
    (snapshot: any) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const updatedUser = UserContext.fromUserFirebase(userData);

        dispatch(signIn(JSON.stringify(updatedUser)));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (user.UIID === "" || user.isNew) return;

    const userRef = firebase.database().ref(`/user/${user.UIID}`);
    userRef.on("value", onValueChange);

    return () => {
      userRef.off("value", onValueChange);
    };
  }, [user.UIID, user.isNew, onValueChange]);
};
