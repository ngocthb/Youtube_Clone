import { all } from "redux-saga/effects";
import VideosSaga from "./VideoSaga";
import SearchSaga from "./searchSaga";

export default function* rootSaga() {
  yield all([VideosSaga(), SearchSaga()]);
}
