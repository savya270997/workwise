import React from 'react';
import {FaCodePullRequest, FaCheckDouble, FaBusinessTime, FaCalendarDays} from "react-icons/fa6";
import '../../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const TimeOffDashboard = () => {

const navigate = useNavigate();
  
const handleTimeOffReqClick=()=>{
    navigate('/timeoff-req');
  };

const handleLeaveApprovalsClick = () =>{
  navigate('/leave-approvals');
};

const handleLeaveHistoryClcik = () =>{
  navigate('/timeoff-history');
};



  return (
    <div className="dashboard">
      <div className="card" onClick={handleTimeOffReqClick}>
        <FaCodePullRequest size={48} />
        <div className="card-title">Request Time Off</div>
      </div>
      <div className="card" onClick={handleLeaveApprovalsClick}>
        <FaCheckDouble size={48} />
        <div className="card-title">Time Off Approval </div>
      </div> 
      <div className="card" onClick={handleLeaveHistoryClcik}>
        <FaBusinessTime size={48} />
        <div className="card-title">Leave History</div>
      </div> 
      <div className="card">
        <FaCalendarDays size={48} />
        <div className="card-title">Holidays Calendar</div>
      </div>  
    </div>
  );
};

export default TimeOffDashboard;
