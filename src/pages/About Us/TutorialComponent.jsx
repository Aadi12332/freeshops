/** @format */
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // lucide-react icons
import "./Tutorial.css";

const tutorialVideos = [
  {
    title: "Lets build a better community",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "How to post any product ?",
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "Why share something ?",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    title: "Why Freeshopps ?",
    url: "https://www.w3schools.com/html/movie.mp4",
  },
  {
    title: "How to request an available product ?",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
  },
];

const TutorialComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleVideo = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Header Banner */}
      <div className="tutorial-header-banner">
        <h1>Tutorial Videos</h1>
        <div className="banner-bg-layer layer-1"></div>
        <div className="banner-bg-layer layer-2"></div>
        <div className="banner-bg-layer layer-3"></div>
      </div>

      {/* Container */}
      <div className="tutorial-container">
        {tutorialVideos.map((video, index) => (
          <div key={index} className="tutorial-item">
            <div className="tutorial-title" onClick={() => toggleVideo(index)}>
              <span>{video.title}</span>
              <span className="arrow-icon">
                {activeIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>
            {activeIndex === index && (
              <div className="tutorial-video">
                <video controls>
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TutorialComponent;
