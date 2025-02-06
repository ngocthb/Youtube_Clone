import React, { useState } from "react";
import "./Carousel.scss";

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const content = [
        "music", "movie", "game", "sport", "news", "tech", "food", "travel", "fashion", "comedy", "music", "movie", "game", "sport", "news", "tech", "food", "travel", "fashion", "comedy"

    ];

    const totalItems = content.length;

    const goToPrev = () => {
        setCurrentIndex(currentIndex === 0 ? totalItems - 1 : currentIndex - 1);
    };

    const goToNext = () => {
        setCurrentIndex(currentIndex === totalItems - 1 ? 0 : currentIndex + 1);
    };

    return (

        <div className="carousel">
            {currentIndex !== 0 && <button className="carousel-btn" onClick={goToPrev}>{"<"}</button>}
            <div className="carousel-container">
                <div className="carousel-wrapper" style={{ transform: `translateX(-${currentIndex * 270}px)` }}>
                    {content.map((item, index) => (
                        <div className="carousel-item" key={index}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>


            {currentIndex !== totalItems - 14 && <button className="carousel-btn" onClick={goToNext}>{">"}</button>}
        </div>
    );
};

export default Carousel;
