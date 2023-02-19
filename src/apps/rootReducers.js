import { combineReducers } from "@reduxjs/toolkit";
import authManagerReducer from "./../features/authentication/manager/authManagerSlice";

const rootReducers = combineReducers({
  authManager: authManagerReducer,
});

export default rootReducers;
