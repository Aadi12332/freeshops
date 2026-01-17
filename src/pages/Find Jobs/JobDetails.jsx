/** @format */

import "./FindJobs.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getApi, postApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import Swal from "sweetalert2";

const JobDetails = ({jobId}) => {
  const { id:paramId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [response, setResponse] = useState(null);
  const [similarJobs, setSimilarJobs] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
const id = jobId || paramId;
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchSimilarJobs = () => {
    const queryParams = new URLSearchParams({ limit: 1000 });
    getApi(endPoints.getJobs(queryParams.toString()), {
      setResponse: setSimilarJobs,
    });
  };

  const fetchHandler = useCallback(() => {
    setIsLoading(true);
    getApi(endPoints.getJobDetail(id), {
      setResponse,
      additionalFunctions: [() => setIsLoading(false)],
    });
  }, [id]);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  useEffect(() => {
    fetchSimilarJobs();
  }, []);

  const handleApply = (id) => {
    const token = localStorage.getItem("token");

if (!token) {
  Swal.fire({
    icon: "warning",
    title: "Login Required",
    text: "Please login to apply for this job.",
  });
  return;
}


    setIsApplying(true);
    postApi(
      endPoints.applyToJob(id),
      {},
      {
        additionalFunctions: [
          () => {
            setIsApplying(false);
            setShowModal(true);
          },
        ],
      }
    );
  };

  return (
    <>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="blog-container">
           {!jobId&& <div className="press-top">
              <h1>Job Details</h1>
            </div>}
            <div className="findjob-container !mt-0">
              <div className="findjob-jobs-div !mt-0 border rounded-2xl !p-[16px]">
                <div className="findjob-job !p-0 !border-0 hover:!shadow-none hover:!transform-none !flex-col">
                  <div className="findjob-job-image !w-full">
                    <img src={response?.data?.image} alt="" />
                  </div>
                  <div className="findjob-job-right">
                    <div className="findjob-job-right-btn">
                      <h6> {response?.data?.typeOfJob} </h6>
                    </div>
                    <h4> {response?.data?.title} </h4>
                    <p>${response?.data?.salary} </p>
                    <h5> {response?.data?.storage} </h5>
                    <h5>{response?.data?.createdAt?.slice(0, 10)}</h5>
                  </div>
                </div>
                <div className="jobdetails-container">
                  <div className="jobdetails-first !border-0 !gap-3">
                    <div className="jobdetails-first-img !w-16 !h-16"></div>
                    <div className="jobdetails-first-right">
                      <h6> {response?.data?.userId?.fullName} </h6>
                      <p className="!mt-0">Employer</p>
                    </div>
                  </div>

                  <div className="jobdetails-second">
                    <h6 className="!mb-0">Description</h6>
                    <div className="jobdetails-second-divs">
                      <p className=""
                        dangerouslySetInnerHTML={{
                          __html: response?.data?.description,
                        }}
                      />
                    </div>
                  </div>

                  <div className="jobdetails-first !border-0">
                    <div className="jobdetails-first-img !w-16 !h-16"></div>
                    <div className="jobdetails-first-right">
                      <h6>Report Job Post</h6>
                    </div>
                  </div>

                  <div className="jobdetails-btn">
                    <button
                      onClick={() => handleApply(response.data._id)}
                      disabled={isApplying}
                    >
                      {isApplying ? "Applying..." : "Apply Now"}
                    </button>
                  </div>
                </div>

                {!jobId&&similarJobs?.data?.docs?.filter((i) => i?._id !== id)?.length >
                  0 && (
                  <div className="findjob-jobs">
                    <div className="jobdetails-jobs-head">
                      <h5>Similar Posts</h5>
                    </div>
                    <div className="findjob-jobs-div">
                      {similarJobs?.data?.docs
                        ?.filter((i) => i?._id !== id)
                        ?.map((item) => (
                          <Link
                            to={`/jobs/${item?._id}`}
                            className="link"
                            key={item?._id}
                          >
                            <div className="findjob-job">
                              <div className="findjob-job-image">
                                <img src={item?.image} alt={item?.title} />
                              </div>
                              <div className="findjob-job-right">
                                <div className="findjob-job-right-btn">
                                  <h6>{item?.typeOfJob}</h6>
                                </div>
                                <h4>{item?.title}</h4>
                                <p> ${item?.salary}</p>
                                <h5>{item?.storage}</h5>
                                <h5>
                                  {item?.createdAt?.slice(0, 10)} ,{" "}
                                  {item?.location}
                                </h5>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          <SuccessModal
            message="Successfully applied"
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              navigate(-1);
            }}
          />
        </>
      )}
    </>
  );
};

export default JobDetails;
