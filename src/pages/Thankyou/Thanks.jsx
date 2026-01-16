/** @format */

import QRcode from "../../components/CommonComponent/QRcode";
import "./Thanks.css";
import img from "../../assets/images/img20.png";
import { useNavigate } from "react-router-dom";

const Thanks = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="thanks-container">
        <div className="home-app">
          <QRcode />
        </div>
        <div className="thanks-main">
          <div className="thanks-main-img">
            <img src={img} alt="" />
          </div>
          <div className="thanks-main-text">
            <h1>Thank you for participating in growing up this community</h1>
          </div>
          <div className="thanks-main-btn">
            <button
              className="post-form-inputes-check-btn"
              onClick={() => navigate("/")}
            >
              HOME
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Thanks;
