import "./Content.scss";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideosRequest, resetVideos } from "../../redux/actions/videoAction";
import { Skeleton, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import Carousel from "../Carousel/Carousel"
function Content() {
  const [videoToken, setVideoToken] = useState(null);
  const dispatch = useDispatch();
  const [listVideos, setListVideos] = useState([]);
  const { videos, loading, error } = useSelector((state) => state.video);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  useEffect(() => {
    const params = {
      part: 'snippet,statistics',
      chart: 'mostPopular',
      regionCode: 'US',
      key: API_KEY,
      maxResults: 10,
      pageToken: videoToken,
    };
    dispatch(fetchVideosRequest(params));
  }, [dispatch, videoToken]);

  useEffect(() => {
    if (videos?.items && videos.items.length > 1) {
      setListVideos((prevVideos) => [...prevVideos, ...videos.items]);
    }
  }, [videos]);



  const round = (number) => {
    number = Number(number);
    if (number < 1000) return number;
    else if (number < 1000000) return Math.round(number / 1000) + 'K';
    else if (number < 1000000000) return (number / 1000000).toFixed(1) + 'M';
    else return Math.round(number / 1000000000) + 'B';
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInMonths / 12);

    if (diffInYears > 0) {
      return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
    } else if (diffInMonths > 0) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    } else if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
    }
  }

  const handleClickVideo = (videoId) => {
    dispatch(resetVideos());
    navigate(`/video/${videoId}`);
  }

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
        if (videos?.nextPageToken) {
          setVideoToken(videos.nextPageToken);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [videos])

  const videoGrid = useMemo(() => {
    return listVideos.map((video, index) => (
      <div key={index} className="video-card" onClick={() => handleClickVideo(video.id)}>
        <img
          src={video.snippet.thumbnails.standard.url}
          alt={video.snippet.title}
          className="video-thumbnail"
        />
        <div className="video-info">
          <img
            src={video.channelThumbnail}
            alt={video.snippet.channelId}
            className="video-avatar"
          />
          <div className="video-content">
            <div className="video-title">{video.snippet.title}</div>
            <div className="video-channel">{video.snippet.channelTitle}</div>
            <div className="video-meta">
              <span className="video-views">{round(video.statistics.viewCount)} Views</span>
              <span className="video-time">{formatDate(video.snippet.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    ));
  }, [listVideos]);

  if (loading) return <div className="main-content">
    <Row gutter={[16, 16]}>
      {[...Array(12)].map((_, index) => (
        <Col key={index} xs={24} sm={12} md={8} lg={8}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Col>
      ))}
    </Row>
  </div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="main-content">
      <Carousel />
      <div className="video-grid">
        {videoGrid}
      </div>
    </div>
  );

}


export default Content;
