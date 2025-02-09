import { all } from "redux-saga/effects";
import VideosSaga from "./videoSaga";
import SearchSaga from "./searchSaga";

export default function* rootSaga() {
  yield all([VideosSaga(), SearchSaga()]);
}