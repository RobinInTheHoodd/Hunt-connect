import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { firebase } from "@react-native-firebase/database";
import { RootState } from "../store";
import ObservationModel from "../../model/form/ObservationModel";
import ObservationService from "../../service/observationService";
import HuntingSessionModel from "../../model/HuntingSession";

const initialState: HuntingSessionModel | null = null;

export const huntSessionSlice = createSlice({
  name: "huntSession",
  initialState,
  reducers: {
    addHuntSession: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
    removeHuntSession: (state, action: PayloadAction<any>) => {
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
