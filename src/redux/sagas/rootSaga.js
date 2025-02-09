import { all } from "redux-saga/effects";
import VideosSaga from "./videoSaga";
import SearchSaga from "./searchSaga";
import GamingSaga from "./gamingSaga";
export default function* rootSaga() {
  yield all([VideosSaga(), SearchSaga(), GamingSaga()]);
}
