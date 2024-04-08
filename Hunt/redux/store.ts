import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import huntSessionReducer from "./reducers/huntSessionSlice";
import migTrackingReducer from "./reducers/migTrackingSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    huntSession: huntSessionReducer,
    migTracking: migTrackingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
