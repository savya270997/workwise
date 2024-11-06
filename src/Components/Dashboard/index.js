import React from 'react';
import { FaCalendarCheck, FaRegChartBar, FaPlane, FaCogs } from 'react-icons/fa';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // If currentUser is not available, fallback to 'Guest'
  const userName = currentUser ? currentUser.name : "Guest";

  const handleSettingsClick=()=>{
    navigate('/settings'); 
  };

  const handleTimesheetClick=()=>{
    navigate('/timesheet-dashboard');
  };

  const handleTimeOffClick=()=>{
    navigate('/timeoff-dashboard');
  };

  const handleOverviewClick=()=>{
    navigate('/overview');
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div className="dashboard">
     <div className="card-two">
     <div className="bg"><span className='card-title'>HI,</span><div className='card-title'>{getGreeting()}</div>
     <div className='card-title'>{userName}</div></div>
     <div className ="blob"></div>
        
      </div>
      <div className="card" onClick={handleOverviewClick}>
        <FaRegChartBar size={48} />
        <div className="card-title">Overview</div>
      </div>
      <div className="card" onClick={handleTimesheetClick}>
        <FaCalendarCheck size={48} />
        <div className="card-title">Timesheets</div>
      </div>
      <div className="card" onClick={handleTimeOffClick}>
        <FaPlane size={48} />
        <div className="card-title">Timeoffs</div>
      </div>
      <div className="card" onClick={handleSettingsClick}> 
        <FaCogs size={48} />
        <div className="card-title">Settings</div>
      </div>
    </div>
  );
};

export default Dashboard;
