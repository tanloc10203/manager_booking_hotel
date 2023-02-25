import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "~/features/app/appSlice";
import authReducer from "~/features/authentication/authSlice";
import hotelReducer from "~/features/hotels/hotelSlice";

const rootReducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  hotel: hotelReducer,
});

export default rootReducers;
