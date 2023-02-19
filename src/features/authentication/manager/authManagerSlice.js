import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  accessToken: "",
  user: {},
};

const authManagerSlice = createSlice({
  initialState,
  name: "authManager",
  reducers: {
    // * SIGN IN
    signInStart(state, actions) {
      state.isLoading = true;
    },
    signInSucceed(state, { payload }) {
      state.isLoading = false;
      state.accessToken = payload;
    },
    signInFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
    },
  },
});

const authManagerState = (state) => state.authManager;

const authManagerActions = authManagerSlice.actions;

const authManagerReducer = authManagerSlice.reducer;

export { authManagerActions, authManagerState };

export default authManagerReducer;
