import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";

import notification_img from "../../assets/images/notification.png";
import "./NotificationPopup.css";

const NotificationPopup = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const popupRef = useRef(null);

  const { getNotificationList, notificationList, loading } =
    useStripeCheckout();

  // fetch data when popup is open & tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === "messages") {
        getNotificationList({ messageType: "Message" });
      } else {
        getNotificationList({ messageType: "Notification" });
      }
    }
  }, [isOpen, activeTab]);

  // handle click on message
  const handleAskClick = (data) => {
    if (!data) {
      console.error("Missing owner data for chat");
      return;
    }
    navigate("/chat", { state: { data } });
    setIsOpen(false); // close popup after click
  };

  // update messages/notifications when API finishes
  useEffect(() => {
    if (!loading && notificationList) {
      if (activeTab === "messages") {
        setMessages(notificationList);
      } else {
        setNotifications(notificationList);
      }
    }
  }, [notificationList, loading, activeTab]);

  // close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTogglePopup = () => setIsOpen(!isOpen);
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const NotificationItem = ({ item, type }) => (
    <div
      className="notification-item"
      onClick={() => {
        if (type === "messages") {
          handleAskClick(item);
        } else {
          console.log("Notification clicked:", item);
        }
      }}
    >
      <img
        src={item?.userId?.image}
        alt={item?.userId?.fullName}
        className="item-avatar"
      />
      <div className="item-content">
        <p className="item-title">{item.title}</p>
        <p className="item-body">{item.body}</p>
        <p className="item-timestamp">
          {new Date(item.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="notification-wrapper" ref={popupRef}>
      <div
        onClick={handleTogglePopup}
        className="logged-in-nav-item text-[#e25845] flex items-center mb-1 cursor-pointer"
      >
        <img src={notification_img} className="" alt="notification" />
        <span className="text-[12.8px]">inbox</span>
      </div>

      {isOpen && (
        <div className="notification-popup">
          {/* Tabs */}
          <div className="popup-tabs">
            <button
              className={`popup-tab ${
                activeTab === "messages" ? "active" : ""
              }`}
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </button>
            <button
              className={`popup-tab ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
          </div>

          {/* Content */}
          <div className="notification-content">
            {loading ? (
              <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "40vh", // full viewport height
    }}
  >
    <div
      style={{
        width: "50px",
        height: "50px",
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
            ) : (
              <>
                {/* Messages */}
                {activeTab === "messages" && (
                  <>
                    {messages.length === 0 ? (
                      <div className="notification-empty">
                        <h4 className="empty-state-title">
                          You have no messages
                        </h4>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <NotificationItem
                          key={msg._id}
                          item={msg}
                          type="messages"
                        />
                      ))
                    )}
                  </>
                )}

                {/* Notifications */}
                {activeTab === "notifications" && (
                  <>
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <h4 className="empty-state-title">
                          You have no notifications
                        </h4>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <NotificationItem
                          key={notif._id}
                          item={notif}
                          type="notifications"
                        />
                      ))
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="notification-footer">
            <a onClick={() => handleNavigate("/chat/inbox")}>
              View all {activeTab}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;
