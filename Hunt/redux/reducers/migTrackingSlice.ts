import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState: any = null;

export const migTrackingSlice = createSlice({
  name: "migTracking",
  initialState,
  reducers: {
    addMigTracking: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
    removeMigTracking: (state, action: PayloadAction<any>) => {
      return null;
    },
    updateMigTracking: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const selectHuntSession = (state: RootState) => state.huntSession;

export const { addMigTracking, removeMigTracking, updateMigTracking } =
  migTrackingSlice.actions;

export default migTrackingSlice.reducer;
