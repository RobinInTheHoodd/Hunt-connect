import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import HutModel from "../../model/HutModel";

const initialState: HutModel | null = null;

export const hutSlice = createSlice({
  name: "hut",
  initialState,
  reducers: {
    addHut: (state, action: PayloadAction<any>) => {
      return JSON.parse(action.payload);
    },
    removeHut: (state: any) => {
      return null;
    },
    updateHut: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const selectHut = (state: RootState) => state.huntSession;

export const { addHut, removeHut, updateHut } = hutSlice.actions;

export default hutSlice.reducer;
