/** @format */
import "./Header.css";
import img from "../../assets/images/logo.png";
import img1 from "../../assets/images/Vector.png";
import { IoSearch, IoLocationSharp } from "react-icons/io5";
import { FaTruck, FaBarsStaggered, FaMessage, FaDownLong } from "react-icons/fa6";
import { FaGooglePlay, FaApple, FaPlusCircle } from "react-icons/fa";
import {
  FaRegHeart,
  FaRegCommentDots,
  FaPlusSquare,
  FaBriefcase,
  FaShoppingBag,
  FaChevronDown,
  FaRegBell, // Icon for notifications
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ForgotPassword,
  LoginModalfirst,
  LoginModalSecond,
  LoginModallogin,
  LoginModalsignup,
  CurrentLocationModel,
  JObsmodal,
} from "../Modals/Modals";
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import img2 from "../../assets/images/qrcode.png";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { useSelector, useDispatch } from "react-redux";
import { isAuthenticated, LOGOUT } from "../../store/authSlice";
import { CLEAR_LOCATION } from "../../store/locationSlice";
import NotificationPopup from "../NotificationPopUp/NotificationPopUp";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar } from "swiper/modules";
import SidebarCanvas from "../Modals/SidebarCanvas";
import { ThemeContext } from "../../Context/ThemeContext";
const default_user_avatar =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMg_4QMb_SkaPs0XXddwSldTXcgQCi2tdk0w&s";

const Header = () => {
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
  const hoverTimeout = useRef(null);
  const [searchType, setSearchType] = useState("home");

  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationCurrent, setLocationCurrent] = useState("");
  const [openCanvas, setOpenCanvas] = useState(false);
  const [openForgot, setForgot] = useState(false);
  const [showLocationModel, setShowLocationModel] = useState(false);
  const [showAppPopup, setShowAppPopup] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentCategoryId = queryParams.get("id");
  const [activeCategoryId, setActiveCategoryId] = useState(currentCategoryId);
  const navigate = useNavigate();
  const isLoggedIn = useSelector(isAuthenticated);
  const dispatch = useDispatch();

  // Refs for dropdowns
  const appPopupRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const inboxDropdownRef = useRef(null);

  // State for dropdowns
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showInboxDropdown, setShowInboxDropdown] = useState(false);
  const [activeInboxTab, setActiveInboxTab] = useState("messages");

  const { theme, toggleTheme, resetTheme } = useContext(ThemeContext);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        inboxDropdownRef.current &&
        !inboxDropdownRef.current.contains(event.target)
      ) {
        setShowInboxDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (
        appPopupRef.current &&
        !appPopupRef.current.contains(e.target) &&
        !e.target.closest(".navbar-getapp button")
      ) {
        setShowAppPopup(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getApi(endPoints.auth.getProfile, {
        setResponse: setProfile,
      });
    }
  }, [isLoggedIn]);

  console.log("profile");

  useEffect(() => {
    if (profile?.theme) {
      toggleTheme(profile.theme);
    }
  }, [profile?.theme, toggleTheme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = sessionStorage.getItem("location");
      setLocationCurrent(newValue);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getApi(endPoints.getCategories, {
      setResponse: setCategories,
    });
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("search", searchQuery);
    const targetPath =
      searchType === "jobs" ? "/jobs" : window.location.pathname;
    navigate(`${targetPath}?${params.toString()}`);
  };

  const logoutHandler = () => {
    dispatch(LOGOUT());
    dispatch(CLEAR_LOCATION());
    sessionStorage.clear();
    resetTheme();
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleNearbyClick = () => {
    setShow(false);
    setShow1(false);
    setShow2(false);
    setShow3(false);
    setForgot(false);
    setShowLocationModel(true);
  };

  const handleLocationUpdate = (newLocation) => {
    setLocationCurrent(newLocation);
    sessionStorage.setItem("location", newLocation);
  };

  const fetchSubCategories = useCallback((id) => {
    if (!id) return;
    setIsLoadingSubCategories(true);
    getApi(endPoints.subCategories.getSubCategoryByCatalog(id), {
      setResponse: (data) => {
        setSubCategories(data?.data || []);
        setIsLoadingSubCategories(false);
      },
    });
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setShowDropdown(false);
    setShowProfileDropdown(false);
    setShowInboxDropdown(false);
  };
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleInboxDropdown = () => {
    setShowInboxDropdown(!showInboxDropdown);
    setShowProfileDropdown(false); // Close other dropdowns
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowInboxDropdown(false); // Close other dropdowns
  };

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Modals */}
      <SidebarCanvas
        profile={profile} // PROP ADDED: Pass the profile data state
        show={openCanvas}
        handleClose={() => setOpenCanvas(false)}
        closeSidebar={() => setOpenCanvas(false)}
        logoutHandler={logoutHandler}
        setShow={setShow}
      />
      <LoginModalfirst
        show={show}
        onHide={() => setShow(false)}
        shownext={() => {
          setShow(false);
          setShow1(true);
        }}
      />
      <LoginModalSecond
        show={show1}
        onHide={() => setShow1(false)}
        shownext={() => {
          setShow1(false);
          setShow2(true);
        }}
        shownext1={() => {
          setShow1(false);
          setShow3(true);
        }}
      />
      <LoginModallogin
        show={show2}
        onHide={() => setShow2(false)}
        shownext={() => {
          setShow1(true);
          setShow2(false);
        }}
        openSignUp={() => {
          setShow1(false);
          setShow2(false);
          setShow3(true);
        }}
        openForgot={() => {
          setShow1(false);
          setShow2(false);
          setShow3(false);
          setForgot(true);
        }}
      />
      <LoginModalsignup
        show={show3}
        onHide={() => setShow3(false)}
        shownext={() => {
          setShow1(true);
          setShow3(false);
        }}
        openLogin={() => {
          setShow1(false);
          setShow2(true);
          setShow3(false);
        }}
      />
      <ForgotPassword show={openForgot} onHide={() => setForgot(false)} />
      <CurrentLocationModel
        show={showLocationModel}
        onHide={() => setShowLocationModel(false)}
        onLocationUpdate={handleLocationUpdate}
      />
      <JObsmodal show={isOpen} onHide={() => setIsOpen(false)} />

      {/* Header */}
      {/* ADDED CLASS sticky-header */}
      <header className="container-fluid px-3 sticky-header">
        <div className="navbar-top-div">
          {/* Left Side: Logo Only */}
          <div className="navbar-left">
            <div className="navbar-logo">
              <Link to="/">
                <img src={img} alt="logo" />
              </Link>
            </div>

            {/* MOVED SEARCH BAR FROM HERE TO OUTSIDE NAVBAR-LEFT */}
          </div>

          {/* Middle Side: Search Bar and Location (Expanded) */}
          <div>
            <div className="flex items-center gap-3">
              <Link to="#" className="logged-in-nav-item gap-2 px-3 py-2">
                <span className="font-semibold text-base">Available Items</span>
              </Link>
              <Link to="#" className="logged-in-nav-item gap-2 px-3 py-2">
                <span className="font-semibold text-base">Our Neighbor</span>
              </Link>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="logged-in-nav-item gap-2 px-3 py-2 !flex !flex-row items-center"
                >
                  <span className="font-semibold text-base">Service</span>
                  <span
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                  >
                    <FaChevronDown
                      className={`profile-arrow`}
                    />
                  </span>
                </button>

                {open && (
                  <ul className="absolute left-0 min-w-max rounded-md border bg-white shadow-lg z-50">
                    <li>
                      <Link
                        to="#"
                        onClick={() => setOpen(false)}
                        className="block px-2 py-2 text-base text-black hover:!text-[#e25845]"
                      >
                        Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#"
                        onClick={() => setOpen(false)}
                        className="block px-2 py-2 text-base text-black hover:!text-[#e25845]"
                      >
                        Other Service
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div className="navbar-searchbar-container">
              <div className="navbar-searchbar-div">
                <input
                  type="text"
                  placeholder="Search "
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="home">Home</option>
                  <option value="sale">Product</option>
                  <option value="jobs">Service</option>
                </select>
                <div className="navbar-searchbar-icon" onClick={handleSearch}>
                  <IoSearch color="#fff" size={28} />
                </div>
              </div>
              <div
                className="navbar-location d-flex align-items-center"
                onClick={handleNearbyClick}
                style={{ cursor: "pointer" }}
              >
                <IoLocationSharp className="me-1" />
                <span className="truncate max-w-[120px] xl:max-w-[250px] inline-block align-middle">
                  {locationCurrent || "Nearby + Shipping"}
                </span>
                <FaTruck className="ms-2" />
              </div>
            </div>
          </div>

          {/* Right Side: Auth/Profile */}
          <div className="navbar-right">
            {isLoggedIn ? (
              // LOGGED-IN VIEW
              <>
                <div className="logged-in-nav items-center">
                  <Link
                    to="/saved-products"
                    className="logged-in-nav-item gap-2"
                  >
                    <FaRegHeart className="text-[#e25845]" size={22} />
                    <span>Saved</span>
                  </Link>

                  {/* INBOX WITH DROPDOWN */}
                  {isLoggedIn && <NotificationPopup />}

                  <Link
                    to="/post-job"
                    className="logged-in-nav-item text-[#e25845] flex items-center gap-2"
                  >
                    <FaPlusSquare size={22} className="text-[#e25845]" />
                    <span>Post a Job</span>
                  </Link>

                  <Link
                    to="/post"
                    className="logged-in-nav-item text-[#e25845] flex items-center gap-2"
                  >
                    <FaPlusCircle size={22} className="text-[#e25845]" />
                    <span>Post an items</span>
                  </Link>

                  <Link
                    to="/account?section=myjobs"
                    className="logged-in-nav-item text-[#e25845] flex items-center gap-2"
                  >
                    <FaBriefcase size={22} className="text-[#e25845]" />
                    <span>My Jobs</span>
                  </Link>

                  <Link
                    to="/mylisting"
                    className="logged-in-nav-item text-[#e25845] flex items-center gap-2"
                  >
                    <FaShoppingBag size={22} className="text-[#e25845]" />
                    <span>My Items</span>
                  </Link>

                  <Link
                    to="/chats"
                    className="logged-in-nav-item text-[#e25845] flex items-center gap-2"
                  >
                    <FaMessage size={22} className="text-[#e25845]" />
                    <span>My Chats</span>
                  </Link>
                </div>

                {/* Profile Dropdown */}
                <div
                  className="profile-menu-container"
                  ref={profileDropdownRef}
                >
                  <button
                    className="profile-button"
                    onClick={toggleProfileDropdown}
                  >
                    <img
                      src={profile?.data?.image || default_user_avatar}
                      alt="user_avatar"
                      className="user_avatar_small"
                    />
                    <FaChevronDown
                      className={`profile-arrow ${showProfileDropdown ? "open" : ""}`}
                    />
                  </button>
                  {showProfileDropdown && (
                    <div className="profile-dropdown">
                      <div className="profile-dropdown-header">
                        <img
                          src={profile?.data?.image || default_user_avatar}
                          alt="user_avatar"
                          className="user_avatar_large"
                        />
                        <div className="profile-dropdown-info">
                          <strong>{profile?.data?.fullName || "User"}</strong>
                          <Link
                            to="/account"
                            onClick={() => setShowProfileDropdown(false)}
                          >
                            View public profile
                          </Link>
                        </div>
                      </div>
                      <ul>
                        <li
                          onClick={() =>
                            handleNavigate("/account?section=transactions")
                          }
                        >
                          Purchases & Sales
                        </li>
                        <li
                          onClick={() =>
                            handleNavigate("/account?section=settings")
                          }
                        >
                          Account settings
                        </li>
                        <hr />
                        <li onClick={() => handleNavigate("/aboutus")}>
                          About
                        </li>
                        <li onClick={() => handleNavigate("/help")}>Help</li>
                        <li onClick={() => handleNavigate("/chat")}>Chat</li>

                        <li onClick={() => handleNavigate("/terms-of-service")}>
                          Terms of Service
                        </li>
                        <li onClick={() => handleNavigate("/privacy-policy")}>
                          Privacy
                        </li>
                        <hr />
                        <li onClick={logoutHandler} className="logout-item">
                          Log out
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // LOGGED-OUT VIEW
              <>
                <div className="navbar-right-items">
                  <ul className="links">
                    <li style={{ position: "relative" }}>
                      <button
                        className="links-button"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        About
                        <span style={{ fontSize: "10px", marginLeft: "4px" }}>
                          {showDropdown ? "▲" : "▼"}
                        </span>
                      </button>
                      {showDropdown && (
                        <ul className="about-dropdown">
                          <li onClick={() => handleNavigate("/aboutus")}>
                            About
                          </li>
                          <li
                            onClick={() => handleNavigate("/terms-of-service")}
                          >
                            Terms
                          </li>
                          <li onClick={() => handleNavigate("/privacy-policy")}>
                            Privacy
                          </li>
                        </ul>
                      )}
                    </li>
                    <li>
                      <Link
                        to="/help"
                        className="links-button"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        Help
                      </Link>
                    </li>
                    <div className="navbar-getapp position-relative ">
                      <button
                        onClick={() => setShowAppPopup(!showAppPopup)}
                        style={{
                          width: "auto",
                          padding: "4px 8px 4px 8px",
                          borderRadius: "24px",
                          outline: "none",
                          border: "1px solid #ffffff",
                          background: "#e25845",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#ffffff",
                          margin: 0,
                          fontFamily: "Quicksand, sans-serif",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Get the app
                      </button>
                    </div>
                    {/* <li><Link to="/post" className="links-button" style={{ fontWeight: 'bold', fontSize: '16px' }}>Post a Job</Link></li> */}
                    <li>
                      <button
                        style={{
                          width: "auto",
                          padding: "4px 8px 4px 8px",
                          borderRadius: "24px",
                          outline: "none",
                          border: "1px solid #e25845",
                          background: "white",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "#e25845",
                          margin: 0,
                          fontFamily: "Quicksand, sans-serif",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => setShow(true)}
                      >
                        Log in
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
            <div className="ham_menu">
              <FaBarsStaggered onClick={() => setOpenCanvas(true)} />
            </div>
          </div>
        </div>

        {/* The "Get the App" Modal (accessible from logged-out view) */}
        {showAppPopup && (
          <div
            className="modal d-block d-flex justify-content-center align-items-center"
            tabIndex="-1"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content rounded-4 shadow-lg border-0 px-3">
                <div className="modal-header border-0 bg-">
                  <h5 className="modal-title fs-4 fw-semibold mx-auto text-center w-100">
                    Get the free{" "}
                    <span className="text-[#e25845]">Freeshopps</span> app
                  </h5>
                  <button
                    type="button"
                    className="btn-close position-absolute top-0 end-0 m-3"
                    onClick={() => setShowAppPopup(false)}
                  ></button>
                </div>

                <div className="modal-body text-center px-md-5">
                  <p className="text-muted mb-4">
                    Scan QR code to download Freeshopps
                  </p>
                  <img
                    src={img2}
                    alt="QR Code"
                    className="rounded-3 mb-4 img-fluid"
                    style={{ maxWidth: "220px", width: "100%", height: "auto" }}
                  />
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <a
                      href="#!"
                      onClick={(e) => e.preventDefault()}
                      className="btn btn-dark d-flex align-items-center px-4 py-2 rounded-3"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <FaApple size={24} className="me-2" />
                      <div className="text-start">
                        <small className="d-block text-white-50">
                          Download on the
                        </small>
                        <strong className="text-white">App Store</strong>
                      </div>
                    </a>
                    <a
                      href="#!"
                      onClick={(e) => e.preventDefault()}
                      className="btn btn-dark d-flex align-items-center px-4 py-2 rounded-3"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      <FaGooglePlay size={22} className="me-2" />
                      <div className="text-start">
                        <small className="d-block text-white-50">
                          GET IT ON
                        </small>
                        <strong className="text-white">Google Play</strong>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="container-fluid navbar-bottom-div">
          <div className="navbar-bottom-job">
            <h6 onClick={() => navigate("/jobs")}>Find a Job</h6>
            <img src={img1} alt="" />
          </div>
          <nav className="navbar-bottom-items">
            <ul>
              {isMobile ? (
                <Swiper
                  modules={[FreeMode, Scrollbar]}
                  freeMode={true}
                  scrollbar={{ draggable: true }}
                  spaceBetween={20}
                  slidesPerView={"auto"}
                  className="custom-swiper"
                >
                  {categories?.data?.map((item) => (
                    <SwiperSlide style={{ width: "auto" }} key={item._id}>
                      <li
                        onMouseEnter={(e) => {
                          if (hoverTimeout.current)
                            clearTimeout(hoverTimeout.current);
                          const target = e.currentTarget;
                          hoverTimeout.current = setTimeout(() => {
                            if (!target) return;
                            const rect = target.getBoundingClientRect();
                            setDropdownPosition({
                              top: rect.bottom,
                              left: rect.left,
                            });
                            setHoveredCategoryId(item._id);
                            fetchSubCategories(item._id);
                          }, 300);
                        }}
                        onMouseLeave={() => {
                          if (hoverTimeout.current)
                            clearTimeout(hoverTimeout.current);
                          hoverTimeout.current = setTimeout(() => {
                            setHoveredCategoryId(null);
                            setSubCategories([]);
                          }, 800);
                        }}
                        className="relative"
                      >
                        <span
                          onClick={(e) => e.preventDefault()}
                          className={`inline-block px-4 py-2 rounded-md font-medium transition-all duration-300 cursor-pointer ${
                            activeCategoryId === item._id
                              ? "bg-yellow-500 border-b-4"
                              : "hover:border-b-4 hover:border-[#e25845]"
                          }`}
                        >
                          {item.name}
                        </span>
                      </li>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Swiper
                  simulateTouch={true}
                  touchRatio={1}
                  grabCursor={true}
                  className="custom-swiper"
                  spaceBetween={20}
                  slidesPerView={"auto"}
                  scrollbar={true}
                >
                  {categories?.data?.map((item) => (
                    <SwiperSlide style={{ width: "auto" }} key={item._id}>
                      <li
                        onMouseEnter={(e) => {
                          if (hoverTimeout.current)
                            clearTimeout(hoverTimeout.current);
                          const target = e.currentTarget;
                          hoverTimeout.current = setTimeout(() => {
                            if (!target) return;
                            const rect = target.getBoundingClientRect();
                            setDropdownPosition({
                              top: rect.bottom,
                              left: rect.left,
                            });
                            setHoveredCategoryId(item._id);
                            fetchSubCategories(item._id);
                          }, 300);
                        }}
                        onMouseLeave={() => {
                          if (hoverTimeout.current)
                            clearTimeout(hoverTimeout.current);
                          hoverTimeout.current = setTimeout(() => {
                            setHoveredCategoryId(null);
                            setSubCategories([]);
                          }, 800);
                        }}
                        className="relative"
                      >
                        <span
                          onClick={(e) => e.preventDefault()}
                          className={`inline-block px-4 py-2  border-b-4 border-transparent rounded-md font-medium transition-all duration-300 cursor-pointer ${
                            activeCategoryId === item._id
                              ? "bg-yellow-500"
                              : "hover:border-[#e25845]"
                          }`}
                        >
                          {item.name}
                        </span>
                      </li>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </ul>
          </nav>
        </div>

        {/* Subcategory Dropdown */}
        {hoveredCategoryId && (
          <div
            className="subcategory-dropdown"
            style={{
              top: dropdownPosition.top + window.scrollY,
              left: dropdownPosition.left,
              position: "absolute",
              zIndex: 9999,
            }}
            onMouseEnter={() => clearTimeout(hoverTimeout.current)}
            onMouseLeave={() => {
              hoverTimeout.current = setTimeout(() => {
                setHoveredCategoryId(null);
                setSubCategories([]);
              }, 200);
            }}
          >
            <div className="subcategory-list-container custom-scrollbar">
              {isLoadingSubCategories ? (
                <div className="text-gray-500 text-sm px-4 py-2">
                  Loading...
                </div>
              ) : subCategories.length > 0 ? (
                <ul className="subcategory-list">
                  {subCategories.map((sub) => (
                    <li key={sub._id} className="subcategory-item">
                      <Link
                        to={`/product-list?categoryName=${encodeURIComponent(
                          categories?.data?.find(
                            (cat) => cat._id === hoveredCategoryId,
                          )?.name || "",
                        )}&id=${hoveredCategoryId}&subCategoryId=${sub._id}`}
                        className="subcategory-item-link"
                      >
                        <span className="font-bold text-black">{sub.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm px-4 py-2">No data</div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
