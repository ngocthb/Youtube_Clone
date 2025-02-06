import { call, put, takeLatest, all } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_VIDEOS_REQUEST,
  fetchVideosSuccess,
  fetchVideosFailure,
} from "../actions/videoAction";

// const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const YOUTUBE_API_LIST_VIDEOS =
  "https://youtube.googleapis.com/youtube/v3/videos";

const YOUTUBE_API_CHANNEL =
  "https://youtube.googleapis.com/youtube/v3/channels";

const fetchVideosApi = async (params) => {
  try {
    const response = await axios.get(YOUTUBE_API_LIST_VIDEOS, {
      // params: {
      //   part: "snippet,statistics",
      //   chart: "mostPopular",
      //   regionCode: "US",
      //   key: API_KEY,
      //   maxResults: 10,
      //   pageToken: token,
      // },
      params,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const fetchChannelApi = async (channelId) => {
  try {
    const response = await axios.get(YOUTUBE_API_CHANNEL, {
      params: {
        part: "snippet",
        id: channelId,
        key: API_KEY,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

function* fetchVideosSaga(action) {
  try {
    const videosResponse = yield call(fetchVideosApi, action.payload);
    const videos = videosResponse.data.items;
    const channelRequests = videos.map((video) =>
      call(fetchChannelApi, video.snippet.channelId)
    );
    const channelResponses = yield all(channelRequests);
    const videosWithChannels = videos.map((video, index) => ({
      ...video,
      channelThumbnail:
        channelResponses[index].data.items[0]?.snippet.thumbnails.default.url,
    }));
    const updatedResponse = {
      ...videosResponse.data,
      items: videosWithChannels,
    };
    yield put(fetchVideosSuccess(updatedResponse));
  } catch (error) {
    yield put(fetchVideosFailure(error.message));
  }
}

export default function* VideosSaga() {
  yield all([takeLatest(FETCH_VIDEOS_REQUEST, fetchVideosSaga)]);
}
