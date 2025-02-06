import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";

import videoReducer from "./reducers/VideoReducer";
import rootSaga from "./sagas/rootSaga";
import searchReducer from "./reducers/searchReducer";

const rootReducer = combineReducers({
  video: videoReducer,
  search: searchReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
