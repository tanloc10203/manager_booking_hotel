import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  data: [],
  error: "",
  filters: {
    page: 1,
    limit: 10,
  },
  paginations: {
    page: 1,
    limit: 10,
    totalPage: 5,
  },
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    // * Create
    createStart: (state, actions) => {
      state.isLoading = true;
    },
    createSucceed: (state) => {
      toast.success("Thêm khách sạn thành công.");
      state.isLoading = false;
    },
    failed: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
      toast.error(state.error);
    },

    // * GET ALL
    getAllStart: (state, actions) => {
      state.isLoading = true;
    },
    getAllSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload.result;
      state.paginations = {
        ...state.paginations,
        ...payload.paginations,
      };
    },
  },
});

const hotelState = (state) => state.hotel;

const hotelActions = hotelSlice.actions;

const hotelReducer = hotelSlice.reducer;

export { hotelActions, hotelState };
export default hotelReducer;
