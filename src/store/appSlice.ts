import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  appName: "Mocksmith",
  version: "1.0.0",
  page: "dashboard",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { setPage } = appSlice.actions;

export default appSlice;
