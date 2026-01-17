/** @format */

import "./Footer.css";
import img from "../../assets/images/logo.png";
import { RiTwitterXFill } from "react-icons/ri";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  JObsmodal,
  LoginModalfirst,
  LoginModalSecond,
  LoginModallogin,
  LoginModalsignup,
  ForgotPassword,
} from "../Modals/Modals"; // Assuming correct path
import { isAuthenticated } from "../../store/authSlice.js"; // Assuming correct path
import { useSelector } from "react-redux";

const Footer = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(isAuthenticated);
  const appDropdownRef = useRef(null);

  // State for Modals
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [openForgot, setForgot] = useState(false);

  // State for App Dropdown
  const [showAppOptions, setShowAppOptions] = useState(false);

  // --- Modal Toggle Functions ---
  const toggle = () => {
    setShow(false);
    setShow1(true);
  };
  const toggle1 = () => {
    setShow1(false);
    setShow2(true);
  };
  const toggle2 = () => {
    setShow1(true);
    setShow2(false);
    setShow3(false);
  };
  const toggle3 = () => {
    setShow1(false);
    setShow3(true);
  };
  const DontAccountSignup = () => {
    setShow1(false);
    setShow2(false);
    setShow3(true);
  };
  const AlreadyAccountSignup = () => {
    setShow1(false);
    setShow2(true);
    setShow3(false);
  };
  const ForgotPasswordToogle = () => {
    setShow1(false);
    setShow2(false);
    setShow3(false);
    setForgot(true);
  };

  // --- Click Handlers ---
  const handlePostJobClick = () => {
    if (isLoggedIn) {
      navigate("/post-job");
    } else {
      setShow(true);
    }
  };

  const handlePostItemClick = () => {
    if (isLoggedIn) {
      navigate("/post");
    } else {
      setShow(true);
    }
  };

  // --- App Store Handlers ---
  const handleGetAppClick = () => {
    setShowAppOptions((prev) => !prev);
  };

  const handlePlayStoreClick = () => {
    window.open("https://play.google.com/store", "_blank");
    setShowAppOptions(false);
  };

  const handleAppStoreClick = () => {
    window.open("https://www.apple.com/app-store/", "_blank");
    setShowAppOptions(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appDropdownRef.current &&
        !appDropdownRef.current.contains(event.target)
      ) {
        setShowAppOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const footerSections = [
    {
      title: "About",
      links: [
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Terms of Service", path: "/terms-of-service" },
        { name: "Privacy Policy", path: "/privacy-policy" },
      ],
    },
    {
      title: "Help",
      links: [
        { name: "Help center", path: "/help" },
        { name: "Blog", path: "/blog" },
        { name: "Contact Us", path: "/contact-us" },
        { name: "Tutorial", path: "/tutorial-us" },
      ],
    },
    {
      title: "Shop",
      links: [
        { name: "How it works", path: "/aboutus" },
        { name: "Explore", path: "/product-list" },
        { name: "Trust & safety", path: "/trust-safety" },
      ],
    },
    {
      title: "Sell",
      links: [
        { name: "Post an item", onClick: handlePostItemClick },
        { name: "Auto dealerships", path: "/auto-dealerships" },
      ],
    },
    {
      title: "Jobs",
      links: [
        { name: "Post job", onClick: handlePostJobClick },
        { name: "Find a job", onClick: () => setIsOpen(true) },
      ],
    },
  ];

  return (
    <>
      {/* --- All Modals --- */}
      <JObsmodal show={isOpen} onHide={() => setIsOpen(false)} />
      <LoginModalfirst
        show={show}
        onHide={() => setShow(false)}
        shownext={toggle}
      />
      <LoginModalSecond
        show={show1}
        onHide={() => setShow1(false)}
        shownext={toggle1}
        shownext1={toggle3}
      />
      <LoginModallogin
        show={show2}
        onHide={() => setShow2(false)}
        shownext={toggle2}
        openSignUp={DontAccountSignup}
        openForgot={ForgotPasswordToogle}
      />
      <LoginModalsignup
        show={show3}
        onHide={() => setShow3(false)}
        shownext={toggle2}
        openLogin={AlreadyAccountSignup}
      />
      <ForgotPassword show={openForgot} onHide={() => setForgot(false)} />

      <div className="city-search container">
        <h2>Search for items by city</h2>

        <div className="city-grid">
          <ul>
            <li>
              <a href="#">Atlanta, GA</a>
            </li>
            <li>
              <a href="#">Austin, TX</a>
            </li>
            <li>
              <a href="#">Baltimore, MD</a>
            </li>
            <li>
              <a href="#">Boston, MA</a>
            </li>
            <li>
              <a href="#">Chicago, IL</a>
            </li>
            <li>
              <a href="#">Cleveland, OH</a>
            </li>
          </ul>

          <ul>
            <li>
              <a href="#">Columbus, OH</a>
            </li>
            <li>
              <a href="#">Dallas, TX</a>
            </li>
            <li>
              <a href="#">Denver, CO</a>
            </li>
            <li>
              <a href="#">Detroit, MI</a>
            </li>
            <li>
              <a href="#">Houston, TX</a>
            </li>
            <li>
              <a href="#">Las Vegas, NV</a>
            </li>
          </ul>

          <ul>
            <li>
              <a href="#">Los Angeles, CA</a>
            </li>
            <li>
              <a href="#">Miami, FL</a>
            </li>
            <li>
              <a href="#">Nashville, TN</a>
            </li>
            <li>
              <a href="#">New York, NY</a>
            </li>
            <li>
              <a href="#">Orlando, FL</a>
            </li>
            <li>
              <a href="#">Philadelphia, PA</a>
            </li>
          </ul>

          <ul>
            <li>
              <a href="#">Pittsburgh, PA</a>
            </li>
            <li>
              <a href="#">Phoenix, AZ</a>
            </li>
            <li>
              <a href="#">Portland, OR</a>
            </li>
            <li>
              <a href="#">Salt Lake City, UT</a>
            </li>
            <li>
              <a href="#">San Diego, CA</a>
            </li>
          </ul>

          <ul>
            <li>
              <a href="#">San Francisco, CA</a>
            </li>
            <li>
              <a href="#">Seattle, WA</a>
            </li>
            <li>
              <a href="#">St. Louis, MO</a>
            </li>
            <li>
              <a href="#">Tampa, FL</a>
            </li>
            <li>
              <a href="#" className="see-more">
                See more
              </a>
            </li>
          </ul>
        </div>
      </div>

      <footer className="site-footer__container">
        <div className="container mx-auto">
        <div className="site-footer__main-content">
          <div className="navbar-logo bg-white rounded-full mb-3">
            <Link to="/">
              <img src={img} alt="logo" />
            </Link>
          </div>
          <h5 className="text-white font-semibold mb-5">
            Visit our help center
          </h5>

          <div className="site-footer__top-section">
            <div className="site-footer__links-wrapper">
              {footerSections.map((section, idx) => (
                <div key={idx} className="site-footer__links-column">
                  <h6>{section.title}</h6>
                  <ul>
                    {section.links.map((link, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          if (link.onClick) {
                            link.onClick();
                          } else if (link.path) {
                            navigate(link.path);
                          }
                        }}
                      >
                        {link.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="site-footer__actions-wrapper">
              <div className="site-footer__social-links">
                <RiTwitterXFill />
                <FaFacebook />
                <FaInstagram />
                <FaLinkedin />
              </div>
              <div className="site-footer__get-app" ref={appDropdownRef}>
                <button
                  className="site-footer__get-app-button"
                  onClick={handleGetAppClick}
                >
                  Get the app
                </button>
                <div
                  className={`site-footer__app-dropdown ${
                    showAppOptions ? "is-active" : ""
                  }`}
                >
                  <div className="site-footer__app-dropdown-header">
                    Download Our App
                  </div>

                  <div
                    className="site-footer__app-dropdown-link google-play"
                    onClick={handlePlayStoreClick}
                  >
                    <div className="site-footer__app-icon-wrapper google-play">
                      <FaGooglePlay size={20} color="white" />
                    </div>
                    <div className="site-footer__app-text-wrapper">
                      <div className="title">Google Play</div>
                      <div className="subtitle">Get it on Play Store</div>
                    </div>
                  </div>

                  <div
                    className="site-footer__app-dropdown-link apple-store"
                    onClick={handleAppStoreClick}
                  >
                    <div className="site-footer__app-icon-wrapper apple-store">
                      <FaApple size={22} color="white" />
                    </div>
                    <div className="site-footer__app-text-wrapper">
                      <div className="title">App Store</div>
                      <div className="subtitle">Download on App Store</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="site-footer__bottom-section">
            <p>© 2024 Freeshoppsps</p>
          </div>
        </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
