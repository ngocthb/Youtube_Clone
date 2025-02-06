import { useDispatch, useSelector } from "react-redux";
import "./SuggestionVideos.scss";
import { useEffect } from "react";
import { searchVideosRequest } from "../../redux/actions/searchAction";
import { Skeleton, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { resetVideos } from "../../redux/actions/videoAction";

function SuggestionVideos({ categoryId }) {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { videos, loading, error } = useSelector((state) => state.search);
    const params = {
        part: 'snippet',
        type: 'video',
        regionCode: 'US',
        maxResults: "15",
        videoCategoryId: categoryId,
        key: API_KEY,

    }

    useEffect(() => {
        if (categoryId) {
            dispatch(searchVideosRequest(params));
        }
    }
        , [dispatch, categoryId]);



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

    if (loading) return <div><Row gutter={[16, 16]}>
        {[...Array(5)].map((_, index) => (
            <Col key={index} xs={24} >
                <Skeleton active paragraph={{ rows: 4 }} />
            </Col>
        ))}
    </Row></div>;
    if (error) return <div>Error: {error}</div>;
    if (!videos?.items?.length) return <div>No videos found</div>;

    return (
        <div>
            {videos?.items?.map((video) => (<div className="suggestion-video" key={video.id.videoId} onClick={() => handleClickVideo(video.id.videoId)}>
                <img
                    className="suggestion-video__thumbnail"
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                />
                <div>
                    <div className="suggestion-video__title">{video.snippet.title}</div>
                    <div className="suggestion-video__info">
                        <div className="suggestion-video__channel-name">{video.snippet.channelTitle
                        }</div>
                        <div className="suggestion-video__channel-details">
                            <div>1M views</div>
                            <div>{formatDate(video.snippet.publishedAt)}</div>
                        </div>
                    </div>
                </div>
            </div>))}
        </div>
    );
}

export default SuggestionVideos;
