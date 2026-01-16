/** @format */

import "./Help.css";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const [response, setResponse] = useState(null);
  const [allArticles, setAllArticles] = useState(null);
 const navigate=useNavigate()
  const fetchArticles = () => {
    const queryParams = new URLSearchParams({
      limit: 3,
    });
    getApi(endPoints.getArticle(queryParams?.toString()), {
      setResponse: setAllArticles,
    });
  };

  const fetchHandler = () => {
    getApi(endPoints.getHelpCenter, {
      setResponse,
    });
  };

  useEffect(() => {
    fetchHandler();
    fetchArticles();
  }, []);

  return (
    <>
      <div className="help-container">
        <div className="help-first">
          <div className="help-first-seachbar">
            <IoSearch />
            <input type="search" name="" id="" placeholder="Search..." />
          </div>
          <div className="help-first-seachbar-btn">
            <button>Search</button>
          </div>
        </div>
        {response?.data && (
          <div className="help-second">
            {response?.data?.map((item) => (
              <div className="help-second-div" key={item?._id}>
                <div className="help-second-div-img">
                  <img src={item?.image} alt="" />
                </div>
                <div className="help-second-div-content">
                  <h6> {item?.name} </h6>
                  <p> {item?.description} </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {allArticles?.data?.docs?.length > 0 && (
          <div className="help-third">
            <h5>Popular articles</h5>
            <div className="help-third-divs">
              {allArticles?.data?.docs?.map((item) => (
                <div className="help-third-div" key={item?._id}>
                  <h6> {item?.title} </h6>
                  <p>{item?.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="help-third py-2">
          <h5>Knowledge base</h5>
          <div className="help-fouth-divs py-2">
            <div className="help-fouth-div"  onClick={()=>navigate('/getting-started')}>
              <h6>Getting Started</h6>
            </div>
            <div className="help-fouth-div">
              <h6>Rules & Policies</h6>
            </div>
            <div className="help-fouth-div">
              <h6>Community Safety</h6>
            </div>
            <div className="help-fouth-div">
              <h6>For Buyers</h6>
            </div>
            <div className="help-fouth-div">
              <h6>For Sellers</h6>
            </div>
            <div className="help-fouth-div">
              <h6>Your Account</h6>
            </div>
            <div className="help-fouth-div">
              <h6>Services & Features</h6>
            </div>
            <div className="help-fouth-div">
              <h6>Legal Resources</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
