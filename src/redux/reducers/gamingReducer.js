import {
  FETCH_GAMING_VIDEOS_REQUEST,
  FETCH_GAMING_VIDEOS_SUCCESS,
  FETCH_GAMING_VIDEOS_FAILURE,
} from '../actions/gamingAction';

const initialState = {
  livestreamVideos: [],
  normalVideos: [],
  loading: false,
  error: null,
};

const gamingReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GAMING_VIDEOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_GAMING_VIDEOS_SUCCESS:
      return {
        ...state,
        loading: false,
        ...(action.payload.isLivestream
          ? { livestreamVideos: action.payload.videos || [] }
          : { normalVideos: action.payload.videos || [] }),
      };
    case FETCH_GAMING_VIDEOS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default gamingReducer;
