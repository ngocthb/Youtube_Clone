import {
  FETCH_VIDEOS_REQUEST,
  FETCH_VIDEOS_SUCCESS,
  FETCH_VIDEOS_FAILURE,
  RESET_VIDEOS,
  FETCH_TRENDING_VIDEOS_REQUEST,
  FETCH_TRENDING_VIDEOS_SUCCESS,
  FETCH_TRENDING_VIDEOS_FAILURE,
} from "../actions/videoAction";

const initialState = {
  videos: {},
  trendingVideos: {
    items: [],
    nextPageToken: null,
  },
  loading: false,
  error: null,
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_VIDEOS:
      return {
        ...state,
        videos: {},
        trendingVideos: {
          items: [],
          nextPageToken: null,
        },
      };
    case FETCH_VIDEOS_REQUEST:
    case FETCH_TRENDING_VIDEOS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_VIDEOS_SUCCESS:
      return { ...state, loading: false, videos: action.payload };
    case FETCH_TRENDING_VIDEOS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        trendingVideos: {
          items: state.trendingVideos.items.length > 0
            ? [...state.trendingVideos.items, ...action.payload.items]
            : action.payload.items,
          nextPageToken: action.payload.nextPageToken,
        }
      };
    case FETCH_VIDEOS_FAILURE:
    case FETCH_TRENDING_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default videoReducer;
