import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

const initialState = true;

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLoadingFalse: (state) => {
      return false;
    },
    setLoadingTrue: (state) => {
      return true;
    },
  },
});

export const selectUser = (state: RootState) => state.users;

export const { setLoadingFalse, setLoadingTrue } = userSlice.actions;

export default userSlice.reducer;
