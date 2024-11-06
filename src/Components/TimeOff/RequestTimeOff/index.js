import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaRegCalendarCheck, FaInfoCircle, FaExclamationTriangle,FaBalanceScale } from "react-icons/fa";
import { MdFreeCancellation } from "react-icons/md";
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'; 
import { db } from '../../../firebase/firebaseconfig'; 
import './RequestTimeOff.css'; 

const RequestTimeOff = () => {
  const [leaveTypes, setLeaveTypes] = useState([
    { type: 'Sick Leave', count: 10 },
    { type: 'Vacation Leave', count: 15 },
    { type: 'Casual Leave', count: 5 }
  ]);
  const [selectedType, setSelectedType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveCount, setLeaveCount] = useState(0);
  const [warning, setWarning] = useState('');
  const [email, setEmail] = useState('');
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [status,setStatus]=useState('pending');

  // Get current user's email from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setEmail(currentUser.email);
    }

    const fetchLeavePolicies = async () => {
      // Assuming you are fetching these from Firebase or static definition
      const policies = [
        { type: 'Sick Leave', description: 'For illness or medical needs', allowedDays: 10 },
        { type: 'Annual Leave', description: 'For personal or vacation days', allowedDays: 20 },
        { type: 'Maternity Leave', description: 'For childbirth and care', allowedDays: 90 },
      ];
      setLeavePolicies(policies);
    };

    fetchLeavePolicies();
  }, []);

  // Function to calculate days between two dates
  const calculateLeaveDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const difference = endDate - startDate;
    return Math.ceil(difference / (1000 * 3600 * 24)) + 1; // Including the end date
  };

  // Handle form changes
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setWarning('');
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    updateLeaveCount(e.target.value, endDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    updateLeaveCount(startDate, e.target.value);
  };

  // Update leave count and check if it exceeds available balance
  const updateLeaveCount = (start, end) => {
    if (start && end) {
      const requestedDays = calculateLeaveDays(start, end);
      setLeaveCount(requestedDays);
      const selectedLeaveType = leaveTypes.find((type) => type.type === selectedType);

      if (requestedDays > selectedLeaveType.count) {
        setWarning(`You only have ${selectedLeaveType.count} days of ${selectedType} remaining.`);
      } else {
        setWarning('');
      }
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const requestedDays = calculateLeaveDays(startDate, endDate);
    const selectedLeaveType = leaveTypes.find((type) => type.type === selectedType);

    if (requestedDays > selectedLeaveType.count) {
      alert(`You cannot request more than ${selectedLeaveType.count} days of ${selectedType}.`);
      return;
    }

    try {
      // Save to Firebase under 'timeoffreq' collection
      await addDoc(collection(db, 'timeoffreq'), {
        email,
        leaveType: selectedType,
        startDate,
        endDate,
        reason,
        leaveCount: requestedDays,
        timestamp: new Date(),
        status,
      });

      // Update leave balance locally after submission
      setLeaveTypes(prevTypes =>
        prevTypes.map(type =>
          type.type === selectedType ? { ...type, count: type.count - requestedDays } : type
        )
      );

      alert('Leave request submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave request: ', error);
      alert('There was an error submitting your request. Please try again.');
    }
  };

  return (
    <div className="request-timeoff-container">
      <div className="form-section">
        <form className="request-timeoff-form">
        <h3><FaRegCalendarCheck className="calendar-icon"/> Request Time Off</h3>
          <label>
            Leave Type:
            <select value={selectedType} onChange={handleTypeChange}>
              {leaveTypes.map((type) => (
                <option key={type.type} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Date:
            <input type="date" value={startDate} onChange={handleStartDateChange} />
          </label>

          <label>
            End Date:
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </label>

          <label>
            Reason:
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for leave" />
          </label>

          {warning && <p className="warning"><FaExclamationTriangle /> {warning}</p>}

          <button type="button" onClick={handleSubmit}>Submit Request</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h3><FaInfoCircle className="bonus-icon" /> Leave Balance Dashboard</h3>
        <div className="leave-balance-info">
          {leaveTypes.map((type) => (
            <div key={type.type} className="leave-balance-item">
              <p><strong>{type.type}</strong>: {type.count} days remaining</p>
            </div>
          ))}
        </div>
      </div>
      <div className='basic'><div className="leave-policies-container">
        <h3><FaBalanceScale className="error-icon" /> Leave Policies</h3>
        <ul>
          {leavePolicies.map((policy, index) => (
            <li key={index}>
              <strong>{policy.type}:</strong> {policy.description} - <em>{policy.allowedDays} days allowed</em>
            </li>
          ))}
        </ul>
      </div>
      <div className="leave-policies-container">
        <h3><MdFreeCancellation className="dollar-icon" /> Upcoming Holidays</h3>
        <ul>
          
            <li>
              <strong>Holiday 1:</strong> Holiday Name.
            </li>
            <li>
            <strong>Holiday 2:</strong> Holiday Name.
          </li>
          <li>
            <strong>Holiday 3:</strong> Holiday Name.
          </li>
         
        </ul>
      </div>
      </div>
      
    </div>
  );
};

export default RequestTimeOff;