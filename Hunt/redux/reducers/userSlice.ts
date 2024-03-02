import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserContext } from "../../model/UserContext";
import { AppDispatch, RootState } from "../store";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { State } from "react-native-gesture-handler";

const initialState = new UserContext();

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    signIn: (state, action: PayloadAction<string>) => {
      return JSON.parse(action.payload);
    },
    signOut: (state) => {
      console.log(state);
      let userContext = new UserContext().toJson();
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
