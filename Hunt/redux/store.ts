import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import huntSessionReducer from "./reducers/huntSessionSlice";
import migTrackingReducer from "./reducers/migTrackingSlice";
import observationSlice from "./reducers/observationSlice";
import hutSlice from "./reducers/hutSlice";
import loadingSlice from "./reducers/loadingSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    huntSession: huntSessionReducer,
    hut: hutSlice,
    observation: observationSlice,
    migTracking: migTrackingReducer,
    isLoading: loadingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
