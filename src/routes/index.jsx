import DefaultLayout from "../Layout/DefaultLayout/DefaultLayout.jsx";
import VideoLayout from "../Layout/VideoLayout/VideoLayout.jsx";
import Content from "../components/Content/Content.jsx";
import Shorts from "../components/Shorts/Shorts.jsx";
import VideosList from "../components/VideosList/VideosList.jsx";
import VideoDetails from "../components/VideoDetails/VideoDetails.jsx";
import Trending from "../components/Trending/Trending.jsx";
import Music from "../components/Music/Music.jsx";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Content />,
      },
      {
        path: "/shorts",
        element: <Shorts />,
      },
      {
        path: "/search/:searchValue",
        element: <VideosList />
      },
      {
        path: "/music",
        element: <Music />,
      },
      {
        path: "/trending",
        element: <Trending />,
      },
    ],
  },
  {
    path: "video",
    element: <VideoLayout />,
    children: [
      {
        path: "/video/:videoId",
        element: <VideoDetails />,
      },

    ],
  },
];
