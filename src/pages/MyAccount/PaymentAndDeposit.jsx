import React, { useEffect, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { BsCreditCard, BsBank, BsCurrencyDollar, BsBoxSeam } from "react-icons/bs";
import { AiOutlineHistory } from "react-icons/ai";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext"; // Import Context

const PaymentAndDeposit = () => {
  // --- STATE ---
  const [view, setView] = useState("menu"); // 'menu' or 'history'
  const { getOrderList, orderList, loading } = useStripeCheckout(); // Context Data

  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("dark-mode")
  );

  // --- EFFECTS ---
  useEffect(() => {
    // Fetch orders when component mounts or view changes to history
    if (view === 'history') {
        getOrderList();
    }
  }, [view]);

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

  // --- HELPERS ---
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'paid' || s === 'confirmed') return isDarkMode ? '#4ade80' : '#16a34a';
    if (s === 'cancelled' || s === 'failed') return isDarkMode ? '#f87171' : '#dc2626';
    return isDarkMode ? '#facc15' : '#d97706';
  };

  // --- STYLES ---
  const wrapperStyle = {
    padding: "24px",
    maxWidth: "800px",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0,
    color: isDarkMode ? "#ffffff" : "#111827",
  };

  const balanceCardStyle = {
    background: "linear-gradient(135deg, #e25845 0%, #ff7e5f 100%)",
    padding: "24px",
    borderRadius: "12px",
    color: "#fff",
    marginBottom: "32px",
    boxShadow: "0 4px 15px rgba(226, 88, 69, 0.3)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const itemBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
    padding: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: isDarkMode ? "1px solid #333" : "none",
    marginBottom: "12px",
    transition: "background-color 0.2s ease",
  };

  const iconContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: isDarkMode ? "#3f3f3f" : "#fff",
    color: "#e25845",
    fontSize: "20px",
  };

  // Transaction Item specific styles
  const imageContainerStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: isDarkMode ? "#3f3f3f" : "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: isDarkMode ? "1px solid #444" : "1px solid #e5e5e5",
  };

  // --- RENDER LOGIC ---

  // 1. Transaction History View
  if (view === "history") {
    return (
      <div style={wrapperStyle}>
        {/* Header with Back Button */}
        <div style={headerStyle}>
          <button 
            onClick={() => setView("menu")}
            style={{ 
              background: "none", 
              border: "none", 
              cursor: "pointer", 
              color: isDarkMode ? "#fff" : "#000",
              display: "flex",
              alignItems: "center",
              padding: 0
            }}
          >
            <FiChevronLeft size={24} />
          </button>
          <h2 style={titleStyle}>Transaction History</h2>
        </div>

        {/* Loading State */}
        {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: isDarkMode ? "#aaa" : "#666" }}>
                Loading...
            </div>
        ) : (
            <div>
                {orderList?.data?.length > 0 ? (
                    orderList.data.map((order) => (
                    <div key={order._id} style={itemBoxStyle}>
                        {/* Left Side: Image + Details */}
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={imageContainerStyle}>
                                {order.productId?.productImages?.[0]?.image ? (
                                <img 
                                    src={order.productId?.productImages[0].image} 
                                    alt="Product" 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                                ) : (
                                <BsBoxSeam size={24} color={isDarkMode ? "#aaa" : "#555"} />
                                )}
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <h4 style={{ color: isDarkMode ? "#ffffff" : "#111827", fontSize: "16px", fontWeight: "600", margin: 0 }}>
                                    {order.productId?.name || "Unknown Product"}
                                </h4>
                                <p style={{ color: isDarkMode ? "#aaaaaa" : "#6b7280", fontSize: "13px", margin: 0 }}>
                                    {new Date(order.createdAt).toLocaleDateString()} • ID: {order.orderId?.slice(-6) || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Price + Status */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                            <span style={{ color: isDarkMode ? "#fff" : "#111", fontWeight: "bold", fontSize: "16px" }}>
                                ${order.total?.toFixed(2) || "0.00"}
                            </span>
                            <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "capitalize", color: getStatusColor(order.orderStatus) }}>
                                {order.orderStatus || "Pending"}
                            </span>
                        </div>
                    </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "40px", color: isDarkMode ? "#aaa" : "#666" }}>
                        <p>No transaction history found.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    );
  }

  // 2. Main Menu View
  return (
    <div style={wrapperStyle}>
      <h2 style={titleStyle}>Payment and Deposit</h2>

      <div style={{ marginTop: "24px" }}>
        {/* Balance Section */}
        <div style={balanceCardStyle}>
          <div>
            <div style={{ fontSize: "14px", opacity: 0.9, marginBottom: "8px" }}>Available Balance</div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>$0.00</h1>
          </div>
          <BsCurrencyDollar size={40} style={{ opacity: 0.3 }} />
        </div>

        {/* Options List */}
        <div>
          {/* <div style={itemBoxStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={iconContainerStyle}><BsCreditCard /></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: isDarkMode ? "#fff" : "#111", fontWeight: "600" }}>Payment Methods</span>
                <span style={{ color: isDarkMode ? "#aaa" : "#666", fontSize: "13px" }}>Manage cards and accounts</span>
              </div>
            </div>
            <FiChevronRight style={{ color: "#9ca3af" }} />
          </div> */}

          {/* <div style={itemBoxStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={iconContainerStyle}><BsBank /></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: isDarkMode ? "#fff" : "#111", fontWeight: "600" }}>Direct Deposit</span>
                <span style={{ color: isDarkMode ? "#aaa" : "#666", fontSize: "13px" }}>Set up bank deposits</span>
              </div>
            </div>
            <FiChevronRight style={{ color: "#9ca3af" }} />
          </div> */}

          {/* Click to open History */}
          <div style={itemBoxStyle} onClick={() => setView("history")}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={iconContainerStyle}><AiOutlineHistory /></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: isDarkMode ? "#fff" : "#111", fontWeight: "600" }}>Transaction History</span>
                <span style={{ color: isDarkMode ? "#aaa" : "#666", fontSize: "13px" }}>View past payments and deposits</span>
              </div>
            </div>
            <FiChevronRight style={{ color: "#9ca3af" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentAndDeposit;