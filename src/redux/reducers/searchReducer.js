import {
  SEARCH_VIDEOS_REQUEST,
  SEARCH_VIDEOS_SUCCESS,
  SEARCH_VIDEOS_FAILURE,
  SEARCH_RESET,
} from "../actions/searchAction";

const initialState = {
  videos: {},
  loading: false,
  error: null,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RESET:
      return {
        ...state,
        videos: {},
        loading: false,
        error: null,
      };
    case SEARCH_VIDEOS_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_VIDEOS_SUCCESS:
      return { ...state, loading: false, videos: action.payload };
    case SEARCH_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default searchReducer;
