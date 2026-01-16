import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import { HiMenu, HiX } from "react-icons/hi";
import { FiExternalLink } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../../store/authSlice.js";
import { CLEAR_LOCATION } from "../../store/locationSlice.js";
import PurchasesSales from "./PurchasesSales.jsx";
import AccountSettings from "./AccountSettings.jsx";
import MyJobs from "../../components/MyJobs/MyJobs";
import SavedItems from "./SavedItems.jsx";
import Transactions from "./Transactions.jsx";
import PaymentAndDeposit from "./PaymentAndDeposit.jsx";
// import PaymentAndDeposit from "./PaymentAndDeposit.jsx"; // Uncomment when you have the component

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(location.search);
  const initialSection = urlParams.get("section");

  const [activeView, setActiveView] = useState(initialSection);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (activeView) {
      params.set("section", activeView);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [activeView, navigate, location.pathname]);

  function logoutHandler() {
    dispatch(LOGOUT());
    dispatch(CLEAR_LOCATION());
    navigate("/");
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMenuItemClick = (view) => {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isMobileSidebarOpen &&
        !event.target.closest(".dash-sidebar") &&
        !event.target.closest(".mobile_menu_btn")
      ) {
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileSidebarOpen]);

  const renderContent = () => {
    const pageHeader = (title) => (
      <div className="page_header">
        <button className="mobile_menu_btn" onClick={toggleMobileSidebar}>
          <HiMenu size={24} />
        </button>
        <h2 className="page_title">{title}</h2>
      </div>
    );

    switch (activeView) {
      case "dashboard":
        return (
          <>
            {pageHeader("Purchases & Sales")}
            <Transactions />
          </>
        );
      case "myjobs":
        return (
          <>
            {pageHeader("My Jobs")}
            <MyJobs />
          </>
        );
      
      // --- NEW CASE ADDED ---
      case "payments":
        return (
          <>
            {pageHeader("Payment and Deposit")}
            {/* Replace the div below with your actual <PaymentAndDeposit /> component */}
           <PaymentAndDeposit/>
          </>
        );
      // ----------------------

      case "saved":
        return (
          <>
            {pageHeader("Saved Items")}
            <SavedItems />
          </>
        );
      case "settings":
        return (
          <>
            {pageHeader("Account Settings")}
            <AccountSettings />
          </>
        );
      default:
        // Default to Purchases & Sales if no section matches
        return (
          <>
            {pageHeader("Purchases & Sales")}
            <PurchasesSales />
          </>
        );
    }
  };

  return (
    <div className="dashboard_container">
      {isMobileSidebarOpen && (
        <div
          className="mobile_overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`dash-sidebar ${isMobileSidebarOpen ? "is-open" : ""}`}
      >
        <div className="dash-sidebar-content">
          <div className="dash-sidebar-header">
            <button className="dash-sidebar-close-btn" onClick={toggleMobileSidebar}>
              <HiX size={24} />
            </button>
          </div>

          <nav className="dash-sidebar-nav">
            <div className="dash-sidebar-section">
              <h4 className="dash-sidebar-section-title">Transactions</h4>
              <div
                className={`dash-sidebar-link ${
                  activeView === "dashboard" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("dashboard")}
              >
                Purchases & Sales
              </div>
              
              {/* --- NEW SIDEBAR LINK ADDED --- */}
              <div
                className={`dash-sidebar-link ${
                  activeView === "payments" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("payments")}
              >
                Payment and Deposit
              </div>
              {/* ----------------------------- */}

              <div
                className={`dash-sidebar-link ${
                  activeView === "myjobs" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("myjobs")}
              >
                My Jobs
              </div>
            </div>
            
            <div className="dash-sidebar-section">
              <h4 className="dash-sidebar-section-title">Saves</h4>
              <div
                className={`dash-sidebar-link ${
                  activeView === "saved" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("saved")}
              >
                Saved Items
              </div>
            </div>

            <div className="dash-sidebar-section">
              <h4 className="dash-sidebar-section-title">Account</h4>
              <div
                className={`dash-sidebar-link ${
                  activeView === "settings" ? "active" : ""
                }`}
                onClick={() => handleMenuItemClick("settings")}
              >
                Account settings
              </div>
            </div>
          </nav>

          <div className="dash-sidebar-footer">
            <button className="dash-sidebar-logout-btn" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="main_content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;