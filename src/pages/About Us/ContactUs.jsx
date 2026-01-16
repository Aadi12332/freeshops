/** @format */
import React, { useState, useRef } from "react";
import axios from "axios";
import "./ContactUs.css";

// Lucide icons
import { MapPin, Phone, Mail } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("message", formData.message);
      if (formData.image) {
        fd.append("image", formData.image);
      }

      await axios.post(`${BASE_URL}api/v1/user/sendInquire`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus({ type: "success", message: "Inquiry sent successfully!" });
      setFormData({ name: "", email: "", message: "", image: null });

      // Reset file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Failed to send inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔹 Header Banner */}
      <div className="contact-header-banner">
        <div className="banner-bg-layer layer-1"></div>
        <div className="banner-bg-layer layer-2"></div>
        <div className="banner-bg-layer layer-3"></div>
        <h1>Contact Us</h1>
      </div>

      {/* 🔹 Contact Container */}
      <div className="contact-container">
        <div className="contact-content">
          {/* Left Side: Contact Info */}
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>If you have any queries, feel free to reach out:</p>
            <ul>
              <li>
                <MapPin size={20} /> 123 Main Street, New Delhi, India
              </li>
              <li>
                <Phone size={20} /> +91 98765 43210
              </li>
              <li>
                <Mail size={20} /> support@example.com
              </li>
            </ul>
          </div>

          {/* Right Side: Contact Form */}
          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  ref={fileInputRef}
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Inquiry"}
              </button>
            </form>

            {/* Status Message */}
            {status.message && (
              <p
                className={`status-message ${
                  status.type === "success" ? "success" : "error"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
