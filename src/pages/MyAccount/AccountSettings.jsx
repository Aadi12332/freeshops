import React, { useState, useEffect, useCallback, useContext } from "react";
import { getApi, putApi } from "../../Repository/Api";
import endPoints from "../../Repository/apiConfig";
import { BiLoaderCircle } from "react-icons/bi";
import "./Dashboard.css";
import ChangePasswordSection from "./ChangePasswordSection";
import NotificationSettings from "./NotificationSettings";
import { ThemeContext } from "../../Context/ThemeContext";
import Swal from "sweetalert2";

const AccountSettings = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [view, setView] = useState("account"); // "account" or "notifications"
  const [uploadingImage, setUploadingImage] = useState(false);

  // Theme from context
  const { theme, toggleTheme } = useContext(ThemeContext);

  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    retypePassword: "",
  });

  // 🔹 SweetAlert Dark Mode Styles
  const swalDarkOptions = {
    background: "#1e1e1e",
    color: "#fff",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    buttonsStyling: true,
  };

  // Fetch profile
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

  // Sync theme with backend data
  useEffect(() => {
    if (userData?.theme) {
      toggleTheme(userData.theme);
    }
  }, [userData?.theme, toggleTheme]);

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue || "");
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleSaveClick = async () => {
    if (!editingField) return;

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to update ${editingField}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      ...swalDarkOptions,
    });

    if (!confirm.isConfirmed) return;

    const payload = { [editingField]: tempValue };

    if (editingField === "fullName") {
      const nameParts = tempValue.split(" ");
      payload["firstName"] = nameParts[0] || "";
      payload["lastName"] = nameParts.slice(1).join(" ") || "";
    }

    Swal.fire({
      title: "Please wait...",
      text: "Your information is updating",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...swalDarkOptions,
    });

    try {
      await putApi(endPoints.account.updateProfile(), payload, {
        setResponse: (response) => {
          setUserData(response.data);
          Swal.fire("Updated!", `${editingField} updated successfully!`, "success", {
            ...swalDarkOptions,
          });
        },
      });
    } catch (error) {
      console.error("Failed to update:", error);
      Swal.fire("Error", `Failed to update ${editingField}.`, "error", {
        ...swalDarkOptions,
      });
    } finally {
      setEditingField(null);
      setTempValue("");
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.retypePassword) {
      Swal.fire("Error", "New passwords do not match.", "error", {
        ...swalDarkOptions,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
      ...swalDarkOptions,
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Please wait...",
      text: "Your password is updating",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...swalDarkOptions,
    });

    try {
      // Call password update API here
      console.log("Changing password with:", passwordFormData);

      Swal.fire("Updated!", "Password Updated Successfully!", "success", {
        ...swalDarkOptions,
      });
      setIsChangingPassword(false);
      setPasswordFormData({ oldPassword: "", newPassword: "", retypePassword: "" });
    } catch (error) {
      Swal.fire("Error", "Failed to update password.", "error", {
        ...swalDarkOptions,
      });
    }
  };

  // Profile image upload
  const fileInputRef = React.useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);

    Swal.fire({
      title: "Please wait...",
      text: "Your profile image is updating",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...swalDarkOptions,
    });

    try {
      await putApi(endPoints.account.updateProfile(), formData, {
        setResponse: (response) => {
          setUserData(response.data);
          Swal.fire("Updated!", "Profile image updated successfully!", "success", {
            ...swalDarkOptions,
          });
        },
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      Swal.fire("Error", "Failed to update profile image.", "error", {
        ...swalDarkOptions,
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Theme change handler
  const handleThemeChange = async (newTheme) => {
    const confirm = await Swal.fire({
      title: "Change Theme?",
      text: `Do you want to switch to ${newTheme} mode?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
      ...swalDarkOptions,
    });

    if (!confirm.isConfirmed) return;

    Swal.fire({
      title: "Please wait...",
      text: "Your theme is updating",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      ...swalDarkOptions,
    });

    try {
      await putApi(endPoints.account.updateProfile(), { theme: newTheme }, {
        setResponse: (response) => {
          setUserData(response.data);
        },
      });
      toggleTheme(newTheme);
      Swal.fire("Updated!", "Theme changed successfully!", "success", {
        ...swalDarkOptions,
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
      Swal.fire("Error", "Could not update theme, try again.", "error", {
        ...swalDarkOptions,
      });
    }
  };

  const EditableField = ({ fieldName, label, value }) => {
    const isEditing = editingField === fieldName;
    return (
      <div className="account-row">
        {isEditing ? (
          <>
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <div className="edit-actions">
              <button onClick={handleSaveClick} className="action-link save">
                Save
              </button>
              <button onClick={handleCancelClick} className="action-link cancel">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="field-info">
              <span className="field-label">{label}</span>
              <span>{value || "Not provided"}</span>
            </div>
            <button
              onClick={() => handleEditClick(fieldName, value)}
              className="action-link"
            >
              Edit
            </button>
          </>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading_container">
        <BiLoaderCircle className="spinner" />
      </div>
    );
  }

  if (!userData) {
    return <p>Could not load user data.</p>;
  }

  return (
    <div className="account-settings-container">
      {view === "account" && (
        <>
          <div className="account-header">
            <img
              src={userData.image || "https://via.placeholder.com/80"}
              alt="profile"
              className={`profile-pic ${uploadingImage ? "opacity-50" : "cursor-pointer"}`}
              onClick={handleImageClick}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="location-info">{userData.location}</div>
          </div>

          <h2 className="account-title">Account</h2>
          <div className="account-fields">
            <EditableField fieldName="fullName" label="Name" value={userData.fullName} />
            <EditableField fieldName="email" label="Email" value={userData.email} />
            <EditableField fieldName="location" label="Location" value={userData.location} />
            <EditableField fieldName="phone" label="Phone" value={userData.phone} />
            <div className="account-row">
              <div className="field-info">
                <span className="field-label">Password</span>
                <span>••••••••</span>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="action-link"
                >
                  Edit
                </button>
              )}
            </div>
            {isChangingPassword && (
              <div className="password-change-wrapper">
                <ChangePasswordSection
                  formData={passwordFormData}
                  handleInputChange={handlePasswordInputChange}
                  handlePasswordChange={handlePasswordSubmit}
                />
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="action-link cancel"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Theme Section */}
          <div className="account-section">
            <h2 className="section-title">Color theme</h2>
            <div className="radio-option">
              <input
                type="radio"
                id="light-mode"
                name="theme"
                value="light"
                checked={theme === "light"}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <label htmlFor="light-mode">Light mode</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="dark-mode"
                name="theme"
                value="dark"
                checked={theme === "dark"}
                onChange={(e) => handleThemeChange(e.target.value)}
              />
              <label htmlFor="dark-mode">Dark mode</label>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="account-section">
            <h2 className="section-title">Notifications</h2>
            <div className="account-row">
              <div className="field-info">
                <span>Notification preferences</span>
              </div>
              <button
                onClick={() => setView("notifications")}
                className="action-link"
              >
                Manage
              </button>
            </div>
          </div>
        </>
      )}

      {view === "notifications" && (
        <NotificationSettings
          title="Notification Settings"
          onClose={() => setView("account")}
        />
      )}
    </div>
  );
};

export default AccountSettings;
