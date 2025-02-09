import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import "./DefaultLayout.scss";
import Carousel from "../../components/Carousel/Carousel";



function DefaultLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleSearchSubmit = (searchValue) => {
    if (searchValue.trim !== "") {

      navigate(`/search/${searchValue}`);

    };
  }



  return (
    <div className="default-layout">
      <Header toggleSidebar={toggleSidebar} onSearchSubmit={handleSearchSubmit} />

      <div className="main-layout">

        <Sidebar isOpen={isSidebarOpen} />
        <main className={isSidebarOpen ? "content-open" : "content-closed"}>
          {/* Bao lam */}
          {location.pathname !== "/News" && <Carousel />}

          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DefaultLayout;
