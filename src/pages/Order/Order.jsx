import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import "./Order.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        getApi(endPoints.order.getOrders(), {
          setResponse: (data) => {
            setOrders(data.data);
            setIsLoading(false);
          },
          setError: (error) => {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div
        className="container py-3 order-page-loading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Optional: ensures the container takes full viewport height for vertical centering
        }}
      >
        <div className="loader"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-3 order-page-empty">
        <div className="empty-content">
          <h2>No Orders Found</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="empty-order-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div class="order-page">
      <div class="order-container">
        <div class="order-header">
          <h1>Your Orders</h1>
        </div>
        <div class="order-list">
          {orders.map((order) => (
            <div key={order._id} class="order-card">
              <img
                src={
                  order.productId.productImages[0]?.image ||
                  "/api/placeholder/100/100"
                }
                alt={order.productId.name}
                class="order-image"
              />
              <div class="order-details">
                <h2 class="order-name">{order.productId.name}</h2>
                <div class="order-info">
                  <p>Order ID: {order.orderId}</p>
                  <p>Quantity: {order.quantity}</p>
                </div>
                <div class="order-status">
                  <p>Status: {order.orderStatus}</p>
                  <p>Delivery: {order.deliveryStatus}</p>
                  <p>Payment: {order.paymentType}</p>
                  <p>Ordered: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <a href="/" class="continue-shopping">
          Continue Shopping
        </a>
      </div>
    </div>
  );
};

export default OrderPage;