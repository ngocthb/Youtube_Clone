import { all, call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";

import {
  SEARCH_VIDEOS_REQUEST,
  searchVideosFailure,
  searchVideosSuccess,
} from "../actions/searchAction";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const YOUTUBE_API_SEARCH = "https://youtube.googleapis.com/youtube/v3/search";

const YOUTUBE_API_CHANNEL =
  "https://youtube.googleapis.com/youtube/v3/channels";

const fetchSearchApi = async (params) => {
  try {
    console.log(params);
    const response = await axios.get(YOUTUBE_API_SEARCH, {
      params,
    });

    return response.data;
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

function* fetchSearchSaga(action) {
  try {
    const videosResponse = yield call(fetchSearchApi, action.payload);
    const videos = videosResponse.items;
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
      ...videosResponse,
      items: videosWithChannels,
    };
    yield put(searchVideosSuccess(updatedResponse));
  } catch (error) {
    yield put(searchVideosFailure(error.message));
  }
}

export default function* SearchSaga() {
  yield all([takeLatest(SEARCH_VIDEOS_REQUEST, fetchSearchSaga)]);
}
