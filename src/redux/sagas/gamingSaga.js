import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import {
  FETCH_GAMING_VIDEOS_REQUEST,
  fetchGamingVideosSuccess,
  fetchGamingVideosFailure,
} from '../actions/gamingAction';

// Lấy API Key từ biến môi trường
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Hàm gọi API YouTube cho livestream và video thường
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

// Hàm gọi API lấy liveStreamingDetails (số người đang xem)
const fetchVideoDetailsApi = async (videoIds) => {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/videos';
  const queryParams = `?part=liveStreamingDetails&id=${videoIds.join(',')}&key=${API_KEY}`;
  const response = await axios.get(`${baseUrl}${queryParams}`);
  return response.data.items;
};

// Worker Saga: gọi song song cả 2 API và lấy thêm thông tin số người xem live
function* fetchGamingVideosSaga() {
  try {
    // Gọi song song cả 2 API
    const [livestreamVideos, normalVideos] = yield all([
      call(fetchLivestreamVideosApi),
      call(fetchNormalVideosApi),
    ]);

    // Lấy danh sách videoId từ các video livestream
    const livestreamVideoIds = livestreamVideos.map((video) => video.id.videoId);

    // Gọi API để lấy liveStreamingDetails (số người đang xem live)
    const videoDetails = yield call(fetchVideoDetailsApi, livestreamVideoIds);

    // Gắn thêm số người đang xem vào từng video livestream
    const livestreamVideosWithViewers = livestreamVideos.map((video) => {
      const details = videoDetails.find((detail) => detail.id === video.id.videoId);
      return {
        ...video,
        concurrentViewers: details?.liveStreamingDetails?.concurrentViewers || 0,
      };
    });

    // Dispatch thành công cả hai loại video
    yield put(fetchGamingVideosSuccess(livestreamVideosWithViewers, true)); // Livestream
    yield put(fetchGamingVideosSuccess(normalVideos, false)); // Video thường

  } catch (error) {
    // Dispatch lỗi
    yield put(fetchGamingVideosFailure(error.message));
  }
}

// Watcher Saga
export default function* gamingSaga() {
  yield takeLatest(FETCH_GAMING_VIDEOS_REQUEST, fetchGamingVideosSaga);
}
