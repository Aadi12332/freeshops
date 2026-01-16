import React from "react";
import { useNavigate } from "react-router-dom";
import "./GettingStarted.css"; // Import the external CSS file

// Example data coming from backend/editor
const freeshoppsBasics = [
  { label: "<b>What is Freeshopps?</b>", route: "/help/what-is-freeshopps" },
  { label: "Download the app", route: "/help/download-app" },
  { label: "Create an account", route: "/help/create-account" },
  { label: "Connect your <i>Facebook</i> account", route: "/help/connect-facebook" },
  { label: "Log in and out of your account", route: "/help/login-logout" },
  { label: "Navigate the app", route: "/help/navigate" },
];

const buyingAndSelling = [
  { label: "How to buy on <u>Freeshopps</u>", route: "/help/how-to-buy" },
  { label: "Search for items to buy", route: "/help/search-items" },
  { label: "Post an item to sell", route: "/help/post-item" },
  { label: "Buy and sell with <b>nationwide shipping</b>", route: "/help/shipping" },
];

const GettingStarted = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="getting-started-container">
      <h1>Getting Started</h1>
      <div className="columns-container">
        {/* Left Column */}
        <div className="column">
          <h2>Freeshopps Basics</h2>
          <ul>
            {freeshoppsBasics.map((item, index) => (
              <li key={index} onClick={() => handleNavigation(item.route)} style={{ cursor: "pointer" }}>
                <span className="arrow">▶</span>
                <span dangerouslySetInnerHTML={{ __html: item.label }} />
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="column">
          <h2>Start Buying & Selling</h2>
          <ul>
            {buyingAndSelling.map((item, index) => (
              <li key={index} onClick={() => handleNavigation(item.route)} style={{ cursor: "pointer" }}>
                <span className="arrow">▶</span>
                <span dangerouslySetInnerHTML={{ __html: item.label }} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
