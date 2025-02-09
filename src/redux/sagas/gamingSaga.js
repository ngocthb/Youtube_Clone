import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  FETCH_GAMING_VIDEOS_REQUEST,
  fetchGamingVideosSuccess,
  fetchGamingVideosFailure,
} from '../actions/gamingAction';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const fetchLivestreamVideosApi = async () => {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  const queryParams = `?part=snippet&q=game&type=video&eventType=live&maxResults=5&order=viewCount&key=${API_KEY}`;
  const response = await axios.get(`${baseUrl}${queryParams}`);
  return response.data.items;
};

const fetchNormalVideosApi = async () => {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  const queryParams = `?part=snippet&q=game&type=video&maxResults=5&order=viewCount&key=${API_KEY}`;
  const response = await axios.get(`${baseUrl}${queryParams}`);
  return response.data.items;
};

const fetchVideoDetailsApi = async (videoIds) => {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/videos';
  const queryParams = `?part=liveStreamingDetails&id=${videoIds.join(',')}&key=${API_KEY}`;
  const response = await axios.get(`${baseUrl}${queryParams}`);
  return response.data.items;
};

function* fetchGamingVideosSaga() {
  try {
    const [livestreamVideos, normalVideos] = yield all([
      call(fetchLivestreamVideosApi),
      call(fetchNormalVideosApi),
    ]);

    const livestreamVideoIds = livestreamVideos.map((video) => video.id.videoId);

    const videoDetails = yield call(fetchVideoDetailsApi, livestreamVideoIds);

    const livestreamVideosWithViewers = livestreamVideos.map((video) => {
      const details = videoDetails.find((detail) => detail.id === video.id.videoId);
      return {
        ...video,
        concurrentViewers: details?.liveStreamingDetails?.concurrentViewers || 0,
      };
    });

    yield put(fetchGamingVideosSuccess(livestreamVideosWithViewers, true)); // Livestream
    yield put(fetchGamingVideosSuccess(normalVideos, false)); // Video thường

  } catch (error) {
    yield put(fetchGamingVideosFailure(error.message));
  }
}

export default function* gamingSaga() {
  yield takeLatest(FETCH_GAMING_VIDEOS_REQUEST, fetchGamingVideosSaga);
}
