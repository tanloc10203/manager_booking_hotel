import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  data: [],
  dataOptions: [],
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

    // * GET Options ALL
    getAllOptionsStart: (state, actions) => {
      state.isLoading = true;
    },
    getAllOptionsSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.dataOptions = payload;
    },

    // * UPDATE HOTELE.
    updateStart: (state, actions) => {
      state.isLoading = true;
    },
    updateSucceed: (state) => {
      toast.success("Cập nhật khách sạn thành công.");
      state.isLoading = false;
    },

    // * DELETE HOTELE.
    deleteStart: (state, actions) => {
      state.isLoading = true;
    },
    deleteSucceed: (state) => {
      toast.success("Xoá khách sạn thành công.");
      state.isLoading = false;
    },
  },
});

const hotelState = (state) => state.hotel;

const hotelActions = hotelSlice.actions;

const hotelReducer = hotelSlice.reducer;

export { hotelActions, hotelState };
export default hotelReducer;
