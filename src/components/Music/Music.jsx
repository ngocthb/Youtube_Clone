import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVideosRequest } from "../../redux/actions/videoAction";
import { PlayIcon } from "lucide-react";
import "./Music.scss";

const VideoSection = ({ title, videos, initialCount = 6 }) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
    setVisibleCount(expanded ? initialCount : videos.length);
  };

  const hasMoreVideos = videos.length > initialCount;

  return (
    <div className="album-videos">
      <h3>{title}</h3>
      <div className={`video-grid-1 ${expanded ? "" : "collapsed"}`}>
        {videos.slice(0, visibleCount).map((video) => (
          <div key={video.id} className="video-card-container show">
            <div className="top-lines"></div>
            <div className="video-card">
              <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
              <div className="play-overlay">
                <PlayIcon />
              </div>
            </div>
            <p className="video-title-1">{video.snippet.title}</p>
          </div>
        ))}
      </div>

      <div className="divider">
        {hasMoreVideos && (
          <button className="button" onClick={handleToggle}>
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

function Music() {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);
  const videoList = Array.isArray(videos?.items) ? videos.items : [];

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("home");

  const params = {
    part: "snippet,statistics",
    regionCode: "US",
    key: API_KEY,
    maxResults: 30,
    chart: "mostPopular",
    videoCategoryId: "10",
    type: "video",
    videoDuration: "short",
  };

  useEffect(() => {
    if (videoList.length === 0) {
      dispatch(fetchVideosRequest(params));
    }
  }, [dispatch, videoList.length, API_KEY]);

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 8));
    }, 1000);

    if (progress >= 100) {
      switchToNextVideo();
    }

    return () => clearInterval(interval);
  }, [progress]);

  const switchToNextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.min(videoList.length, 5));
    setProgress(0);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (videoList.length === 0) return <div className="no-videos">No videos found.</div>;

  const mostPopularVideo = videoList[currentIndex];

  const calculateTimeAgo = (publishedDate) => {
    const now = new Date();
    const diffInTime = now - new Date(publishedDate);
    const diffInMinutes = Math.floor(diffInTime / 60000);
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="music-container">
      <div className="hero">
        <div className="hero-info">
          <p className="channel" key={`channel-${mostPopularVideo.id}`}>
            {mostPopularVideo.snippet.channelTitle} •{" "}
            {parseInt(mostPopularVideo.statistics.viewCount).toLocaleString()} views •{" "}
            {calculateTimeAgo(mostPopularVideo.snippet.publishedAt)}
          </p>
          <h2 key={`title-${mostPopularVideo.id}`}>{mostPopularVideo.snippet.title}</h2>

          <div className="carousel-music">
            {videoList.slice(0, 5).map((video, index) => (
              <div
                key={video.id}
                className={`carousel-item ${index === currentIndex ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(index);
                  setProgress(0);
                }}
              >
                <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                {index === currentIndex && (
                  <div className="carousel-progress-bar">
                    <div className="carousel-progress" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-video">
          <iframe
            src={`https://www.youtube.com/embed/${mostPopularVideo.id}?autoplay=1&mute=1&loop=1&controls=0&iv_load_policy=3&disablekb=1&showinfo=0&playsinline=1&enablejsapi=1&loop=1&playlist=${mostPopularVideo.id}`}
            title={mostPopularVideo.snippet.title}
            frameBorder="0"
            allow="autoplay; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>
      </div>

      <div className="yt-music-channel">
        <div className="yt-music-content">
          <img
            className="yt-music-avatar"
            src="https://yt3.googleusercontent.com/-3Y3URk8DopESFlynIvuiSk6XKG2d7IFvV4wyX97Z6HOtvgOvbrULOqNyXPVWa6xG1nH_JRuMQ=s88-c-k-c0x00ffffff-no-rj-mo"
            alt="YouTube Music"
          />
          <div className="yt-music-details">
            <p1>Music</p1>
            <p>122M subscribers</p>
          </div>
        </div>
        <button
          className="subscribe-button"
          onClick={() => window.open("https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ?sub_confirmation=1", "_blank")}
        >
          Subscribe
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button className={`tab ${activeTab === "home" ? "active" : "unactive"}`} onClick={() => setActiveTab("home")}>
            Home
          </button>
          <button className={`tab ${activeTab === "posts" ? "active" : "unactive"}`} onClick={() => setActiveTab("posts")}>
            Posts
          </button>
        </div>
      </div>
      <VideoSection title="Today's Biggest Hits" videos={videoList.slice(0, 10)} />
      <VideoSection title="Explore Music" videos={videoList.slice(10, 16)} />
      <VideoSection title="Popular Music Videos" videos={videoList.slice(16, 24)} />
    </div>
  );
}

export default Music;
