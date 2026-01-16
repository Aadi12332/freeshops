import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaClock } from "react-icons/fa6";

// 1. Social Share Buttons
import {
  FacebookShareButton, FacebookIcon,
  WhatsappShareButton, WhatsappIcon,
  TwitterShareButton, TwitterIcon,
  TelegramShareButton, TelegramIcon,
  LinkedinShareButton, LinkedinIcon,
  RedditShareButton, RedditIcon,
  PinterestShareButton, PinterestIcon,
  EmailShareButton, EmailIcon,
} from "react-share";

// 2. UI Icons (Io5)
import { 
  IoShareSocialOutline, 
  IoFlagOutline, 
  IoHeart, 
  IoHeartOutline, 
  IoClose, 
  IoStarOutline, 
  IoStar, 
  IoStarHalf,
  IoLocationSharp, 
  IoCopyOutline,
  IoCheckmarkCircleOutline 
} from "react-icons/io5";

import { BiErrorCircle } from "react-icons/bi"; 
import QRcode from "../../components/CommonComponent/QRcode";
import { getApi, postApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { isAuthenticated } from "../../store/authSlice.js";
import {
  LoginModalfirst,
  LoginModallogin,
  LoginModalSecond,
  LoginModalsignup,
} from "../../components/Modals/Modals.jsx";

import "./ProductDetails.css";
import { ListModal } from "../../components/SavedLists/SavedList.jsx";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext.jsx";

// --- HELPER FUNCTIONS ---

function formatDateTime(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date unavailable";
  }
}

function getStars(rating, maxStars = 5) {
  try {
    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 0) {
      return <div>Rating unavailable</div>;
    }
    const safeRating = Math.min(Math.max(0, parsedRating), maxStars);
    const stars = [];

    for (let i = 0; i < maxStars; i++) {
      if (i < safeRating) {
        stars.push(<IoStar key={i} />);
      } else {
        stars.push(<IoStarOutline key={i} />);
      }
    }
    return <div>{stars}</div>;
  } catch (error) {
    return <div>Rating unavailable</div>;
  }
}

// --- COMPONENT STATES ---

const LoadingState = () => (
  <div className="product-details-container">
    <div className="product-details-image" style={{ position: "relative" }}>
      <div className="loading-placeholder" style={{ width: "100%", height: "100%", background: "#f2f2f2", animation: "pulse 1.5s infinite ease-in-out" }} />
      <div className="loading-spinner" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "50px", height: "50px", border: "5px solid #f3f3f3", borderTop: "5px solid #f85c70", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
    <div className="product-details-content">
       {/* Skeleton UI elements... */}
       <div style={{ height: "24px", width: "60%", background: "#f2f2f2", marginBottom: "8px", animation: "pulse 1.5s infinite" }} />
       <div style={{ height: "18px", width: "40%", background: "#f2f2f2", marginBottom: "20px", animation: "pulse 1.5s infinite" }} />
       <div style={{ height: "200px", width: "100%", background: "#f2f2f2", animation: "pulse 1.5s infinite" }} />
    </div>
    <style>{`@keyframes spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="product-details-container error-container">
    <div className="error-content text-center py-5" style={{width: '100%'}}>
      <BiErrorCircle size={64} className="text-danger mb-3" />
      <h3>Oops! Something went wrong</h3>
      <p>{message || "We couldn't load this product's details."}</p>
      {onRetry && <button className="btn btn-primary mt-3" onClick={onRetry}>Try Again</button>}
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const ProductDetails = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  
  // Data States
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState(null);
  const [addToCartError, setAddToCartError] = useState(null);
  
  // UI States
  const isLoggedIn = useSelector(isAuthenticated);
  const [showFirstModal, setShowFirstModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  
  // Share States
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { productLikeAndUnlike } = useStripeCheckout();

  // --- 1. Fetch Data ---
  const fetchDetail = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!id) {
      setIsLoading(false);
      setError("Product ID is missing.");
      return;
    }

    getApi(endPoints.products.getProductDetailBeforeLogin(id), {
      setResponse: (data) => {
        if (data && data.data) {
          setResponse(data);
        } else {
          setError("Invalid data format.");
        }
        setIsLoading(false);
      },
      onError: (err) => {
        console.error("Error:", err);
        setError(err?.message || "Failed to load product details.");
        setIsLoading(false);
      },
    });
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // --- 2. Favorite Logic ---
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.data?._id;

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (response?.data?.likeUsers && userId) {
      setIsFavorite(response.data.likeUsers.includes(userId));
    }
  }, [response, userId]);

  const handleFavoriteClick = () => {
    if (!id) return;
    if (isLoggedIn) {
      productLikeAndUnlike(id);
      setIsFavorite((prev) => !prev);
    } else {
      setShowFirstModal(true);
    }
  };

  // --- 3. Cart Logic ---
  const handleAddToCart = async () => {
  if (!isLoggedIn) {
    setShowFirstModal(true);
    return;
  }

  try {
    setIsAddingToCart(true);
    setAddToCartError(null);

    await postApi(
      endPoints.cart.addToCart(id),
      { quantity: 1 },
      {
        setResponse: (data) => {
          if (data) navigate("/cart");
          else throw new Error("Failed to add to cart");
        },
        onError: (err) => {
          throw err; // <-- correctly wrapped inside function
        }
      }
    );

  } catch (error) {
    setAddToCartError(error?.message || "Failed to add to cart.");
  } finally {
    setIsAddingToCart(false);
  }
};

  // --- 4. Share Logic ---
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = response?.data?.name || "Check out this amazing product!";

  const handleShareTrigger = async () => {
    // Try Native Share First (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check this out: ${shareTitle}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to Custom Popover (Desktop)
      setShowShareOptions(!showShareOptions);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- 5. Other Handlers ---
  const handleAskClick = (data) => {
    if (isLoggedIn) navigate("/chat", { state: { data } });
    else setShowFirstModal(true);
  };

  const handleReport = () => {
    if (window.confirm("Do you want to report this product?")) {
      console.log("Reported:", id);
      // API Call logic here
    }
  };

  // --- Modal Navigation ---
  const handleFirstToSecond = () => { setShowFirstModal(false); setShowSecondModal(true); };
  const handleSecondToLogin = () => { setShowSecondModal(false); setShowLoginModal(true); };
  const handleSecondToSignup = () => { setShowSecondModal(false); setShowSignupModal(true); };
  const handleBackToSecond = () => { setShowLoginModal(false); setShowSignupModal(false); setShowSecondModal(true); };

  // --- RENDER ---
  if (isLoading) return <div className="home-container"><div className="home-app"><QRcode /></div><LoadingState /></div>;
  if (error) return <div className="home-container"><div className="home-app"><QRcode /></div><ErrorState message={error} onRetry={fetchDetail} /></div>;
  if (!response?.data) return <div className="home-container"><div className="home-app"><QRcode /></div><ErrorState message="Product not found" onRetry={fetchDetail} /></div>;

  return (
    <>
      {/* --- AUTH MODALS --- */}
      <LoginModalfirst show={showFirstModal} onHide={() => setShowFirstModal(false)} shownext={handleFirstToSecond} />
      <LoginModalSecond show={showSecondModal} onHide={() => setShowSecondModal(false)} shownext={handleSecondToLogin} shownext1={handleSecondToSignup} />
      <LoginModallogin show={showLoginModal} onHide={() => setShowLoginModal(false)} shownext={handleBackToSecond} />
      <LoginModalsignup show={showSignupModal} onHide={() => setShowSignupModal(false)} shownext={handleBackToSecond} />

      <div className="container home-container min-h-screen">
        <div className="home-app"><QRcode /></div>
        
        <div className="product-details-container d-flex align-items-center py-5">
          
          {/* LEFT: Image */}
          <div className="product-details-image">
            {response?.data?.productImages?.[0]?.image ? (
              <img 
                src={response.data.productImages[0].image} 
                alt={response.data.name} 
                onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder-image.jpg"; }} 
              />
            ) : (
              <div className="no-image-placeholder"><p>No image available</p></div>
            )}
          </div>

          {/* RIGHT: Content */}
          <div className="product-details-content">
            <div className="product-details-content-top">
              <h2>{response.data.name || "Unnamed Product"}</h2>
              <p><FaClock /> {response?.data?.createdAt ? formatDateTime(response.data.createdAt) : "Date unavailable"}</p>
              <p><IoLocationSharp /> {response?.data?.locationValue || "Location unavailable"}</p>
              <div className="product-details-rating">{getStars(response?.data?.ratings)}</div>
            </div>

            <div className="product-details-specification">
              <h3>Description :</h3>
              <div className="product-details-points">
                {response?.data?.description ? (
                  <div dangerouslySetInnerHTML={{ __html: response.data.description }} />
                ) : <p>No description available</p>}
              </div>
            </div>

            {addToCartError && <div className="alert alert-danger mt-3" role="alert">{addToCartError}</div>}

            {/* --- ACTION BUTTONS CONTAINER --- */}
            <div className="product-details-action-container">
              
              {/* 1. Ask Button */}
              <div className="product-details-actionbtn">
                <button 
                  onClick={() => response?.data?.userId && handleAskClick(response.data)}
                  disabled={!response?.data?.userId}
                >
                  Ask
                </button>
              </div>

              {/* 2. Add to Cart Button */}
              <div className="product-details-actionbtn">
                <button onClick={handleAddToCart} disabled={isAddingToCart}>
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              {/* 3. Favorite Button (Icon Only) */}
              <div className="product-details-actionbtn">
                <button
                  className={`icon-only-btn favorite-button ${isFavorite ? "active" : ""}`}
                  onClick={handleFavoriteClick}
                  title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                  {isFavorite ? <IoHeart /> : <IoHeartOutline />}
                </button>
              </div>

              {/* 4. Share Button (Icon Only + Popover) */}
              <div className="product-details-actionbtn position-relative">
                <button 
                  onClick={handleShareTrigger} 
                  className="icon-only-btn share-button"
                  title="Share"
                >
                   {showShareOptions ? <IoClose /> : <IoShareSocialOutline />}
                </button>

                {/* Share Menu (Popover/Bottom Sheet) */}
                {showShareOptions && (
                  <>
                    {/* Overlay for Mobile */}
                    <div className="share-overlay d-md-none" onClick={() => setShowShareOptions(false)} />
                    
                    <div className="custom-share-popover">
                      <div className="share-header d-flex justify-content-between align-items-center mb-3">
                        <span style={{fontWeight:'700', fontFamily:'Quicksand'}}>Share to</span>
                        <button className="close-share" style={{background:'none', border:'none', fontSize:'20px', cursor:'pointer'}} onClick={() => setShowShareOptions(false)}>
                          <IoClose />
                        </button>
                      </div>

                      <div className="share-grid">
                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                          <div className="share-item"><WhatsappIcon size={40} round /><span>WhatsApp</span></div>
                        </WhatsappShareButton>

                        <FacebookShareButton url={shareUrl} quote={shareTitle}>
                          <div className="share-item"><FacebookIcon size={40} round /><span>Facebook</span></div>
                        </FacebookShareButton>

                        <TelegramShareButton url={shareUrl} title={shareTitle}>
                          <div className="share-item"><TelegramIcon size={40} round /><span>Telegram</span></div>
                        </TelegramShareButton>

                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                          <div className="share-item"><TwitterIcon size={40} round /><span>Twitter</span></div>
                        </TwitterShareButton>

                        <LinkedinShareButton url={shareUrl} title={shareTitle}>
                           <div className="share-item"><LinkedinIcon size={40} round /><span>LinkedIn</span></div>
                        </LinkedinShareButton>

                        <PinterestShareButton url={shareUrl} media={response?.data?.productImages?.[0]?.image || ""} description={shareTitle}>
                           <div className="share-item"><PinterestIcon size={40} round /><span>Pinterest</span></div>
                        </PinterestShareButton>

                        <RedditShareButton url={shareUrl} title={shareTitle}>
                           <div className="share-item"><RedditIcon size={40} round /><span>Reddit</span></div>
                        </RedditShareButton>

                        <EmailShareButton url={shareUrl} subject={shareTitle}>
                           <div className="share-item"><EmailIcon size={40} round /><span>Email</span></div>
                        </EmailShareButton>
                      </div>

                      <div className="copy-link-section">
                        <div className="copy-input-container">
                          <input type="text" readOnly value={shareUrl} />
                          <button onClick={handleCopyLink} className={isCopied ? "copy-btn copied" : "copy-btn"}>
                            {isCopied ? <><IoCheckmarkCircleOutline /> Copied</> : <><IoCopyOutline /> Copy</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 5. Report Button (Icon Only) */}
              <div className="product-details-actionbtn">
                <button onClick={handleReport} className="icon-only-btn report-button" title="Report Product">
                  <IoFlagOutline />
                </button>
              </div>

              {id && <ListModal isOpen={showListModal} onClose={() => setShowListModal(false)} productId={id} />}
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;