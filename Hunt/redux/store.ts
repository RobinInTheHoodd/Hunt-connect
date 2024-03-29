import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";
import observationReducer from "./reducers/observationSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    observations: observationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
