import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVideosRequest,
  resetVideos,
} from "../../redux/actions/videoAction";
import { Skeleton, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import Carousel from "react-multi-carousel";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
function Gaming() {
  const [liveVideos, setLiveVideos] = useState([]);
  const [regularVideos, setRegularVideos] = useState([]);
  const [videoToken, setVideoToken] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Lấy video live stream
  useEffect(() => {
    const fetchLiveVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: "snippet",
              type: "video",
              eventType: "live",
              key: API_KEY,
              videoCategoryId: 20,
              maxResults: 10,
              regionCode: "US",
            },
          }
        );
        setLiveVideos(response.data.items);
      } catch (error) {
        console.error("Error fetching live videos:", error);
      }
    };

    fetchLiveVideos();
  }, [API_KEY]);

  // Lấy video thường
  useEffect(() => {
    const params = {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "US",
      key: API_KEY,
      maxResults: 10,
      videoCategoryId: 20,
      pageToken: videoToken,
    };
    dispatch(fetchVideosRequest(params));
  }, [dispatch, videoToken, API_KEY]);

  const { videos, loading, error } = useSelector((state) => state.video);

  // Lưu video thường vào state
  useEffect(() => {
    if (videos?.items && videos.items.length > 1) {
      setRegularVideos((prevVideos) => [...prevVideos, ...videos.items]);
    }
  }, [videos]);

  const handleClickVideo = (videoId) => {
    dispatch(resetVideos());
    navigate(`/video/${videoId}`);
  };

  const renderVideoCard = (video, isLive = false) => (
    <div
      key={video.id.videoId || video.id}
      className="bg-white overflow-hidden cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.05] flex flex-col  mx-2 h-[350px]"
      onClick={() => handleClickVideo(video.id.videoId || video.id)}
    >
      <div className="relative">
        <img
          src={video.snippet.thumbnails.medium.url}
          alt={video.snippet.title}
          className="w-full h-[190px] object-cover rounded-t-md"
        />
      </div>

      <div className="flex flex-col justify-between">
        <div className="text-sm font-bold text-gray-800 line-clamp-2">
          {video.snippet.title}
        </div>
        <div className="flex items-center mt-1">
          <img
            src={video.snippet.thumbnails.default.url}
            alt={video.snippet.channelTitle}
            className="w-8 h-8 rounded-full mr-2 border border-gray-300"
          />
          <div className="text-sm text-gray-500">
            {video.snippet.channelTitle}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {isLive ? (
            <span className="text-red-500 font-bold">Live Now</span>
          ) : (
            <span> </span>
          )}
        </div>
      </div>
    </div>
  );

  const responsiveSettings = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const customButtonStyles = {
    leftButton:
      "absolute left-[10px] top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-400 shadow-md",
    rightButton:
      "absolute right-[10px] top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-400 shadow-md",
  };

  if (loading)
    return (
      <div className="p-5">
        <Row gutter={[16, 16]}>
          {[...Array(12)].map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={8}>
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            </Col>
          ))}
        </Row>
      </div>
    );

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-5">
      <div className="flex items-center mb-6">
        <img
          alt=""
          className="yt-core-image yt-core-image--fill-parent-height yt-core-image--fill-parent-width yt-core-image--content-mode-scale-to-fill yt-core-image--loaded w-[72px] h-[72px]"
          data-disabled="true"
          src="//yt3.googleusercontent.com/GFc_A-blEltrFJDdN_Hhq7wMxATv1u1LWHF87HZ7duVPBYWfwjeL-mZ8cV2_2hiQfFiHIdM-IXI=s72-c-c0x00ffffff-no-rwa"
        />
        <span className="text-2xl font-bold ml-2">Gaming</span>
      </div>
      <h2 className="text-xl font-bold">Top Live Streams</h2>
      <p className="text-sm text-gray-500 mb-4">
        Sorted by most viewers in your region
      </p>
      <Carousel
        responsive={responsiveSettings}
        infinite
        autoPlay={false}
        customTransition="transform 300ms ease-in-out"
        arrows={true}
        containerClass="relative"
        renderButtonGroupOutside
        customLeftArrow={
          <button className={`text-gray-600 ${customButtonStyles.leftButton}`}>
            <MdArrowBackIosNew />
          </button>
        }
        customRightArrow={
          <button className={`text-gray-600 ${customButtonStyles.rightButton}`}>
            <MdArrowForwardIos />
          </button>
        }
      >
        {liveVideos.map((video) => renderVideoCard(video, true))}
      </Carousel>

      <h2 className="text-xl font-bold mt-4 mb-4">Recomended</h2>
      <Carousel
        responsive={responsiveSettings}
        infinite
        autoPlay={false}
        customTransition="transform 300ms ease-in-out"
        arrows={true}
        containerClass="relative"
        renderButtonGroupOutside
        customLeftArrow={
          <button className={`text-gray-600 ${customButtonStyles.leftButton}`}>
            <MdArrowBackIosNew />
          </button>
        }
        customRightArrow={
          <button className={`text-gray-600 ${customButtonStyles.rightButton}`}>
            <MdArrowForwardIos />
          </button>
        }
      >
        {regularVideos.map((video) => renderVideoCard(video))}
      </Carousel>
    </div>
  );
}

export default Gaming;
