import React, { useEffect, useState } from "react";
import "./Inbox.css";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import { useNavigate } from "react-router-dom";

const Inbox = () => {
  const [activeTab, setActiveTab] = useState("messages");

  const { getNotificationList, notificationList, isLoading } =
    useStripeCheckout();
 const navigate=useNavigate()
  useEffect(() => {
    if (activeTab === "messages") {
      getNotificationList({ messageType: "Message" });
    } else {
      getNotificationList({ messageType: "Notification" });
    }
  }, [activeTab]);

  // helper for time formatting
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString(); // Customize if needed
  };

    const handleAskClick = (data) => {
    if (!data) {
      console.error("Missing owner data for chat");
      return;
    }

    if (data) {
      navigate("/chat", { state: { data } });
    } else {
      setShowFirstModal(true);
    }
  };

  return (
    <div className="inbox-container">
      {/* Breadcrumb */}
      <div className="inbox-breadcrumb">
        Home <span className="breadcrumb-separator">{">"}</span>{" "}
        <span className="breadcrumb-current">Inbox</span>
      </div>

      {/* Page Title */}
      <h1 className="inbox-title">Inbox</h1>

      {/* Main Box */}
      <div className="inbox-box">
        {/* Tabs */}
        <div className="inbox-tabs">
          <button
            className={`inbox-tab ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={`inbox-tab ${
              activeTab === "notifications" ? "active" : ""
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
        </div>

        {/* Tab Content */}
        <div className="inbox-content">
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeTab === "messages" ? (
                notificationList && notificationList.length > 0 ? (
                  notificationList.map((msg) => (
                    <div key={msg._id} className="message-item" onClick={()=>handleAskClick(msg)}>
                      <div className="message-avatar">
                        {msg.userId?.image ? (
                          <img
                            src={msg.userId.image}
                            alt={msg.userId.fullName}
                            className="avatar-img"
                          />
                        ) : (
                          (msg.userId?.fullName || "U")[0]
                        )}
                      </div>
                      <div className="message-content">
                        <div className="message-sender">
                          {msg.userId?.fullName || "Unknown"}
                        </div>
                        <p className="message-text">{msg.body}</p>
                        <div className="message-time">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <p className="empty-heading">No messages yet</p>
                    <p className="empty-text">
                      When people contact you about your items, you'll see their
                      messages here.
                    </p>
                  </div>
                )
              ) : notificationList && notificationList.length > 0 ? (
                notificationList.map((notification) => (
                  <div key={notification._id} className="notification-item">
                    <div className="notification-avatar">
                      {notification.userId?.image ? (
                        <img
                          src={notification.userId.image}
                          alt={notification.userId.fullName}
                          className="avatar-img"
                        />
                      ) : (
                        (notification.userId?.fullName || "N")[0]
                      )}
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">
                        {notification.title}
                      </p>
                      <p className="notification-text">{notification.body}</p>
                      <div className="notification-time">
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔔</div>
                  <p className="empty-heading">No notifications</p>
                  <p className="empty-text">
                    Stay updated with views, comments, and offers on your
                    listings.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
