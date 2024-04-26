import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";

import HuntingSessionModel from "../../model/HuntingSession";

const initialState: HuntingSessionModel | null = null;

export const huntSessionSlice = createSlice({
  name: "huntSession",
  initialState,
  reducers: {
    addHuntSession: (state, action: PayloadAction<any>) => {
      return JSON.parse(action.payload);
    },
    removeHuntSession: (state: any) => {
      return null;
    },
    updateHuntSession: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const selectHuntSession = (state: RootState) => state.huntSession;

export const { addHuntSession, removeHuntSession, updateHuntSession } =
  huntSessionSlice.actions;

export default huntSessionSlice.reducer;
