import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { appSliceReducer } from "../domain/AppSlice";

const combinedReducer = combineReducers({
  globalAppState: appSliceReducer,
});

export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});
