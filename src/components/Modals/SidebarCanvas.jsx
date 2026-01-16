/** @format */
import Offcanvas from "react-bootstrap/Offcanvas";
import "./Modals.css";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { isAuthenticated } from "../../store/authSlice";
import img from "../../assets/images/logo.png";

const SidebarCanvas = ({ show, handleClose, logoutHandler, setShow, profile, defaultAvatar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("sale");

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    const targetPath = searchType === "jobs" ? `/jobs?${params.toString()}` : `/product-list?${params.toString()}`;
    navigate(targetPath);
    handleClose();
  };

  const handleLoginClick = () => {
    handleClose();
    setShow(true);
  };
  
  const handleLogoutClick = () => {
    handleClose();
    logoutHandler();
  }

  // UPDATED: Navigation items are now conditional based on login state
  const baseNavItems = [
    { path: "/", text: "Home" },
    // { path: "/post", text: "Post a Job" },
  ];

  const loggedInNavItems = [
    { path: "/chat/inbox", text: "Notifications" }, // Corresponds to NotificationPopup
        { path: "/chat", text: "Chat" }, // Corresponds to NotificationPopup

    { path: "/saved-products", text: "Saved" },
    { path: "/mylisting", text: "My Items" },
    { path: "/account?section=myjobs", text: "My Jobs" },
    { path: "/account?section=settings", text: "My Account" },
  ];

  const navItems = isLoggedIn ? [...baseNavItems, ...loggedInNavItems] : baseNavItems;


  return (
    <Offcanvas show={show} onHide={handleClose} placement="start" className="custom-sidebar">
      <Offcanvas.Header >
        <Offcanvas.Title>
          <img src={img} alt="logo" style={{ maxHeight: '40px' }} />
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        
        {/* Profile Header Section */}
        {isLoggedIn && profile && (
          <div className="sidebar-profile-header">
            <Link to="/account" onClick={handleClose} className="sidebar-profile-link">
              <img
                src={profile?.data?.image || defaultAvatar}
                alt="User Avatar"
                className="sidebar-avatar"
              />
              <span className="sidebar-username">
                {profile?.data?.fullName || "Welcome!"}
              </span>
            </Link>
          </div>
        )}
        
        <div className="p-3 border-bottom">
          {/* SEARCH BAR */}
          <div className="search_bar_sidebar">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <div className="search_icon_sidebar" onClick={handleSearch}>
              <IoSearch />
            </div>
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="form-select mt-2"
          >
            <option value="sale">Product</option>
            <option value="jobs">Service</option>
          </select>
        </div>

        {/* UPDATED: Navigation now renders the new list of items */}
        <nav className="flex-grow-1">
          <ul className="sidebar-nav-links list-unstyled">
            {navItems.map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  state={item.state} 
                  onClick={handleClose}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* FOOTER - Login/Logout Button */}
        <div className="p-3 mt-auto border-top">
          <button
            className="btn w-100"
            style={{ backgroundColor: '#e25845', color: 'white' }}
            onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
          >
            {isLoggedIn ? "Log out" : "Log in"}
          </button>
        </div>

      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SidebarCanvas;