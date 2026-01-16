/** @format */
import "./Careers.css";
import { IoMdArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
// Assuming getApi might still be used for fetchBanner or elsewhere.
// If not, you can remove this import.
import { getApi } from "../../Repository/Api";
import image1 from '../../assets/1.jpg'
const Careers = () => {
  const [banner, setBanner] = useState(null);
  const [careerOpening, setCareerOpening] = useState(null);

  // Modified fetchOpening to use fetch API directly
  const fetchOpening = async () => {
    try {
      const response = await fetch(
        "https://mamun-reza-freeshops-backend-omega.vercel.app/api/v1/admin/allCareerOpening"
      );
      if (!response.ok) {
        // Handle HTTP errors (e.g., 404, 500)
        console.error(
          "Failed to fetch career openings:",
          response.status,
          response.statusText
        );
        // Optionally set careerOpening to an error state or null to reflect the error in the UI
        setCareerOpening(null); // Or an object like { error: true, message: 'Failed to load openings' }
        return;
      }
      const data = await response.json();
      setCareerOpening(data); // Update state with the fetched data
    } catch (error) {
      // Handle network errors or errors during JSON parsing
      console.error("Error fetching career openings:", error);
      // Optionally set careerOpening to an error state or null
      setCareerOpening(null); // Or an object like { error: true, message: 'Network error' }
    }
  };

  const fetchBanner = () => {
    // Assuming endPoints.career.getBanner is still valid and defined in your apiConfig
    // or that getApi is configured to handle this.
    // For this example, I'm assuming your `endPoints` object is still used for the banner,
    // and getApi is the utility to fetch it.
    // If `apiConfig.js` is entirely removed, you'd need to provide the banner URL directly too
    // and potentially convert this to a direct fetch as well.
    const endPoints = {
        career: {
            // Replace with your actual banner endpoint if it's not in a central config
            getBanner: "YOUR_BANNER_API_ENDPOINT_HERE"
        }
    };

    if (endPoints.career.getBanner === "YOUR_BANNER_API_ENDPOINT_HERE") {
        console.warn("Banner API endpoint is not configured. Banner will not be fetched. Update 'YOUR_BANNER_API_ENDPOINT_HERE'.");
        // Optionally, set banner to null or an empty state if the endpoint is a placeholder
        setBanner(null);
    } else {
        // Assuming getApi is still the utility for fetching the banner
        getApi(endPoints.career.getBanner, {
          setResponse: setBanner,
        });
    }
  };

  useEffect(() => {
    fetchBanner();
    fetchOpening();
  }, []);

  // Adapt the API response structure (careerOpening.data.docs)
  // to the structure expected by the existing UI rendering logic.
  const allAvailableJobs = careerOpening?.data?.docs;

  // We'll assume all jobs from the API are "Full Time" and group them
  // under a single, fabricated category to fit the UI.
  const fullTimeJobs = allAvailableJobs?.length
    ? [
        {
          category: { title: "Current Openings", type: "Full Time" },
          career: allAvailableJobs,
        },
      ]
    : [];

  // For contract jobs, since the API data (careerOpening.data.docs)
  // doesn't have a 'category.type' to distinguish, we'll assume none for now.
  const contractJobs = [];

  return (
    <div className="careers-parent-container">
      <div className="container trust-container">
        {/* {banner && ( */}
          <div className="trust-top">
            <div className="trust-top-left">
              {/* <h1> {banner?.data?.[0]?.title} </h1> */}
                            <h1> Make your next great
career move </h1>

              {/* <p>{banner?.data?.[0]?.description}</p> */}
                            <p>Grow with us, and build a thriving marketplace
that helps millions of people create the life
they're looking for</p>

            </div>
            <div className="trust-top-right">
              {/* <img src={banner?.data?.[0]?.image} alt={banner?.data?.[0]?.title || "Banner"} /> */}
                            <img src={image1} alt={banner?.data?.[0]?.title || "Banner"} />

            </div>
          </div>
        {/* )} */}

        <div className="careers-second">
          <h5>Full Time Openings</h5>
          {fullTimeJobs?.map((item, index) => (
            <div className="careers-third" key={`full_time_${item?.category?.title}_${index}`}> {/* Improved key */}
              <div className="careers-third-left">
                <h4> software developer </h4>
              </div>
              <div className="careers-third-right">
                {item?.career?.map((job) => (
                  <div className="careers-third-right-div" key={job?._id}>
                    <div className="careers-third-right-div-left">
                      <h6>{job?.title}</h6>
                      <span> {job?.location} </span>
                    </div>
                    <p>
                      View Job <IoMdArrowForward />{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {/* Display a message if there are no full-time jobs after attempting to load */}
          {careerOpening && !fullTimeJobs?.length && (
            <p className="no-openings-message">No full-time openings available at the moment.</p>
          )}
        </div>

        <div className="careers-second">
          <h5>Contract base Opening</h5>
          {contractJobs?.map((item, index) => (
            <div className="careers-third" key={`contract_job_${item?.category?.title}_${index}`}> {/* Improved key */}
              <div className="careers-third-left">
                <h4> {item?.category?.title} </h4>
              </div>
              <div className="careers-third-right">
                {item?.career?.map((job) => (
                  <div className="careers-third-right-div" key={job?._id}>
                    <div className="careers-third-right-div-left">
                      <h6>{job?.title}</h6>
                      <span> {job?.location} </span>
                    </div>
                    <p>
                      View Job <IoMdArrowForward />{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
           {/* Display a message if there are no contract jobs */}
           {careerOpening && !contractJobs?.length && (
            <p className="no-openings-message">No contract openings available at the moment.</p>
          )}
        </div>

        <div className="careers-fourth"></div>
      </div>
    </div>
  );
};

export default Careers;
