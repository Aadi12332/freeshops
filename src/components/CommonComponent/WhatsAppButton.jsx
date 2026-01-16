import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const phoneNumber = "919876543210"; // replace with your WhatsApp number
  const message = "Hello, I want to chat with you!";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#25D366",
    borderRadius: "50%",
    padding: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
    cursor: "pointer",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out"
  };

  const iconStyle = {
    color: "white",
    fontSize: "32px"
  };

  return (
    <div
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <FaWhatsapp style={iconStyle} />
    </div>
  );
};

export default WhatsAppButton;
