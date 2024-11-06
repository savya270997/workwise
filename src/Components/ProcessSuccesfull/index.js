import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import './ProcessSuccessful.css'; 

const ProcessSuccessful = () => {
  const navigate = useNavigate();

  const handleReturnToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard route
  };

  return (
    <div className="success-container">
      <FaCheckCircle className="success-icon" />
      <h2>Successfully done!</h2>
      <p>Your process was completed successfully.</p>
      <button className="return-button" onClick={handleReturnToDashboard}>
        Return to Dashboard
      </button>
    </div>
  );
};

export default ProcessSuccessful;