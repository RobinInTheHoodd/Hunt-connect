import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import ObservationModel from "../../model/form/ObservationModel";
import ObservationService from "../../service/observationService";

interface IinitProps {
  entities: ObservationModel[];
  loading: string;
  error: any;
}
const initialState: IinitProps = {
  entities: [],
  loading: "idle",
  error: null,
};

export const observationSlice = createSlice({
  name: "observations",
  initialState,
  reducers: {
    addObservation: (state, action: PayloadAction<any>) => {
      state.entities.push(action.payload);
    },
    removeObservation: (state, action: PayloadAction<number>) => {
      state.entities = state.entities.filter(
        (observation) => observation.id !== action.payload
      );
    },

    updateObservation: (state, action: PayloadAction<any>) => {
      const index = state.entities.findIndex(
        (observation) => observation.id === action.payload.id
      );
      if (index !== -1) {
        state.entities[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchObservations.pending, (state: any) => {
        state.loading = "pending";
      })
      .addCase(fetchObservations.fulfilled, (state, action: any) => {
        state.loading = "idle";
        console.log(action.payload);
        state.entities = action.payload;
      })

      .addCase(fetchObservations.rejected, (state: any, action: any) => {
        state.loading = "idle";
        state.error = action.payload;
      });
  },
});

export const fetchObservations = createAsyncThunk(
  "observations/fetchObservations",
  async (huntingID: number, { rejectWithValue }) => {
    try {
      const observationService = new ObservationService();
      const fetchedObservations = await observationService.getObservations(
        huntingID
      );

      return fetchedObservations!.map((observation) => ({
        ...observation,
        killDate:
          observation.killDate instanceof Date
            ? observation.killDate.toISOString()
            : observation.killDate,
        viewDate:
          observation.viewDate instanceof Date
            ? observation.viewDate.toISOString()
            : observation.viewDate,
        specimenPosition: observation.specimenPosition,
      }));
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

export const selectObservations = (state: RootState) => state.observations;

export const { addObservation, removeObservation, updateObservation } =
  observationSlice.actions;

export default observationSlice.reducer;
