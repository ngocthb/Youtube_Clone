import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideosRequest } from '../../redux/actions/videoAction';


import './VideoDetails.scss';

function VideoDetails({ categoryId }) {

    const { videoId } = useParams();
    const { videos, loading, error } = useSelector((state) => state.video);
    const dispatch = useDispatch();

    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

    useEffect(() => {
        const params = {
            part: 'snippet,statistics',
            key: API_KEY,
            id: videoId,
        };
        dispatch(fetchVideosRequest(params));

    }, [videoId, dispatch]);


    useEffect(() => {
        if (videos?.items?.length) {
            categoryId(videos?.items[0]?.snippet?.categoryId);
        }
    }, [videos]);




    const round = (number) => {
        number = Number(number);
        if (number < 1000) return number;
        else if (number < 1000000) return Math.round(number / 1000) + 'K';
        else if (number < 1000000000) return (number / 1000000).toFixed(1) + 'M';
        else return Math.round(number / 1000000000) + 'B';
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!videos?.items?.length) return <div>No videos found</div>;

    return (

        <div className="video-details">
            <img
                className="video-details__thumbnail"
                src={videos?.items[0]?.snippet?.thumbnails?.maxres?.url}
                alt={videos?.items[0]?.snippet?.title}
            />
            <div className="video-details__title">{videos?.items[0]?.snippet?.title}</div>
            <div className="video-details__info">
                <div className="video-details__channel">
                    <img
                        className="video-details__channel-avatar"
                        src={videos?.items[0]?.channelThumbnail}
                        alt={videos?.items[0]?.snippet?.channelTitle}
                    />
                    <div className="video-details__channel-details">
                        <div className="video-details__channel-name">{videos?.items[0]?.snippet?.channelTitle}</div>
                        <div className="video-details__views">{round(videos?.items[0]?.statistics.viewCount)} subscribers</div>
                    </div>
                    <button className="video-details__channel-btn">Subscribe</button>
                </div>

                <div className="video-details__actions">
                    <div className="video-details__likes">
                        <button className="video-details__likes-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z" />
                            </svg>
                            {round(videos?.items[0]?.statistics.likeCount)}
                        </button>
                        <button className="video-details__dislike-btn">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z" />
                            </svg>
                        </button>
                    </div>
                    <button className="video-details__actions-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                        </svg>
                        Share
                    </button>
                    <button className="video-details__actions-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                        </svg>
                        Download
                    </button>
                    <button className="video-details__actions-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>


    );
}

export default VideoDetails;
