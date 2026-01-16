/** @format */

import "./AboutUs.css";
import { useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";

const AboutUs = () => {
  const [response, setResponse] = useState(null);
  const [item, setItem] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [news, setNews] = useState(null);

  const fetchHandler = () => {
    getApi(endPoints.how_It_Works, {
      setResponse,
    });
    getApi(endPoints.aboutUs.blogs, {
      setResponse: setBlogs,
    });
    getApi(endPoints.allFreeShopNews, {
      setResponse: setNews,
    });
  };

  useEffect(() => {
    fetchHandler();
  }, []);
console.log(item,"-------")
  useEffect(() => {
    if (response) {
      setItem(response?.data?.[0]);
    }
  }, [response]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="container-fluid px-lg-0 about-us-container">
        <div className="about-us-top position-relative">
          <img src={item?.image} alt="Family" className="background-image" />
          <div className="container aboutus_tag">
            <h1>About Us</h1>
          </div>
        </div>
        <div className="about-us-second">
          <h5>{item?.title}</h5>
          <p>{item?.description}</p>
        </div>
        <div className="about-us-third">
          {item?.counts?.map((item, index) => (
            <div className="about-us-third-div" key={`counts${index}`}>
              <h6> {item?.description} </h6>
              <p> {item?.name} </p>
            </div>
          ))}
        </div>

        {blogs?.data?.length > 0 && (
          <div className="about-us-fourth container py-3">
            <h6>See what's new on Freeshopps</h6>
            <div className="about-us-fourth-main">
              {blogs?.data?.map((list, index) => (
                <div className="about-us-fourth-div" key={`freeshop${index}`}>
                  <div className="about-us-fourth-div-top">
                    <h5> {list?.category?.title} </h5>
                    <p> {list?.category?.description} </p>
                    <div className="about-us-fourth-div-top-line"></div>
                  </div>
                  <div className="about-us-fourth-div-posts">
                    {list?.freeShopNews?.map((data) => (
                      <div className="about-us-fourth-div-post" key={data?._id}>
                        <div className="about-us-fourth-div-post-img">
                          <img src={data?.image} alt="" className="img-fluid" />
                        </div>
                        <div className="about-us-fourth-div-post-content">
                          <h4>{data?.title}</h4>
                                                    <h4>{data?.description}</h4>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="about-us-fivth">
          <h1> {item?.ceoLetterTitle} </h1>
          <span> {item?.ceoLetter} </span>
        </div>
        <div className="about-us-sixth-div">
          <div className="about-us-sixth-div-left">
            {item?.bottomData?.map((item, index) => (
              <div className="about-us-sixth-left-div" key={`item${index}`}>
                <h6> {item?.name} </h6>
                <p>{item?.description}</p>
                <span>Learn more →</span>
              </div>
            ))}
          </div>
          <div className="about-us-sixth-div-right">
            <img src={item?.bottomDataImage} alt="" />
          </div>
        </div>
      </div>
      <div className="container-fluid px-3 py-3 news-list-container">
        <h2 className="news-title">Latest news</h2>
        <div className="news-items">
          {news?.data?.map((item) => (
            <div key={item._id} className="news-item">
              <span className="news-item-title">{item?.title}</span>
              <span className="news-item-date">
                {formatDate(item?.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* <div
        className="container-fluid about-us-seven"
        style={{
          backgroundImage: `url(${item?.checkOutExpertImage})`,
        }}
      >
        <div className="about-us-seven-content">
          <h1 className="text-dark">{item?.checkOutExpert}</h1>
          <button>Explore Parenting Hub</button>
        </div>
      </div> */}
    </>
  );
};

export default AboutUs;
