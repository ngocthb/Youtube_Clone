import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchVideosRequest } from "../../redux/actions/searchAction";
import { searchReset } from "../../redux/actions/searchAction";

import { Skeleton, Row, Col } from "antd";
import "./VideosList.scss";


function VideosList() {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const { searchValue } = useParams();
    const [searchTerm, setSearchTerm] = useState(searchValue);
    const [videoToken, setVideoToken] = useState("");
    const [listVideos, setListVideos] = useState([]);
    const params = {
        part: "snippet",
        q: searchValue,
        regionCode: "US",
        key: API_KEY,
        maxResults: 10,
        pageToken: videoToken || "",
    }
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { videos, loading, error } = useSelector(state => state.search)

    useEffect(() => {
        dispatch(searchVideosRequest(params));
    }, [dispatch, searchValue, videoToken]);


    const handleClickVideo = (videoId) => {
        console.log(videoId);
        dispatch(searchReset());
        navigate(`/video/${videoId}`);
    }


    // const round = (number) => {
    //     number = Number(number);
    //     if (number < 1000) return number;
    //     else if (number < 1000000) return Math.round(number / 1000) + 'K';
    //     else if (number < 1000000000) return (number / 1000000).toFixed(1) + 'M';
    //     else return Math.round(number / 1000000000) + 'B';
    // }

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

    useEffect(() => {
        if (searchTerm !== searchValue) {
            setSearchTerm(searchValue);
            setListVideos([]);
            setVideoToken("");
        }
        if (videos?.items && videos.items.length > 0 && videos.items.length < 15) {
            setListVideos((prevVideos) => [...prevVideos, ...videos.items]);
        }
    }, [videos]);


    const videoGrid = useMemo(() => {
        return listVideos?.map((video, index) => (

            <div className="videos-list__item" key={index} onClick={() => handleClickVideo(video.id.videoId)}>
                <div>
                    <img
                        className="videos-list__thumbnail"
                        src={video.snippet.thumbnails.high.url}
                        alt={video.snippet.title}
                    />
                </div>
                <div className="videos-list__details">
                    <div className="videos-list__title">{video.snippet.title}</div>
                    <div className="videos-list__meta">
                        <span className="video-views">111K Views</span>
                        <span className="video-time">{formatDate(video.snippet.publishedAt)}</span>
                    </div>
                    <div className="videos-list__channel"> <img src={video.channelThumbnail} alt={video.snippet.channelTitle} /><p >{video.snippet.channelTitle}</p></div>
                    <p className="videos-list__description">
                        {video.snippet.description}
                    </p>
                </div>
            </div>
        ))
    }, [listVideos]);

    if (loading) return <div >
        <Row gutter={[16, 16]}>
            {[...Array(12)].map((_, index) => (
                <Col key={index} xs={24}>
                    <Skeleton active paragraph={{ rows: 4 }} />
                </Col>
            ))}
        </Row>
    </div>;

    if (error) return <p>Error: {error}</p>;

    if (!listVideos.length) return <p>No videos found</p>;

    return (<>
        <div className="videos-list">

            {videoGrid}

        </div>

    </>);
}

export default VideosList;