import { all } from "redux-saga/effects";
import deviceSaga from "~/features/devices/deviceSaga";
import floorSaga from "~/features/floors/floorSaga";
import hotelSaga from "~/features/hotels/hotelSaga";
import proviceSaga from "~/features/provices/proviceSaga";
import roomTypeSaga from "~/features/room-types/roomTypeSaga";
import statusSaga from "~/features/status/statusSaga";
import authSaga from "../features/authentication/authSaga";

function* rootSaga() {
  yield all([
    authSaga(),
    hotelSaga(),
    proviceSaga(),
    floorSaga(),
    deviceSaga(),
    roomTypeSaga(),
    statusSaga(),
  ]);
}

export default rootSaga;
