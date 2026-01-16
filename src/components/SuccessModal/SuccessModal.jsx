import React, { useEffect } from 'react';
import './SuccessModal.css';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ isOpen, onClose, title = "Success!", message = "Operation Successfully applied" }) => {

  const navigate=useNavigate()
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
        navigate(-2); 

      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <div className="modal-text">
          <h3>Job </h3>
          <p>{message}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;