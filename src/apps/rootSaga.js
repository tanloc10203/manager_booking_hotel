import { all } from "redux-saga/effects";
import hotelSaga from "~/features/hotels/hotelSaga";
import proviceSaga from "~/features/provices/proviceSaga";
import authSaga from "../features/authentication/authSaga";

function* rootSaga() {
  yield all([authSaga(), hotelSaga(), proviceSaga()]);
}

export default rootSaga;
