export const FETCH_GAMING_VIDEOS_REQUEST = 'FETCH_GAMING_VIDEOS_REQUEST';
export const FETCH_GAMING_VIDEOS_SUCCESS = 'FETCH_GAMING_VIDEOS_SUCCESS';
export const FETCH_GAMING_VIDEOS_FAILURE = 'FETCH_GAMING_VIDEOS_FAILURE';

export const fetchGamingVideosRequest = () => ({
  type: FETCH_GAMING_VIDEOS_REQUEST,
});

export const fetchGamingVideosSuccess = (videos, isLivestream) => ({
  type: FETCH_GAMING_VIDEOS_SUCCESS,
  payload: { videos, isLivestream },
});

export const fetchGamingVideosFailure = (error) => ({
  type: FETCH_GAMING_VIDEOS_FAILURE,
  payload: error,
});
