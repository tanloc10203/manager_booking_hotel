import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "~/features/app/appSlice";
import authReducer from "~/features/authentication/authSlice";
import deviceReducer from "~/features/devices/deviceSlice";
import floorReducer from "~/features/floors/floorSlice";
import hotelReducer from "~/features/hotels/hotelSlice";
import proviceReducer from "~/features/provices/proviceSlice";
import roomTypeReducer from "~/features/room-types/roomTypeSlice";
import roomReducer from "~/features/rooms/roomSlice";
import statusReducer from "~/features/status/statusSlice";

const rootReducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  hotel: hotelReducer,
  provice: proviceReducer,
  floor: floorReducer,
  device: deviceReducer,
  roomType: roomTypeReducer,
  status: statusReducer,
  room: roomReducer,
});

export default rootReducers;
