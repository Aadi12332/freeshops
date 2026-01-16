/** @format */
import "./Trustsafety.css";
import { useEffect, useState } from "react";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";

const TrustSection = () => {
  const [response, setResponse] = useState(false);
  const [item, setItem] = useState(null);
  
  const fetchHandler = () => {
    getApi(endPoints.trust_safety, {
      setResponse,
    });
  };
  
  useEffect(() => {
    fetchHandler();
  }, []);
  
  useEffect(() => {
    if (response) {
      console.log(response)
      setItem(response?.data?.[0]);
    }
  }, [response]);
  
  console.log(item,"---------")
  
  return (
    <>
      {response && (
        <div className="container trust-container">
          <div className="trust-top">
            {/* Background Image */}
            <div className="trust-top-image">
              <img className="" src={item?.image} alt="" />
            </div>
            
            {/* Content Overlay */}
            <div className="trust-top-content">
              <div className="trust-top-left">
                <h1> {item?.title} </h1>
                <p>{item?.description}</p>
              </div>
            </div>
          </div>
          
          <div className="trust-middle">
            <div className="trust-middle-left">
              <img src={item?.middleDataImage} alt="" />
            </div>
            <div className="trust-middle-right">
              <h4>{item?.middleName}</h4>
              <p>{item?.middleDescription}</p>
              <span>Learn more →</span>
            </div>
          </div>
          
          <div className="about-us-sixth-div">
            <div className="about-us-sixth-div-left">
              <div className="trust-middle-bottom-heading">
                <h5> {item?.bottomDataHeading} </h5>
              </div>
              {item?.bottomData?.map((data, index) => (
                <div className="about-us-sixth-left-div" key={`bottom${index}`}>
                  <h6> {data?.name} </h6>
                  <p>{data?.description}</p>
                  <span>Read more→</span>
                </div>
              ))}
            </div>
            <div className="about-us-sixth-div-right">
              <img src={item?.bottomDataImage} alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrustSection;