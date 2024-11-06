import React from 'react';
import {FaFill, FaAlignJustify, FaBackward} from 'react-icons/fa';
import '../../Dashboard/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const TimesheeetDashboard = () => {
  const navigate = useNavigate();
  const handleFillClick=()=>{
    navigate('/fill-timesheet');
  };

const handlePendinApprovalsClick = () =>{
  navigate('/pending-approvals');
};

const handleTimesheetHistoryClcik = () =>{
  navigate('/timesheet-history');
};

  return (
    <div className="dashboard">
      <div className="card" onClick={handleFillClick}>
        <FaFill size={48} />
        <div className="card-title">Fill Timesheet</div>
      </div>
      <div className="card" onClick={handlePendinApprovalsClick}>
        <FaAlignJustify size={48} />
        <div className="card-title">Pending Approvals</div>
      </div> 
      <div className="card" onClick={handleTimesheetHistoryClcik}>
        <FaBackward size={48} />
        <div className="card-title">Timesheet History</div>
      </div>   
    </div>
  );
};

export default TimesheeetDashboard;
