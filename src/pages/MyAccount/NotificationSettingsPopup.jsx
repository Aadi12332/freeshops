// NotificationSettingsPopup.js
import React, { useState, useEffect } from "react";
import "./NotificationSettingsPopup.css";

// Helper to generate the correct backend key (fallback if no custom key provided)
const generateBackendKey = (keyPrefix, channelType) => {
  const keyMap = {
    inApp: `${keyPrefix}InAppPushNotification`,
    email: `${keyPrefix}Email`,
    push: `${keyPrefix}PushNotification`,
  };
  return keyMap[channelType];
};

const ToggleSwitch = ({ isOn, handleToggle }) => {
  const trackClassName = `notification-popup-toggle-track ${isOn ? "active" : ""}`;
  const thumbClassName = `notification-popup-toggle-thumb ${isOn ? "active" : ""}`;

  return (
    <div className={trackClassName} onClick={handleToggle}>
      <div className={thumbClassName} />
    </div>
  );
};

const NotificationSettingsPopup = ({
  option,
  userData,
  onClose,
  updateNotificationSettings,
  onUpdateSuccess,
}) => {
  const [settings, setSettings] = useState({
    inAppAndPush: false,
    email: false,
    push: false,
  });

  // Initialize from userData
  useEffect(() => {
    if (!option || !userData) return;

    const initialSettings = {
      inAppAndPush: !!userData[
        option.backendKeys?.inApp || generateBackendKey(option.keyPrefix, "inApp")
      ],
      email: !!userData[
        option.backendKeys?.email || generateBackendKey(option.keyPrefix, "email")
      ],
      push: !!userData[
        option.backendKeys?.push || generateBackendKey(option.keyPrefix, "push")
      ],
    };

    setSettings(initialSettings);
  }, [option, userData]);

  // Toggle and update logic
  const handleToggleAndUpdate = async (settingKey) => {
    const newValue = !settings[settingKey];
    setSettings((prev) => ({ ...prev, [settingKey]: newValue }));

    let channelType;
    if (settingKey === "inAppAndPush") channelType = "inApp";
    else if (settingKey === "email") channelType = "email";
    else if (settingKey === "push") channelType = "push";
    else return;

    // Prefer custom backend key
    const backendKey =
      option.backendKeys?.[channelType] ||
      generateBackendKey(option.keyPrefix, channelType);

    const payload = { [backendKey]: newValue };

    try {
      console.log("Updating setting:", payload);
      await updateNotificationSettings(payload);
      onUpdateSuccess();
    } catch (error) {
      console.error("Failed to update setting:", error);
      setSettings((prev) => ({ ...prev, [settingKey]: !newValue }));
    }
  };

  if (!option) return null;

  return (
    <div className="notification-popup-backdrop" onClick={onClose}>
      <div className="notification-popup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-popup-modal-header">
          <h2 className="notification-popup-modal-title">{option.name}</h2>
          <button className="notification-popup-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="notification-popup-modal-description">
          Recommendations for items based on your interests and activity
        </p>

        {option.channels.includes("inApp") && (
          <div className="notification-popup-toggle-option">
            <div>
              <div className="notification-popup-toggle-label-main">
                In-app & Push notifications
              </div>
            </div>
            <ToggleSwitch
              isOn={settings.inAppAndPush}
              handleToggle={() => handleToggleAndUpdate("inAppAndPush")}
            />
          </div>
        )}

        {option.channels.includes("email") && (
          <div className="notification-popup-toggle-option">
            <div>
              <div className="notification-popup-toggle-label-main">Email</div>
              {!settings.email && (
                <div className="notification-popup-toggle-label-sub">
                  You will not receive emails.
                </div>
              )}
            </div>
            <ToggleSwitch
              isOn={settings.email}
              handleToggle={() => handleToggleAndUpdate("email")}
            />
          </div>
        )}

        {option.channels.includes("push") && (
          <div className="notification-popup-toggle-option">
            <div>
              <div className="notification-popup-toggle-label-main">Push notification</div>
            </div>
            <ToggleSwitch
              isOn={settings.push}
              handleToggle={() => handleToggleAndUpdate("push")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsPopup;
