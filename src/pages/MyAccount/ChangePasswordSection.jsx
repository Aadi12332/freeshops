import React, { useState } from "react";
import { useStripeCheckout } from "../../Context/StripeCheckoutContext";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePasswordSection = () => {
  const { changePassWordAfterLogin } = useStripeCheckout();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    retypePassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    retype: false,
  });

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return {
        isValid: false,
        message: "Password must be at least 6 characters.",
      };
    }
    return { isValid: true };
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.retypePassword) {
      Swal.fire("Error", "New password and confirm password do not match.", "error");
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      Swal.fire("Error", validation.message, "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const payload = {
      password: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.retypePassword,
    };

    setIsLoading(true);

    Swal.fire({
      title: "Please wait...",
      text: "Your password is updating",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await changePassWordAfterLogin(payload);

      Swal.fire("Updated!", "Password changed successfully!", "success");

      setFormData({
        oldPassword: "",
        newPassword: "",
        retypePassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response && error.response.status === 403) {
        const errorMsg =
          error.response.data?.message || "Old password is incorrect";
        Swal.fire("Error", errorMsg, "error");
      } else {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "Failed to change password. Please try again.";
        Swal.fire("Error", errorMsg, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- STYLES ----------
  const containerStyle = {
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    maxWidth: "500px",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  };

  const groupStyle = {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#444",
  };

  const inputStyle = {
    padding: "10px 40px 10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
  };

  const eyeBtnStyle = {
    position: "absolute",
    top: "34px",
    right: "10px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666",
  };

  const saveBtnStyle = {
    marginTop: "10px",
    padding: "12px 18px",
    background: "#EF4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
  };

  // ---------- JSX ----------
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Change password:</h3>

      <div style={formStyle}>
        {/* Old Password */}
        <div style={groupStyle}>
          <label style={labelStyle}>Old password:</label>
          <input
            type={showPassword.old ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            placeholder="Enter your current password"
            required
            disabled={isLoading}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("old")}
            style={eyeBtnStyle}
          >
            {showPassword.old ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* New Password */}
        <div style={groupStyle}>
          <label style={labelStyle}>New password:</label>
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Enter your new password"
            required
            disabled={isLoading}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("new")}
            style={eyeBtnStyle}
          >
            {showPassword.new ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Re-type Password */}
        <div style={groupStyle}>
          <label style={labelStyle}>Re-type New password:</label>
          <input
            type={showPassword.retype ? "text" : "password"}
            name="retypePassword"
            value={formData.retypePassword}
            onChange={handleInputChange}
            placeholder="Confirm your new password"
            required
            disabled={isLoading}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("retype")}
            style={eyeBtnStyle}
          >
            {showPassword.retype ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        <button
          onClick={handlePasswordChange}
          style={saveBtnStyle}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordSection;
