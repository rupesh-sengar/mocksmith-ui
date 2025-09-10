import { configureStore } from "@reduxjs/toolkit";
import { adminApi } from "../api/admin";
import appSlice from "./appSlice";

export const store = configureStore({
  reducer: {
    [adminApi.reducerPath]: adminApi.reducer,
    app: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
