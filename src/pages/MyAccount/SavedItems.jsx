import React, { useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import { useNavigate } from "react-router-dom";

const SavedItems = () => {
  const { getLikeProductList, likeProduct } = useStripeCheckout();

  // --- NEW: State to track dark mode ---
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("dark-mode")
  );
 const navigate=useNavigate()
  useEffect(() => {
    getLikeProductList();
  }, []);

  // --- NEW: Effect to listen for theme changes on the body ---
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // --- MODIFIED: Dynamic styles based on isDarkMode state ---
  const wrapperStyle = {
    padding: "24px",
    // The parent container should handle the main page background color
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: isDarkMode ? "#ffffff" : "#111827", // Default to a dark text color
  };

  const quickSaveBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
    padding: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    border: isDarkMode ? "1px solid #333" : "none", // Add a subtle border in dark mode
  };

  const linkStyle = {
    color: isDarkMode ? "#60a5fa" : "#2563eb", // Use a lighter blue for dark mode
    textDecoration: "underline",
    fontSize: "14px",
    fontWeight: "500",
  };

  const itemCountStyle = {
    color: isDarkMode ? "#aaaaaa" : "#555",
    fontSize: "14px",
    margin: 0,
  };

  const arrowStyle = {
    color: isDarkMode ? "#aaaaaa" : "#555",
    fontSize: "16px",
  };

  return (
    <div style={wrapperStyle}>
      <h2 style={titleStyle}>Saved Items</h2>

      <div style={quickSaveBoxStyle} onClick={()=>navigate('/saved-products')}>
        {/* Left Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <AiOutlineHeart style={{ color: "red", fontSize: "28px" }} />
          <div>
            <a href="#" style={linkStyle}>
              Quick Save
            </a>
            <p style={itemCountStyle}>
              {likeProduct?.docs?.length || 0} Items
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <FiChevronRight style={arrowStyle} />
      </div>
    </div>
  );
};

export default SavedItems;