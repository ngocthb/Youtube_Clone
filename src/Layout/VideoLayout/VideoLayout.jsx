import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import "./VideoLayout.scss";
import VideoDetails from "../../components/VideoDetails/VideoDetails";
import SuggestionVideos from "../../components/SuggestionVideos/SuggestionVideos";

function VideoLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [videoCategoryId, setVideoCategoryId] = useState(null);
    const navigate = useNavigate();
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    const handleSearchSubmit = (searchValue) => {
        if (searchValue.trim !== "") {
            navigate(`/search/${searchValue}`);

        };
    }

    const handleCategoryChange = (categoryId) => {
        setVideoCategoryId(categoryId);
    }

    return (
        <div className="video-layout">
            <Header toggleSidebar={toggleSidebar} onSearchSubmit={handleSearchSubmit} />
            <div >
                {isSidebarOpen && <Sidebar isOpen={true} className="sidebar" />}
                <main className={`mainVideo ${isSidebarOpen ? "mainVideo-layout" : ""}`}>
                    <VideoDetails categoryId={handleCategoryChange} />
                    <SuggestionVideos categoryId={videoCategoryId} />
                </main>
            </div>
        </div>
    );
}

export default VideoLayout;
