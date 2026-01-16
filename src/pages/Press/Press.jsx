/** @format */

import "./Press.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";

function formatDate(dateString) {
  const date = new Date(dateString);

  // List of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = date.getDate(); // Get the day of the month
  const month = months[date.getMonth()]; // Get the month name
  const year = date.getFullYear(); // Get the year

  return `${month} ${day}, ${year}`;
}

const Press = () => {
  const [contactDetails, setContactDetails] = useState(null);
  const [pressTopic, setPressTopic] = useState(null);
  const [news, setNews] = useState(null);
  const [selectedNews, setSelectednews] = useState(null);
  const [announcements, setAnnouncements] = useState(null);

  const fetchHandler = () => {
    getApi(endPoints.press.contactDetails, {
      setResponse: setContactDetails,
    });
    getApi(endPoints.press.pressTopic, {
      setResponse: setPressTopic,
    });
    getApi(endPoints.press.news, {
      setResponse: setNews,
    });
    getApi(endPoints.press.offerupNews, {
      setResponse: setAnnouncements,
    });
  };

  console.log("announcements", announcements?.data?.docs);

  useEffect(() => {
    fetchHandler();
  }, []);

  useEffect(() => {
    if (news) {
      setSelectednews(news?.data?.[0]?.career?.[0]);
    }
  }, [news]);

  return (
    <>
      <div className="container-fluid px-lg-0 press-container">
        {contactDetails?.data?.title && (
          <div className="press-top">
            <h1> {contactDetails?.data?.title} </h1>
          </div>
        )}

        {selectedNews && (
          <div className="press-second">
            <div className="press-second-left">
              <img src={selectedNews?.image} alt={selectedNews?.title} />
            </div>
            <div className="press-second-right">
              <p>
                Featured News /{" "}
                {selectedNews?.createdAt && formatDate(selectedNews?.createdAt)}{" "}
              </p>
              <h5> {selectedNews?.title} </h5>
              <span>{selectedNews?.description}</span>
              <h6>Read now</h6>
            </div>
          </div>
        )}

        {news?.data?.length > 0 &&
          news?.data?.map((item, index) => (
            <div className="press-third" key={`news_highlight_${index}`}>
              <div className="press-third-left">
                <h4> {item?.category?.title} </h4>
              </div>
              <div className="press-third-right">
                {item?.career?.map((news) => (
                  <div
                    className="press-third-right-div"
                    onClick={() => setSelectednews(news)}
                    style={{ cursor: "pointer" }}
                    key={news?._id}
                  >
                    <h6> {news?.title} </h6>
                    <p> {news?.createdAt && formatDate(news?.createdAt)} </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {announcements?.data?.docs?.length > 0 && (
          <div className="press-fourth">
            <h6>OfferUp News and Announcements</h6>
            <div className="press-fourth-divs">
              {announcements?.data?.docs?.map((item) => (
                <div className="press-fourth-div" key={item?._id}>
                  <div className="press-fourth-div-img">
                    <img src={item?.image} alt="" />
                  </div>
                  <div className="press-fourth-div-content">
                    <h5>{item?.title}</h5>
                    <span>Read Now</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pressTopic?.data?.docs?.length > 0 && (
          <div className="press-fivth">
            {pressTopic?.data?.docs?.map((item) => (
              <div className="press-fivth-div" key={item?._id}>
                <h6> {item?.title} </h6>
                <FaArrowRightLong />
              </div>
            ))}
          </div>
        )}

        {contactDetails && (
  <div className="card border-0 mb-3 mt-4 mx-auto" style={{ maxWidth: "440px" }}>
    <div className="row g-0 align-items-center">
      {/* Left Side Image */}
      <div className="col-10 col-md-4 text-center border-0">
        <img
          src={contactDetails?.data?.image}
          className="img-fluid rounded-start press_images"
          alt="Contact"
        />
      </div>

      {/* Right Side Content */}
      <div className="col-12 col-md-8">
        <div className="card-body">
          <h6 className="card-title">{contactDetails?.data?.heading}</h6>
          <h5>{contactDetails?.data?.subTitle}</h5>
          <p className="card-text">{contactDetails?.data?.description}</p>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
};

export default Press;
