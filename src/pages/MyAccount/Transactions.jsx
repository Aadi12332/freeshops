// // import React, { useEffect, useState } from "react";
// // import { useStripeCheckout } from "../../Context/StripeCheckoutContext";

// // const Transactions = () => {
// //   const [activeTab, setActiveTab] = useState("orders");
// //   const { getOrderList, orderList, getTransactionList, TransactionList, loading } = useStripeCheckout();

// //   const [isDarkMode, setIsDarkMode] = useState(
// //     () => document.body.classList.contains('dark-mode')
// //   );

// //   useEffect(() => {
// //     getOrderList();
// //     getTransactionList();
// //   }, []);

// //   useEffect(() => {
// //     const observer = new MutationObserver((mutations) => {
// //       mutations.forEach((mutation) => {
// //         if (mutation.attributeName === 'class') {
// //           setIsDarkMode(document.body.classList.contains('dark-mode'));
// //         }
// //       });
// //     });
// //     observer.observe(document.body, { attributes: true });
// //     return () => observer.disconnect();
// //   }, []);

// //   const getStatusBadgeStyle = (status) => {
// //     const baseStyle = {
// //       display: 'inline-block',
// //       padding: '5px 10px',
// //       borderRadius: '20px',
// //       fontSize: '12px',
// //       fontWeight: '600',
// //       textTransform: 'capitalize',
// //       minWidth: '60px',
// //       textAlign: 'center'
// //     };

// //     const statusLower = status?.toLowerCase() || 'pending';
    
// //     if (isDarkMode) {
// //         switch (statusLower) {
// //             case 'pending': return { ...baseStyle, background: 'rgba(245, 158, 11, 0.2)', color: '#facc15' };
// //             case 'shipped': return { ...baseStyle, background: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8' };
// //             case 'delivered': return { ...baseStyle, background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' };
// //             case 'confirmed': return { ...baseStyle, background: 'rgba(37, 99, 235, 0.2)', color: '#60a5fa' };
// //             case 'cancelled': return { ...baseStyle, background: 'rgba(239, 68, 68, 0.2)', color: '#f87171' };
// //             case 'processing': return { ...baseStyle, background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' };
// //             case 'paid': return { ...baseStyle, background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80' };
// //             case 'failed': return { ...baseStyle, background: 'rgba(220, 38, 38, 0.2)', color: '#f87171' };
// //             case 'pending-payment': return { ...baseStyle, background: 'rgba(245, 158, 11, 0.2)', color: '#facc15' };
// //             default: return { ...baseStyle, background: 'rgba(245, 158, 11, 0.2)', color: '#facc15' };
// //         }
// //     }

// //     switch (statusLower) {
// //       case 'pending': return { ...baseStyle, background: '#fff4e5', color: '#f59e0b' };
// //       case 'shipped': return { ...baseStyle, background: '#e0f3ff', color: '#0284c7' };
// //       case 'delivered': return { ...baseStyle, background: '#e8fbe8', color: '#22c55e' };
// //       case 'confirmed': return { ...baseStyle, background: '#e0f2ff', color: '#2563eb' };
// //       case 'cancelled': return { ...baseStyle, background: '#fee2e2', color: '#ef4444' };
// //       case 'processing': return { ...baseStyle, background: '#f3e8ff', color: '#8b5cf6' };
// //       case 'paid': return { ...baseStyle, background: '#e8fbe8', color: '#16a34a' };
// //       case 'failed': return { ...baseStyle, background: '#fee2e2', color: '#dc2626' };
// //       case 'pending-payment': return { ...baseStyle, background: '#fff8e1', color: '#f59e0b' };
// //       default: return { ...baseStyle, background: '#fff4e5', color: '#f59e0b' };
// //     }
// //   };

// //   const wrapperStyle = { width: '100%', padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', background: isDarkMode ? '#121212' : '#f5f7fb' };
// //   const tabsHeaderStyle = { display: 'flex', gap: '15px', marginBottom: '25px' };
// //   const getTabItemStyle = (isActive) => ({
// //     padding: '10px 20px',
// //     background: isActive ? '#4caf50' : (isDarkMode ? '#2a2a2a' : '#fff'),
// //     borderRadius: '8px 8px 0 0',
// //     fontSize: '15px',
// //     fontWeight: '600',
// //     color: isActive ? '#fff' : (isDarkMode ? '#aaaaaa' : '#555'),
// //     cursor: 'pointer',
// //     transition: 'all 0.3s ease',
// //     border: `1px solid ${isActive ? '#4caf50' : (isDarkMode ? '#333' : 'transparent')}`,
// //     boxShadow: isActive && !isDarkMode ? '0 3px 6px rgba(0, 0, 0, 0.1)' : 'none'
// //   });
// //   const titleStyle = { fontSize: '20px', fontWeight: '600', marginBottom: '15px', color: isDarkMode ? '#fff' : '#222' };
// //   const tableContainerStyle = { background: isDarkMode ? '#1e1e1e' : '#fff', borderRadius: '12px', padding: '15px', boxShadow: isDarkMode ? 'none' : '0 4px 10px rgba(0, 0, 0, 0.05)', border: isDarkMode ? '1px solid #333' : 'none', overflowX: 'auto' };
// //   const tableStyle = { width: '100%', borderCollapse: 'collapse', minWidth: '800px' };
// //   const thTdStyle = { padding: '12px 15px', textAlign: 'left', fontSize: '14px', borderBottom: `1px solid ${isDarkMode ? '#333' : '#eee'}`, color: isDarkMode ? '#e0e0e0' : '#333', whiteSpace: 'nowrap' };
// //   const thStyle = { ...thTdStyle, background: isDarkMode ? '#2a2a2a' : '#f9fafc', fontWeight: '600', color: isDarkMode ? '#fff' : '#333' };
// //   const productImgStyle = { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${isDarkMode ? '#555' : '#ddd'}` };
// //   const noDataStyle = { textAlign: 'center', padding: '40px 20px', color: isDarkMode ? '#aaaaaa' : '#666', fontStyle: 'italic' };
// //   const rowHoverBackground = isDarkMode ? '#2a2a2a' : '#f5fff8';

// //   return (
// //     <div style={wrapperStyle}>
// //       {/* Tabs Header */}
// //       <div style={tabsHeaderStyle}>
// //         <div style={getTabItemStyle(activeTab === "orders")} onClick={() => setActiveTab("orders")}>Orders</div>
// //         <div style={getTabItemStyle(activeTab === "transactions")} onClick={() => setActiveTab("transactions")}>Transactions</div>
// //       </div>

// //       {/* Show Loader if loading */}
// //       {loading ? (
// //  <div style={{
// //     display: 'flex',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     height: '200px'
// //   }}>
// //     <div style={{
// //       width: '50px',
// //       height: '50px',
// //       border: `5px solid ${isDarkMode ? '#333' : '#f3f3f3'}`,
// //       borderTop: `5px solid ${isDarkMode ? '#4caf50' : '#4caf50'}`,
// //       borderRadius: '50%',
// //       animation: 'spin 1s linear infinite'
// //     }} />
// //     {/* Inline keyframes for spin animation */}
// //     <style>
// //       {`
// //         @keyframes spin {
// //           0% { transform: rotate(0deg); }
// //           100% { transform: rotate(360deg); }
// //         }
// //       `}
// //     </style>
// //   </div>
// //       ) : (
// //         <>
// //           {/* Orders */}
// //           {activeTab === "orders" && (
// //             <div>
// //               <h2 style={titleStyle}>Orders</h2>
// //               <div style={tableContainerStyle}>
// //                 <table style={tableStyle}>
// //                   <thead>
// //                     <tr>
// //                       <th style={thStyle}>#</th>
// //                       <th style={thStyle}>Image</th>
// //                       <th style={thStyle}>Product</th>
// //                       <th style={thStyle}>Order ID</th>
// //                       <th style={thStyle}>Order Status</th>
// //                       <th style={thStyle}>Delivery Status</th>
// //                       <th style={thStyle}>Payment Type</th>
// //                       <th style={thStyle}>Payment Status</th>
// //                       <th style={thStyle}>Total</th>
// //                       <th style={thStyle}>Date</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {orderList?.data?.length > 0 ? orderList.data.map((order, index) => (
// //                       <tr key={order._id} onMouseEnter={(e) => e.currentTarget.style.background = rowHoverBackground} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
// //                         <td style={thTdStyle}>{index + 1}</td>
// //                         <td style={thTdStyle}>
// //                           <img src={order.productId?.productImages?.[0]?.image || "https://via.placeholder.com/50"} alt={order.productId?.name || "Product"} style={productImgStyle} onError={(e) => e.target.src = "https://via.placeholder.com/50"} />
// //                         </td>
// //                         <td style={thTdStyle}>{order.productId?.name || "N/A"}</td>
// //                         <td style={thTdStyle}>{order.orderId || "N/A"}</td>
// //                         <td style={thTdStyle}><span style={getStatusBadgeStyle(order.orderStatus)}>{order.orderStatus || "Pending"}</span></td>
// //                         <td style={thTdStyle}><span style={getStatusBadgeStyle(order.deliveryStatus)}>{order.deliveryStatus || "Pending"}</span></td>
// //                         <td style={thTdStyle}>{order.paymentType || "N/A"}</td>
// //                         <td style={thTdStyle}><span style={getStatusBadgeStyle(order.paymentStatus)}>{order.paymentStatus || "Pending"}</span></td>
// //                         <td style={thTdStyle}>${order.total?.toFixed(2) || "0.00"}</td>
// //                         <td style={thTdStyle}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</td>
// //                       </tr>
// //                     )) : (
// //                       <tr><td colSpan="10" style={{ ...thTdStyle, ...noDataStyle }}>No Orders Found</td></tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}

// //           {/* Transactions */}
// //           {activeTab === "transactions" && (
// //             <div>
// //               <h2 style={titleStyle}>Transactions</h2>
// //               <div style={tableContainerStyle}>
// //                 <table style={tableStyle}>
// //                   <thead>
// //                     <tr>
// //                       <th style={thStyle}>Order ID</th>
// //                       <th style={thStyle}>Image</th>
// //                       <th style={thStyle}>Item</th>
// //                       <th style={thStyle}>Status</th>
// //                       <th style={thStyle}>Amount</th>
// //                       <th style={thStyle}>Date</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {TransactionList?.data?.length > 0 ? TransactionList.data.map((txn) => (
// //                       <tr key={txn._id} onMouseEnter={(e) => e.currentTarget.style.background = rowHoverBackground} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
// //                         <td style={thTdStyle}>{txn.orderId || "N/A"}</td>
// //                         <td style={thTdStyle}>
// //                           <img src={txn.productOrderId?.productId?.productImages?.[0]?.image} alt={txn.productOrderId?.productId?.name || "Transaction Item"} style={productImgStyle} onError={(e) => { e.target.src = "https://via.placeholder.com/60x60?text=Item"; }} />
// //                         </td>
// //                         <td style={thTdStyle}>{txn.productOrderId?.productId?.name || "Item not specified"}</td>
// //                         <td style={thTdStyle}><span style={getStatusBadgeStyle(txn?.productOrderId?.paymentStatus)}>{txn?.productOrderId?.paymentStatus || "pending"}</span></td>
// //                         <td style={thTdStyle}>${txn.productOrderId?.paid?.toFixed(2) || "0.00"}</td>
// //                         <td style={thTdStyle}>{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : "N/A"}</td>
// //                       </tr>
// //                     )) : (
// //                       <tr><td colSpan="6" style={{ ...thTdStyle, ...noDataStyle }}>No Transactions Found</td></tr>
// //                     )}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default Transactions;


// import React, { useEffect, useState } from "react";
// import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
// import { FiChevronRight } from "react-icons/fi";
// import { BsBoxSeam } from "react-icons/bs"; 

// const Transactions = () => {
//   const { getOrderList, orderList, loading } = useStripeCheckout();

//   // --- State to track dark mode ---
//   const [isDarkMode, setIsDarkMode] = useState(() =>
//     document.body.classList.contains("dark-mode")
//   );

//   // --- Effect: Fetch Data ---
//   useEffect(() => {
//     getOrderList();
//   }, []);

//   // --- Effect: Listen for Theme Changes ---
//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       setIsDarkMode(document.body.classList.contains("dark-mode"));
//     });
//     observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
//     return () => observer.disconnect();
//   }, []);

//   // --- Helper for Status Colors ---
//   const getStatusColor = (status) => {
//     const s = status?.toLowerCase();
//     if (s === 'delivered' || s === 'paid' || s === 'confirmed') return isDarkMode ? '#4ade80' : '#16a34a'; // Green
//     if (s === 'cancelled' || s === 'failed') return isDarkMode ? '#f87171' : '#dc2626'; // Red
//     return isDarkMode ? '#facc15' : '#d97706'; // Yellow/Orange (Pending/Processing)
//   };

//   // --- STYLES (Matched to PaymentAndDeposit) ---
//   const wrapperStyle = {
//     width: "100%",
//     padding: "20px 0", // Adjusted padding for list view
//     fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
//   };

//   const itemBoxStyle = {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
//     padding: "16px",
//     borderRadius: "8px",
//     marginBottom: "12px",
//     border: isDarkMode ? "1px solid #333" : "none",
//     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//     cursor: "pointer",
//   };

//   const leftSectionStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "16px",
//   };

//   // Image container acts like the Icon circle in Payment UI
//   const imageContainerStyle = {
//     width: "50px",
//     height: "50px",
//     borderRadius: "10px", // Slightly squared for product images
//     overflow: "hidden",
//     backgroundColor: isDarkMode ? "#3f3f3f" : "#fff",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     border: isDarkMode ? "1px solid #444" : "1px solid #e5e5e5",
//   };

//   const productImgStyle = {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//   };

//   const textGroupStyle = {
//     display: "flex",
//     flexDirection: "column",
//     gap: "2px",
//   };

//   const titleStyle = {
//     color: isDarkMode ? "#ffffff" : "#111827",
//     fontSize: "16px",
//     fontWeight: "600",
//     margin: 0,
//   };

//   const subTitleStyle = {
//     color: isDarkMode ? "#aaaaaa" : "#6b7280",
//     fontSize: "13px",
//     margin: 0,
//   };

//   const rightSectionStyle = {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     gap: "4px",
//   };

//   const priceStyle = {
//     color: isDarkMode ? "#fff" : "#111",
//     fontWeight: "bold",
//     fontSize: "16px",
//   };

//   const statusStyle = (status) => ({
//     fontSize: "12px",
//     fontWeight: "600",
//     textTransform: "capitalize",
//     color: getStatusColor(status),
//   });

//   return (
//     <div style={wrapperStyle}>
//       {/* Loading State */}
//       {loading ? (
//         <div style={{ textAlign: "center", padding: "40px", color: isDarkMode ? "#aaa" : "#666" }}>
//           Loading Orders...
//         </div>
//       ) : (
//         <>
//           {/* Check if data exists */}
//           {orderList?.data?.length > 0 ? (
//             orderList.data.map((order) => (
//               <div key={order._id} style={itemBoxStyle}>
                
//                 {/* Left Side: Image + Details */}
//                 <div style={leftSectionStyle}>
//                   <div style={imageContainerStyle}>
//                     {order.productId?.productImages?.[0]?.image ? (
//                       <img 
//                         src={order.productId?.productImages[0].image} 
//                         alt="Product" 
//                         style={productImgStyle} 
//                       />
//                     ) : (
//                       <BsBoxSeam size={24} color={isDarkMode ? "#aaa" : "#555"} />
//                     )}
//                   </div>
                  
//                   <div style={textGroupStyle}>
//                     <h4 style={titleStyle}>
//                       {order.productId?.name || "Unknown Product"}
//                     </h4>
//                     <p style={subTitleStyle}>
//                       {new Date(order.createdAt).toLocaleDateString()} • ID: {order.orderId?.slice(-6) || "N/A"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Right Side: Price + Status */}
//                 <div style={rightSectionStyle}>
//                   <span style={priceStyle}>
//                     ${order.total?.toFixed(2) || "0.00"}
//                   </span>
//                   <span style={statusStyle(order.orderStatus)}>
//                     {order.orderStatus || "Pending"}
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             // No Data State
//             <div style={{ 
//               textAlign: "center", 
//               padding: "40px", 
//               color: isDarkMode ? "#aaa" : "#666",
//               backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
//               borderRadius: "8px"
//             }}>
//               <p>No orders found.</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Transactions;


import React, { useEffect, useState } from "react";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import { FiChevronRight, FiHome } from "react-icons/fi"; // Added FiHome
import { BsBoxSeam } from "react-icons/bs"; 
import { useNavigate } from "react-router-dom"; // Added useNavigate

const Transactions = () => {
  const { getOrderList, orderList, loading } = useStripeCheckout();
  const navigate = useNavigate(); // Hook for navigation

  // --- State to track dark mode ---
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("dark-mode")
  );

  // --- Effect: Fetch Data ---
  useEffect(() => {
    getOrderList();
  }, []);

  // --- Effect: Listen for Theme Changes ---
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // --- Helper for Status Colors ---
  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'paid' || s === 'confirmed') return isDarkMode ? '#4ade80' : '#16a34a'; 
    if (s === 'cancelled' || s === 'failed') return isDarkMode ? '#f87171' : '#dc2626'; 
    return isDarkMode ? '#facc15' : '#d97706'; 
  };

  // --- STYLES ---
  const wrapperStyle = {
    width: "100%",
    padding: "20px 0",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  };

  // New Header Style for Title and Home Icon
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "0 4px"
  };

  const itemBoxStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: isDarkMode ? "1px solid #333" : "none",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  };

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  };

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

  const productImgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const textGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  const titleStyle = {
    color: isDarkMode ? "#ffffff" : "#111827",
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  };

  const listTitleStyle = {
    color: isDarkMode ? "#ffffff" : "#111827",
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  };

  const subTitleStyle = {
    color: isDarkMode ? "#aaaaaa" : "#6b7280",
    fontSize: "13px",
    margin: 0,
  };

  const rightSectionStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  };

  const priceStyle = {
    color: isDarkMode ? "#fff" : "#111",
    fontWeight: "bold",
    fontSize: "16px",
  };

  const statusStyle = (status) => ({
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
    color: getStatusColor(status),
  });

  const iconButtonStyle = {
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    backgroundColor: isDarkMode ? "#333" : "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s"
  };

  return (
    <div style={wrapperStyle}>
      {/* --- NEW HEADER WITH HOME ICON --- */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>My Orders</h2>
        <div 
            style={iconButtonStyle} 
            onClick={() => navigate('/')} 
            title="Go to Home"
        >
            <FiHome size={20} color={isDarkMode ? "#fff" : "#111"} />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: isDarkMode ? "#aaa" : "#666" }}>
          Loading Orders...
        </div>
      ) : (
        <>
          {/* Check if data exists */}
          {orderList?.data?.length > 0 ? (
            orderList.data.map((order) => (
              <div key={order._id} style={itemBoxStyle}>
                
                {/* Left Side: Image + Details */}
                <div style={leftSectionStyle}>
                  <div style={imageContainerStyle}>
                    {order.productId?.productImages?.[0]?.image ? (
                      <img 
                        src={order.productId?.productImages[0].image} 
                        alt="Product" 
                        style={productImgStyle} 
                      />
                    ) : (
                      <BsBoxSeam size={24} color={isDarkMode ? "#aaa" : "#555"} />
                    )}
                  </div>
                  
                  <div style={textGroupStyle}>
                    <h4 style={listTitleStyle}>
                      {order.productId?.name || "Unknown Product"}
                    </h4>
                    <p style={subTitleStyle}>
                      {new Date(order.createdAt).toLocaleDateString()} • ID: {order.orderId?.slice(-6) || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Right Side: Price + Status */}
                <div style={rightSectionStyle}>
                  <span style={priceStyle}>
                    ${order.total?.toFixed(2) || "0.00"}
                  </span>
                  <span style={statusStyle(order.orderStatus)}>
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            // No Data State
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: isDarkMode ? "#aaa" : "#666",
              backgroundColor: isDarkMode ? "#2a2a2a" : "#f3f3f3",
              borderRadius: "8px"
            }}>
              <p>No orders found.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;