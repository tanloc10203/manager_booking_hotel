import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provices: [],
  districts: [],
  wards: [],
  loading: false,
  error: "",
};

const proviceSlice = createSlice({
  name: "provice",
  initialState,
  reducers: {
    // * PROVINCES
    getProvicesStart: (state) => {
      state.loading = true;
    },
    getProvicesSucceed: (state, { payload }) => {
      state.loading = false;
      state.provices = payload;
    },

    // * DISTRICTS
    getDistrictsStart: (state, actions) => {
      state.loading = true;
    },
    getDistrictsSucceed: (state, { payload }) => {
      state.loading = false;
      state.districts = payload;
    },

    // * WARDS
    getWardsStart: (state, actions) => {
      state.loading = true;
    },
    getWardsSucceed: (state, { payload }) => {
      state.loading = false;
      state.wards = payload;
    },

    // * FAILED
    getFailed: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});

const proviceState = (state) => state.provice;

const proviceActions = proviceSlice.actions;

const proviceReducer = proviceSlice.reducer;

export { proviceActions, proviceState };
export default proviceReducer;
