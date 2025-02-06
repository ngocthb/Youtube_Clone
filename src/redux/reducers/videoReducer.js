import {
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_FAILURE,
  RESET_VIDEOS,
} from "../actions/videoAction";

const initialState = {
  videos: {},
  loading: false,
  error: null,
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_VIDEOS:
      return {
        ...state,
        videos: {},
      };
    case FETCH_VIDEOS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_VIDEOS_SUCCESS:
      return { ...state, loading: false, videos: action.payload };
    case FETCH_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default videoReducer;
