import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openOverlay: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setOpenOverlay: (state, { payload }) => {
      state.openOverlay = payload;
    },
  },
});

const appState = (state) => state.app;

const appActions = appSlice.actions;

const appReducer = appSlice.reducer;

export { appActions, appState };
export default appReducer;
