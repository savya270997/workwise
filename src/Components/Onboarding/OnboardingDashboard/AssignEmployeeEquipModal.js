import React, { useState } from 'react';
import './AssignEmployeeModal.css'; // Make sure you have the necessary styles

const AssignEmployeeEquipModal = ({ onClose }) => {
  const [workType, setWorkType] = useState('');
  const [courierDetails, setCourierDetails] = useState({
    trackingLink: '',
    trackingNumber: '',
    devicesSent: ''
  });

  const handleWorkTypeChange = (e) => {
    setWorkType(e.target.value);
  };

  const handleCourierDetailChange = (e) => {
    const { name, value } = e.target;
    setCourierDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic here
    console.log('Work Type:', workType);
    console.log('Courier Details:', courierDetails);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assign Company Equipment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Work Type</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="workType"
                  value="office"
                  checked={workType === 'office'}
                  onChange={handleWorkTypeChange}
                />
                Office
              </label>
              <label>
                <input
                  type="radio"
                  name="workType"
                  value="workFromHome"
                  checked={workType === 'workFromHome'}
                  onChange={handleWorkTypeChange}
                />
                Work from Home
              </label>
            </div>
          </div>
          
          {workType === 'workFromHome' && (
            <div className="form-group">
              <label>Courier Details</label>
              <div>
                <label>
                  Tracking Link:
                  <input
                    type="text"
                    name="trackingLink"
                    value={courierDetails.trackingLink}
                    onChange={handleCourierDetailChange}
                  />
                </label>
                <label>
                  Tracking Number:
                  <input
                    type="text"
                    name="trackingNumber"
                    value={courierDetails.trackingNumber}
                    onChange={handleCourierDetailChange}
                  />
                </label>
                <label>
                  Devices Sent:
                  <input
                    type="text"
                    name="devicesSent"
                    value={courierDetails.devicesSent}
                    onChange={handleCourierDetailChange}
                  />
                </label>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignEmployeeEquipModal;