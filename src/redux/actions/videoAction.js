export const FETCH_VIDEOS_REQUEST = "FETCH_VIDEOS_REQUEST";
export const FETCH_VIDEOS_SUCCESS = "FETCH_VIDEOS_SUCCESS";
export const FETCH_VIDEOS_FAILURE = "FETCH_VIDEOS_FAILURE";
export const FETCH_TRENDING_VIDEOS_REQUEST = "FETCH_TRENDING_VIDEOS_REQUEST";
export const FETCH_TRENDING_VIDEOS_SUCCESS = "FETCH_TRENDING_VIDEOS_SUCCESS";
export const FETCH_TRENDING_VIDEOS_FAILURE = "FETCH_TRENDING_VIDEOS_FAILURE";

export const RESET_VIDEOS = "RESET_VIDEOS";

export const fetchVideosRequest = (params) => ({
  type: FETCH_VIDEOS_REQUEST,
  payload: params,
});

export const fetchVideosSuccess = (videos) => ({
  type: FETCH_VIDEOS_SUCCESS,
  payload: videos,
});

export const fetchVideosFailure = (error) => ({
  type: FETCH_VIDEOS_FAILURE,
  payload: error,
});

// trending videos
export const fetchTrendingVideosRequest = (params) => ({
  type: FETCH_TRENDING_VIDEOS_REQUEST,
  payload: params,
});

export const fetchTrendingVideosSuccess = (videos) => ({
  type: FETCH_TRENDING_VIDEOS_SUCCESS,
  payload: videos,
});

export const fetchTrendingVideosFailure = (error) => ({
  type: FETCH_TRENDING_VIDEOS_FAILURE,
  payload: error,
});

export const resetVideos = () => ({
  type: RESET_VIDEOS,
});
