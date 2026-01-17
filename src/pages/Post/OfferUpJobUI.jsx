import React from "react";
import { FaCheck } from "react-icons/fa6";
import hireimage from "../../assets/images/hireimage.png";
export default function OfferUpJobUI() {
  const handlePostJob = () => {
    alert("Post a Job clicked!");
  };

  const handleLearnMore = () => {
    alert("Learn More clicked!");
  };

  return (
    <div className="container">
      <div className="rounded mx-auto w-full">
        <h1 className="text-center text-dark mb-4 fs-3">
          Find your next hire on <br />
          <span className="text-danger fw-bold">Freeshoppss</span>
        </h1>
        <div className="flex items-start gap-3">
          <FaCheck color="green" size={30} className="min-w-[30px]" />
          <div className="mb-4">
            <h5 className="text-dark mb-2">Expand your reach</h5>
            <p className="text-muted mb-0">
              Reach millions of candidates every month in our dedicated jobs
              feed
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FaCheck color="green" size={30} className="min-w-[30px]" />
        <div className="mb-4">
          <h5 className="text-dark mb-2">Access local candidates</h5>
          <p className="text-muted mb-0">
            Target job seekers through our mobile app and website
          </p>
        </div>
        </div>
        <div className="flex items-start gap-3">
          <FaCheck color="green" size={30} className="min-w-[30px]" />
        <div className="mb-4">
          <h5 className="text-dark mb-2">Introductory pricing</h5>
          <p className="text-muted mb-2">
            Get high value with a 30-day job listing for
          </p>
          {/* Optional Price Block
          <div className="fs-3 fw-bold text-success">
            $25
          </div> */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <img src={hireimage} alt="" className="max-w-[300px]" />
      </div>
    </div>
  );
}
