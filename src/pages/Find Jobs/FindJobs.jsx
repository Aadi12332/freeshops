import "./FindJobs.css";
import trustImage from "../../assets/images/img52.jpg";
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { BiLoaderCircle } from "react-icons/bi";

const FindJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const serviceCategoryId = searchParams.get("category");
  const searchQueryParam = searchParams.get("search");

  const [search, setSearch] = useState(searchQueryParam || "");
  const [response, setResponse] = useState(null);
  const [allCategories, setAllCategories] = useState(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchCategories = () => {
    setIsLoadingCategories(true);
    getApi(endPoints.getServiceCategory, {
      setResponse: (data) => {
        setAllCategories(data);
        setIsLoadingCategories(false);
      },
    });
  };



  // URL params parse karne ke liye useEffect
useEffect(() => {
  const params = new URLSearchParams(location.search);
  const newSearch = params.get("search") || "";
  const newCategory = params.get("category") || null;

  setSearch(newSearch); // search state ko URL ke saath sync karo
}, [location.search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // search change ke saath hi URL update
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (serviceCategoryId) params.set("category", serviceCategoryId);

    navigate(`/jobs?${params.toString()}`);
  };

  const fetchHandler = useCallback(() => {
    const queryParams = new URLSearchParams();

    if (serviceCategoryId) {
      queryParams.append("serviceCategoryId", serviceCategoryId);
    }

    if (search) {
      queryParams.append("search", search);
    }

    queryParams.append("limit", 1000);

    setIsLoadingJobs(true);
    getApi(endPoints.getJobs(queryParams.toString()), {
      setResponse: (data) => {
        setResponse(data);
        setIsLoadingJobs(false);
      },
    });
  }, [serviceCategoryId, search]);

  useEffect(() => {
    fetchHandler();
  }, [fetchHandler]);

  return (
    <>
      <div className="container">
        <div className="blog-top">
          <div className="blog-top-left">
            <div className="blog-top-left-top">
              <span>HOW IT WORKS</span>
            </div>
            <h1 className="d-none d-lg-block d-md-block">See Jobs Available for You</h1>
            <p className="d-block d-lg-none">See Jobs Available for You</p>
            <p>
              Freeshoppsps is the simplest, most trusted way to find jobs locally
            </p>
          </div>
          <div className="blog-top-right">
            <img src={trustImage} alt="" />
          </div>
        </div>

        <div className="findjob-container">
          {/* Desktop Search */}
          <div className="d-lg-block d-none">
            <div className="help-first">
              <div className="help-first-seachbar">
                <IoSearch />
                <input
                  type="search"
                  onChange={handleSearchChange}
                  value={search}
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="container d-block d-lg-none">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8">
                <div className="input-group ">
                  <span className="input-group-text">
                    <IoSearch />
                  </span>
                  <input
                    type="search"
                    onChange={handleSearchChange}
                    value={search}
                    placeholder="Search..."
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="productlist-subcategory">
            {isLoadingCategories ? (
               <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh", // full viewport height
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
            ) : (
              allCategories?.data?.map((item) => {
                const params = new URLSearchParams();
                params.set("category", item?._id);
                if (search) params.set("search", search);
                return (
                  <div
                    className="productlist-subcategory-div"
                    key={item?._id}
                    onClick={() => navigate(`/jobs?${params.toString()}`)}
                    style={{
                      background:
                        serviceCategoryId === item?._id ? "#ffe9c9" : "#fff",
                      border:
                        serviceCategoryId === item?._id
                          ? "1px solid #f9b042"
                          : "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    <p>{item?.name}</p>
                  </div>
                );
              })
            )}
          </div>

          {/* Jobs */}
          <div className="findjob-jobs">
            <div className="findjob-jobs-div">
              {isLoadingJobs ? (
                  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh", // full viewport height
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
              ) : !response ||
                !response.data ||
                !response.data.docs ||
                response.data.docs.length === 0 ? (
                <div className="no-jobs-found">
                  <p>No jobs found. Try adjusting your search criteria.</p>
                </div>
              ) : (
                response?.data?.docs?.map((item) => (
                  <Link
                    to={`/jobs/${item?._id}`}
                    key={item?._id}
                    className="link"
                  >
                    <div className="findjob-job">
                      <div className="findjob-job-image">
                        <img src={item?.image} alt="" />
                      </div>
                      <div className="findjob-job-right">
                        <div className="findjob-job-right-btn">
                          <h6>{item?.typeOfJob}</h6>
                        </div>
                        <h4>{item?.title}</h4>
                        <p>${item?.salary}</p>
                        <h5>{item?.storage}</h5>
                        <h5>
                          {item?.createdAt?.slice(0, 10)}, {item?.location}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FindJobs;
