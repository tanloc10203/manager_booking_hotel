import { all } from "redux-saga/effects";
import hotelSaga from "~/features/hotels/hotelSaga";
import authSaga from "../features/authentication/authSaga";

function* rootSaga() {
  yield all([authSaga(), hotelSaga()]);
}

export default rootSaga;
