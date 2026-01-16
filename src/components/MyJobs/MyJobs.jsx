// MyJobs.jsx
import React, { useCallback, useEffect, useState } from "react";
import { BiBuilding, BiMap, BiTime, BiMoney } from "react-icons/bi";
import "./MyJobs.css";
import { useNavigate } from "react-router-dom";
import endPoints from "../../Repository/apiConfig";
import { getApi } from "../../Repository/Api";

const MyJobs = () => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "active":
        return "status-active";
      case "closed":
        return "status-closed";
      default:
        return "status-default";
    }
  };

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const fetchMyJobs = useCallback(() => {
    setIsLoading(true);
    getApi(endPoints.getMyJobs(), {
      setResponse: (data) => {
        setJobs(data.data.docs);
        setIsLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  // --- Inline CSS Loader ---
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px"
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #4caf50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  };

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h2>My Jobs</h2>
        <button onClick={() => navigate("/post-job")} className="post-job-btn">
          Post New Job
        </button>
      </div>

      <div className="jobs-grid">
        {isLoading ? (
          <div style={loaderStyle}>
            <div style={spinnerStyle}></div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-image-container">
                <img src={job.image} alt={job.title} />
                <span className={`status-badge ${getStatusClass(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="job-content">
                <h3 className="job-title">{job.title}</h3>

                <div className="job-details">
                  <div className="detail-item">
                    <BiBuilding className="detail-icon" />
                    <span>{job.serviceCategoryId.name}</span>
                  </div>

                  <div className="detail-item">
                    <BiMap className="detail-icon" />
                    <span>{job.location}</span>
                  </div>

                  <div className="detail-item">
                    <BiTime className="detail-icon" />
                    <span>{job.typeOfJob}</span>
                  </div>

                  <div className="detail-item">
                    <BiMoney className="detail-icon" />
                    <span>${job.salary}/hr</span>
                  </div>
                </div>

                <div className="job-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                  >
                    Edit
                  </button>
                  <button
                  
                                      onClick={() => navigate(`/edit-job/${job._id}`)}

                  className="view-btn">View Details</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "50px", fontStyle: "italic", color: "#666" }}>
            No Jobs Found
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
