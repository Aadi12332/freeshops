import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import "./OrderSuccessPage.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");

    const confirmOrder = async () => {
      try {
        const response = await new Promise((resolve, reject) => {
          getApi(endPoints.order.successOrder(orderId), {
            setResponse: (data) => resolve(data),
            setError: (error) => reject(error),
          });
        });

        if (!response) {
          throw new Error("No order details received");
        }

        setOrderDetails(response);
        setIsLoading(false);

        const countdownInterval = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount <= 1) {
              clearInterval(countdownInterval);
              navigate("/");
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);
      } catch (error) {
        console.error("Order confirmation failed:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    if (orderId) {
      confirmOrder();
    }
  }, [navigate, location.search]);

  if (isLoading) {
    return (
      <div className="order-success-page loading">
        <div className="spinner"></div>
        <p>Processing your order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-page error">
        <div className="error-container">
          <h1>Order Error</h1>
          <p>{error}</p>
          <button 
            className="home-button" 
            onClick={() => navigate("/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="success-container">
        <svg 
          className="checkmark" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 52 52"
        >
          <circle 
            className="checkmark-circle" 
            cx="26" 
            cy="26" 
            r="25" 
            fill="none" 
            stroke="#4bb71b"
            strokeWidth="2"
          />
          <path 
            className="checkmark-check" 
            fill="none" 
            stroke="#4bb71b"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
        
        <h1>Order Successful!</h1>
        
        {orderDetails && (
          <div className="order-details">
            <h2>Order Summary</h2>
            <p>Order ID: {orderDetails._id || 'N/A'}</p>
            <p>Total Amount: ${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</p>
            
            {orderDetails.items && orderDetails.items.length > 0 ? (
              <div className="order-items">
                <h3>Items Purchased:</h3>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span>{item.name || 'Unknown Item'}</span>
                    <span>
                      {item.quantity || 0} x ${item.price ? item.price.toFixed(2) : '0.00'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items in this order</p>
            )}
          </div>
        )}
        
        <p className="redirect-message">
          You will be redirected to the home page in {countdown} seconds...
        </p>
        
        <button 
          className="home-button" 
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;