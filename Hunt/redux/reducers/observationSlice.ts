import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import ObservationModel from "../../model/form/ObservationModel";

const initialState: ObservationModel[] = [];

export const observationSlice = createSlice({
  name: "observation",
  initialState,
  reducers: {
    addObservation: (state, action: PayloadAction<any>) => {
      return JSON.parse(action.payload);
    },

    removeObservation: (state) => {
      return [];
    },
    updateObservation: (state: any, action: PayloadAction<any>) => {
      const newObservation = JSON.parse(action.payload);
      const index = state.findIndex(
        (obs: ObservationModel) => obs.id === newObservation.id
      );
      if (index !== -1) {
        state[index] = newObservation;
      } else {
        state.push(newObservation);
      }
    },
  },
});

export const selectObservation = (state: RootState) => state.observation;

export const { addObservation, removeObservation, updateObservation } =
  observationSlice.actions;

export default observationSlice.reducer;
