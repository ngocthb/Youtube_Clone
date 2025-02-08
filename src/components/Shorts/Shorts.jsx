import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton, Row, Col } from "antd";
import { searchVideosRequest } from "../../redux/actions/searchAction";

export default function Shorts() {
    const videoRefs = useRef({});
    const [hoveredVideoId, setHoveredVideoId] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    const [videoToken, setVideoToken] = useState("");
    const params = {
        part: "snippet",
        regionCode: "US",
        key: API_KEY,
        maxResults: 20,
        pageToken: videoToken || "",
        videoDuration: "short",
        type: "video",
    }
    const dispatch = useDispatch();
    const { videos, loading, error } = useSelector(state => state.search)

    useEffect(() => {
        dispatch(searchVideosRequest(params));
    }, [dispatch, videoToken]);


    const handleVideoPlayPause = (videoId) => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
            if (playingVideoId === videoId) {
                videoElement.pause();
                setPlayingVideoId(null);
            } else {
                if (playingVideoId) {
                    const activeVideo = videoRefs.current[playingVideoId];
                    if (activeVideo) activeVideo.pause();
                }
                videoElement.play();
                setPlayingVideoId(videoId);
            }
        }
    };

    const handleVolumeChange = (e, videoId) => {
        const volumeValue = parseFloat(e.target.value);
        setVolume(volumeValue);
        const videoElement = document.getElementById(`video-${videoId}`);
        if (videoElement) {
            videoElement.volume = volumeValue;
        }
    };



    const renderVolumeIcon = () => {
        if (volume === 0) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" fill="white"><path d="M21 12c0 4.08-3.05 7.44-7 7.93v-2.02c2.83-.48 5-2.94 5-5.91s-2.17-5.43-5-5.91V4.07c3.95.49 7 3.85 7 7.93zM3 9v6h3.16L12 19.93V4.07L6.16 9H3zm11-1.38v2.09c.88.39 1.5 1.27 1.5 2.29s-.62 1.9-1.5 2.29v2.09c2-.46 3.5-2.24 3.5-4.38S16 8.08 14 7.62z"></path></svg>
            );
        } else if (volume < 0.5) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" fill="white"><path d="M17.5 12c0 2.14-1.5 3.92-3.5 4.38v-2.09c.88-.39 1.5-1.27 1.5-2.29s-.62-1.9-1.5-2.29V7.62c2 .46 3.5 2.24 3.5 4.38zM3 9v6h3.16L12 19.93V4.07L6.16 9H3z"></path></svg>
            );
        } else {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" fill="white"><path d="M14 9.71V7.62c2 .46 3.5 2.24 3.5 4.38 0 .58-.13 1.13-.33 1.64l-1.67-1.67c-.02-1.01-.63-1.88-1.5-2.26zM19 12c0 1-.26 1.94-.7 2.77l1.47 1.47C20.54 15.01 21 13.56 21 12c0-4.08-3.05-7.44-7-7.93v2.02c2.83.48 5 2.94 5 5.91zM3.15 3.85l4.17 4.17L6.16 9H3v6h3.16L12 19.93v-7.22l2 2v1.67c.43-.1.83-.27 1.2-.48l1.09 1.09c-.68.45-1.45.78-2.28.92v2.02c1.39-.17 2.66-.71 3.73-1.49l2.42 2.42.71-.71-17-17-.72.7zm8.85.22L9.62 6.08 12 8.46V4.07z"></path></svg>
            );
        }
    };

    const renderPlayPauseIcon = (isPlaying) => {
        if (isPlaying) {
            return (
                <svg width="24" height="24" fill="white">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                </svg>
            );
        } else {
            return (
                <svg width="24" height="24" fill="white">
                    <path d="M8 5v14l11-7z"></path>
                </svg>
            );
        }
    };



    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-1/3">

                <Skeleton active paragraph={{ rows: 20 }} />

            </div>
        </div>
    );


    if (error) return <div>Error: {error}</div>;


    console.log(videos.items)
    return (
        <div
        >
            {(videos?.items || []).map((item) => (
                <div
                    key={item.id.videoId}
                    className="grid grid-cols-1 h-[88vh]"

                >
                    <div className="flex justify-center items-center">
                        <div className="relative flex flex-col items-center justify-end py-5 w-full max-w-[400px] h-[600px] " onMouseEnter={() => setHoveredVideoId(item.id.videoId)}
                            onMouseLeave={() => setHoveredVideoId(null)}>

                            {/* <iframe
                                className="absolute inset-0 object-cover w-full h-full z-0 rounded-lg"
                                id={`video-${item.id.videoId}`}
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${item.id.videoId}?autoplay=0&controls=0`}
                                title={item.snippet.title}
                                allowFullScreen
                            /> */}

                            <img
                                ref={(el) => (videoRefs.current[item.id.videoId] = el)}

                                src={item.snippet.thumbnails.high.url}
                                className="absolute inset-0 object-cover w-full h-full z-0 rounded-lg max-w-full max-h-full"
                                alt={item.snippet.title}
                            />

                            {hoveredVideoId === item.id.videoId && (
                                <><div className="absolute top-3 left-3 z-30 flex items-center gap-3 ">
                                    <button
                                        className="text-white bg-[#606060] p-3 rounded-full cursor-pointer"
                                        onClick={() => handleVideoPlayPause(item.id.videoId)}
                                    >
                                        {renderPlayPauseIcon(playingVideoId === item.id.videoId)}
                                    </button>
                                    <div className="flex text-white bg-[#606060] p-3 rounded-full cursor-pointer">
                                        {renderVolumeIcon()}
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={volume}
                                            onChange={(e) => handleVolumeChange(e, item.id.videoId)}
                                            className="w-24 mx-2 "
                                        />

                                    </div>
                                </div>
                                    <div className="absolute top-3 right-3 z-30">
                                        <button
                                            className="text-white bg-[#606060]  bg-opacity-50 p-3 rounded-full cursor-pointer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" fill="white" focusable="false" ><path d="M5 9H4V4h5v1H5v4zm15-5h-5v1h4v4h1V4zm0 11h-1v4h-4v1h5v-5zM9 19H5v-4H4v5h5v-1z"></path></svg>
                                        </button>
                                    </div></>
                            )}

                            <div className="relative z-20 flex flex-col items-start w-full px-4">
                                <div className="flex items-center gap-2">
                                    <img
                                        className="w-8 h-8 object-cover rounded-full"
                                        src={item.channelThumbnail}
                                        alt="avatar" />
                                    <h2 className="font-medium text-white text-left">
                                        {item.snippet.channelTitle}

                                    </h2>
                                    <button className="bg-gray-100 text-black rounded-full p-3 text-xs font-semibold">
                                        Subscribes
                                    </button>

                                </div>


                                <h4 className="text-white text-left mt-2">
                                    {item.snippet.title}
                                </h4>

                                <h4 className="text-white w-full text-left mt-2 truncate overflow-hidden whitespace-nowrap">🎵 {item.snippet.description}</h4>

                            </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-center h-full justify-end py-5 px-5 text-xs  font-medium">

                            <button className="text-2xl bg-gray-100 rounded-full p-3 mt-2 cursor-pointer hover:bg-gray-200 ">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" ><path d="M8 21V9.282c0-.834.26-1.647.745-2.325L13 1l.551.331c1.153.691 1.705 2.065 1.351 3.362L14 8h5.192c.827 0 1.609.376 2.125 1.022.711.888.795 2.125.209 3.101L21 13l.165.413c.519 1.296.324 2.769-.514 3.885l-.151.202v.5c0 1.657-1.343 3-3 3H8ZM4.5 9C3.672 9 3 9.672 3 10.5v9c0 .828.672 1.5 1.5 1.5H7V9H4.5Z"></path></svg>

                            </button>
                            Like
                            <button className="text-black text-2xl bg-gray-100 rounded-full p-3 mt-2 cursor-pointer hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" ><path d="M16 3v11.718c0 .834-.26 1.647-.745 2.325L11 23l-.551-.331c-1.153-.691-1.705-2.065-1.351-3.362L10 16H4.808c-.827 0-1.609-.376-2.125-1.022-.711-.888-.795-2.125-.209-3.101L3 11l-.165-.413c-.519-1.296-.324-2.769.514-3.885L3.5 6.5V6c0-1.657 1.343-3 3-3H16Zm3 12c1.105 0 2-.895 2-2V5c0-1.105-.895-2-2-2h-2v12h2Z"></path></svg>
                            </button>
                            Dislike
                            <button className="text-black text-2xl bg-gray-100 rounded-full p-3 mt-2 cursor-pointer hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" ><path d="M21 5c0-1.105-.895-2-2-2H5c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h12l3.146 3.146c.315.315.854.092.854-.353V5ZM7 9c0-.552.448-1 1-1h8c.552 0 1 .448 1 1s-.448 1-1 1H8c-.552 0-1-.448-1-1Zm1 3c-.552 0-1 .448-1 1s.448 1 1 1h5c.552 0 1-.448 1-1s-.448-1-1-1H8Z" fill-rule="evenodd"></path></svg>
                            </button>
                            {item.comments_count}
                            <button className="text-black text-2xl bg-gray-100 rounded-full p-3 mt-2 cursor-pointer hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" ><path d="m13.202 3.368 9.438 7.865c.48.4.48 1.137 0 1.537l-9.438 7.865c-.652.543-1.64.08-1.64-.768V16H9.957c-2.778 0-5.406 1.263-7.141 3.432-.304.38-.912.086-.803-.388l1.118-4.843C3.968 10.572 7.2 8 10.926 8h.636V4.137c0-.848.989-1.311 1.64-.769Z"></path></svg>
                            </button>
                            Share
                            <button className="text-black text-2xl bg-gray-100 rounded-full p-3 mt-2 cursor-pointer hover:bg-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" ><path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path></svg>
                            </button>


                            <div className="relative flex flex-col items-center mt-4">
                                <img
                                    className="w-12 h-12 object-cover rounded-lg"
                                    src={item.channelThumbnail}
                                    alt="Avatar"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}