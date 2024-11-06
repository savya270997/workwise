import React from 'react';
import './Modal.css'; 

const Modal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Company Policies & Agreements</h2>
        <p>Welcome to the company! Please review the following policies and agreements:</p>
        <div className="modal-body">
          <h3>Company Policies</h3>
          <ul className="list-modal">
            <li>Policy 1: Workplace Behavior</li>
            <li>Policy 2: Attendance and Punctuality</li>
            <li>Policy 3: Confidentiality Agreement</li>
            <li>Policy 4: Harassment and Discrimination</li>
          </ul>
          <h3>Employee Agreement</h3>
          <p>By agreeing, you confirm that you have read and understood the company's policies and agree to adhere to them.</p>
        </div>
        <div className="modal-footer">
          <button className="modal-button cancel" onClick={onClose}>Cancel</button>
          <button className="modal-button confirm" onClick={() => {
            alert('Confirmed and sent!');
            onClose();
          }}>Confirm and Send</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;