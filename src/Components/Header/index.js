import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUsers, FaMoneyCheckAlt, FaEnvelopeOpenText, FaSignOutAlt, FaCogs } from 'react-icons/fa';
import logo from '../../Images/logo.png';
const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };  
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateJobPosting = () => {
    navigate('/create-job-posting');
  };

  const handleDashboard = () =>{
    navigate('/dashboard');
  };

  const handleAllEmployees=()=>{
    navigate('/allemployees');
  };

  const handleViewJobPostings=()=>{
    navigate('/view-jobs');
  };

const handleDrafts=()=>{
  navigate('/drafts');
};

const handleCreateEmployee=()=>{
  navigate('/createemployee');
};

const handleOnboardingClick=()=>{
  navigate('/onboarding-candidates');
};

const handlePayrollDashboardClick=()=>{
  navigate('/payroll-dashboard');
}

const handlePaymentHistoryClick=()=>{
  navigate('/payment-history');
};

const handleAddComplaintClick=()=>{
  navigate('/add-complaint');
};

const handleGeneraetPaySlipClick=()=>{
  navigate('generate-payslip');
}

const handleViewComplaintsClick=()=>{
  navigate('/view-complaint');
};



  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="container">
      <div id="logo" onClick={handleDashboard}>
        <img src={logo} alt='Logo' />
        
      </div>
      <div id="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ul id="menu" className={isOpen ? 'open' : ''}>
        <li><a href="#" onClick={handleDashboard}><FaUsers /> Dashboard</a>
        </li>
        <li><a href="#"><FaEnvelopeOpenText /> Job Postings</a>
          <ul>
          <li><a href="#" onClick={handleCreateJobPosting}>Create New Posting</a></li>
            <li><a href="#" onClick={handleViewJobPostings}>View All Postings</a></li>
            <li><a href="#" onClick={handleDrafts}>Drafts</a></li>
          </ul>
        </li>
        <li><a href="#"><FaUsers /> Employee Management</a>
          <ul>
            <li><a href="#" onClick={handleAllEmployees}> All Employees</a></li>
            <li><a href="#" onClick={handleCreateEmployee}>Add New Employee</a></li>
            <li><a href="#" onClick={handleOnboardingClick}>Onboarding</a></li>
            <li><a href="#">Exit Process</a></li>
          </ul>
        </li>
       
        <li><a href="#"><FaMoneyCheckAlt /> Payroll</a>
          <ul>
            <li><a href="#" onClick={handlePayrollDashboardClick}>Payroll Summary</a></li>
            <li><a href="#" onClick={handleGeneraetPaySlipClick}>Generate Payslips</a></li>
            <li><a href="#" onClick={handlePaymentHistoryClick}>View Payment History</a></li>
          </ul>
        </li>
        <li><a href="#"><FaEnvelopeOpenText /> Complaints</a>
          <ul>
          <li><a href="#" onClick={handleAddComplaintClick}>Add New Complaint</a></li>
            <li><a href="#" onClick={handleViewComplaintsClick}>View Complaints</a></li>
            
          </ul>
        </li>
        <li><a href="#" onClick={handleLogout}><FaSignOutAlt /> Logout</a></li>
      </ul>
    </div>
  );
};

export default Header;
