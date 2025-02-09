import { all } from "redux-saga/effects";
import videoSaga from "./VideoSaga";
import SearchSaga from "./searchSaga";


export default function* rootSaga() {
  yield all([videoSaga(), SearchSaga()]);
}
