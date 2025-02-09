// src/components/Trending/Trending.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingVideosRequest } from '../../redux/actions/videoAction';
import './Trending.scss';

// Hàm format lượt xem
const formatViewCount = (viewCount) => {
    if (!viewCount) return '0 lượt xem';
    
    const num = parseInt(viewCount);
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(1)}B lượt xem`;
    }
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M lượt xem`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K lượt xem`;
    }
    return `${num} lượt xem`;
};

// Hàm format thời gian
const formatTimeAgo = (publishedAt) => {
    if (!publishedAt) return '';

    const now = new Date();
    const published = new Date(publishedAt);
    const secondsAgo = Math.floor((now - published) / 1000);

    if (secondsAgo < 60) {
        return 'vừa xong';
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} phút trước`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} giờ trước`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) {
        return `${daysAgo} ngày trước`;
    }

    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) {
        return `${weeksAgo} tuần trước`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} tháng trước`;
    }

    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo} năm trước`;
};

function Trending() {
    const dispatch = useDispatch();
    const { trendingVideos, loading, error } = useSelector(state => state.video);
    const [pageToken, setPageToken] = useState('');

    useEffect(() => {
        dispatch(fetchTrendingVideosRequest());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
                if (trendingVideos?.nextPageToken && !loading) {
                    setPageToken(trendingVideos.nextPageToken);
                    dispatch(fetchTrendingVideosRequest({ pageToken: trendingVideos.nextPageToken }));
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [trendingVideos, loading, dispatch]);

    if (loading && !trendingVideos?.items?.length) {
        return <div className="loading">Loading...</div>;
    }
    
    if (error) return <div className="error">Error: {error}</div>;

    if (!Array.isArray(trendingVideos?.items)) {
        return <div>Error: trendingVideos is not an array</div>;
    }

    return (
        <div className="trending">
            <div className="trending__header">
                <div className="trending__logo">
                    <img src="https://www.youtube.com/img/trending/avatar/trending_animated.webp" alt="Trending" />
                    <h2>Thịnh hành</h2>
                </div>
                <div className="trending__tabs">
                    <button className="active">Mới nhất</button>
                    <button>Âm nhạc</button>
                    <button>Trò chơi</button>
                    <button>Phim ảnh</button>
                </div>
            </div>
            <div className="trending__videos">
                {trendingVideos.items.map(video => (
                    <div key={video.id} className="trending__video-card">
                        <div className="trending__thumbnail-container">
                            <img 
                                className="trending__thumbnail" 
                                src={video.snippet.thumbnails.high.url} 
                                alt={video.snippet.title} 
                            />
                            <span className="trending__duration">5:01</span>
                        </div>
                        <div className="trending__info">
                            <h3 className="trending__video-title">{video.snippet.title}</h3>
                            <div className="trending__meta">
                                <p className="trending__channel">
                                    {video.snippet.channelTitle}
                                    <span className="trending__verified">✓</span>
                                </p>
                                <p className="trending__stats">
                                    <span>{formatViewCount(video.statistics.viewCount)}</span>
                                    <span className="trending__dot">•</span>
                                    <span>{formatTimeAgo(video.snippet.publishedAt)}</span>
                                </p>
                                <p className="trending__description">{video.snippet.description}</p>
                            </div>
                        </div>
                        <button className="trending__more-btn">
                            <i className="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                ))}
                {loading && <div className="loading">Loading more...</div>}
            </div>
        </div>
    );
}

export default Trending;