// NotificationSettings.js
import React, { useCallback, useEffect, useState } from "react";
import "./NotificationSettings.css";
import NotificationSettingsPopup from "./NotificationSettingsPopup";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import endPoints from "../../Repository/apiConfig";
import { getApi } from "../../Repository/Api";

// ✅ Updated data with real backend keys
const data = [
  {
    section: "Jobs",
    description: "Important updates about jobs you are seeking or have posted",
    options: [
      {
        name: "New Job Alerts",
        keyPrefix: "newJob",
        backendKeys: { email: "newJobEmail",inApp:"newJob" },
        channels: ["email","inApp"],
      },
    ],
  },
  {
    section: "Cart",
    description: "Updates about your shopping cart",
    options: [
      {
        name: "Cart Item Expired",
        backendKeys: { inApp: "cartItemExpired" },
        channels: ["inApp"],
      },
    ],
  },
  {
    section: "Products",
    description: "Updates when new products are added",
    options: [
      {
        name: "Product Added",
        backendKeys: { inApp: "productAdded" },
        channels: ["inApp"],
      },
    ],
  },
  {
    section: "Community",
    description: "Community-related updates",
    options: [
      {
        name: "Blog Updates",
        backendKeys: { inApp: "blog" },
        channels: ["inApp"],
      },
    ],
  },
{
  section: "Chat Messages",
  description: "Important updates about your chat conversations",
  options: [
    {
      name: "Chat Messages",
      keyPrefix: "chatMessages",
      channels: ["inApp"],
      backendKeys: { inApp: "chatMessagesInAppPushNotification" },
    },
  ],
},

];

const NotificationSettings = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(() => {
    setIsLoading(true);
    getApi(endPoints.account.getProfile(), {
      setResponse: (data) => {
        setUserData(data.data);
        setIsLoading(false);
      },
      setError: (err) => {
        console.error(err);
        setIsLoading(false);
      },
    });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const { updateNotificationSettings } = useStripeCheckout();

  return (
    <div className="settings-container">
      {data.map((section, idx) => (
        <div key={idx} className="section">
          <h2>{section.section}</h2>
          <p>{section.description}</p>
          {section.options.map((opt, i) => (
            <div key={i} className="option">
              <span>{opt.name}</span>
              <button onClick={() => setSelectedOption(opt)}>Edit</button>
            </div>
          ))}
        </div>
      ))}

      {selectedOption && userData && (
        <NotificationSettingsPopup
          option={selectedOption}
          userData={userData}
          onClose={() => setSelectedOption(null)}
          updateNotificationSettings={updateNotificationSettings}
          onUpdateSuccess={fetchProfile}
        />
      )}
    </div>
  );
};

export default NotificationSettings;
