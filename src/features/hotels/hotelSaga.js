import { all, call, put, takeLatest } from "redux-saga/effects";
import { hotelAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { hotelActions } from "./hotelSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(hotelAPI.create, payload);

    if (response) {
      yield put(hotelActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/hotel");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(hotelActions.failed(error.response.data.message));
    } else {
      yield put(hotelActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(hotelActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(hotelAPI.getAll, payload);

    if (response) {
      yield put(hotelActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(hotelActions.failed(error.response.data.message));
    } else {
      yield put(hotelActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(hotelActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(hotelAPI.getAllOptions);

    if (response) {
      yield put(hotelActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(hotelActions.failed(error.response.data.message));
    } else {
      yield put(hotelActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(hotelActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(hotelAPI.update, payload);

    if (response) {
      yield put(hotelActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/hotel");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(hotelActions.failed(error.response.data.message));
    } else {
      yield put(hotelActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(hotelActions.updateStart.type, fetchUpdate);
}

// * Update
function* fetchDelete({ payload }) {
  try {
    const response = yield call(hotelAPI.deleteById, payload);

    if (response) {
      yield put(hotelActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(hotelActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(hotelActions.failed(error.response.data.message));
    } else {
      yield put(hotelActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(hotelActions.deleteStart.type, fetchDelete);
}

function* hotelSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
  ]);
}

export default hotelSaga;
