import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "~/features/app/appSlice";
import authReducer from "~/features/authentication/authSlice";

const rootReducers = combineReducers({
  auth: authReducer,
  app: appReducer,
});

export default rootReducers;
