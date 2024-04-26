import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserContext } from "../../model/UserContext";
import { RootState } from "../store";

const initialState = JSON.stringify(new UserContext());

export const userSlice = createSlice({
  name: "user",
  initialState: JSON.parse(initialState),
  reducers: {
    signIn: (state, action: PayloadAction<any>) => {
      return JSON.parse(action.payload);
    },
    signOut: (state) => {
      let userContext = JSON.stringify(new UserContext());
      return JSON.parse(userContext);
    },
    setIsNew: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        isNew: action.payload == "true" ? true : false,
      };
    },
  },
});

export const selectUser = (state: RootState) => state.users;

export const { signIn, signOut, setIsNew } = userSlice.actions;

export default userSlice.reducer;
