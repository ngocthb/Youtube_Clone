export const SEARCH_VIDEOS_REQUEST = "SEARCH_VIDEOS_REQUEST";
export const SEARCH_VIDEOS_SUCCESS = "SEARCH_VIDEOS_SUCCESS";
export const SEARCH_VIDEOS_FAILURE = "SEARCH_VIDEOS_FAILURE";
export const SEARCH_RESET = "SEARCH_RESET";

export const searchVideosRequest = (query) => ({
  type: SEARCH_VIDEOS_REQUEST,
  payload: query,
});

export const searchVideosSuccess = (videos) => ({
  type: SEARCH_VIDEOS_SUCCESS,
  payload: videos,
});

export const searchVideosFailure = (error) => ({
  type: SEARCH_VIDEOS_FAILURE,
  payload: error,
});

export const searchReset = () => ({
  type: SEARCH_RESET,
});
