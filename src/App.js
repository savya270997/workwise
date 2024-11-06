import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './Components/Login/index';
import Dashboard from './Components/Dashboard/index';
import Header from './Components/Header/index';
import JobPosting from './Components/JobPost/index'; 
import ViewJobPostings from './Components/ViewJobPostings/index'
import Drafts from './Components/DraftsJobs/index';
import ViewDraft from './Components/DraftsJobs/ViewDrafts';
import CreateEmployee from './Components/AddEmployee/index';
import AllEmployees from './Components/AllEmployees/index';
import Onboarding from './Components/Onboarding/OnboardingDashboard/index';
import OnboardingCandidates from './Components/Onboarding/OnboardingCandidates/index';
import EmployeeProfileSetup from './Components/Onboarding/EmployeeProfileSetup/index';
import DocumentSubmission from './Components/Onboarding/DocumentUpload/idex';
import PayrollDashboard from './Components/Payroll/Dashboard/PayrollDashboard';
import GeneratePayslip from './Components/Payroll/GeneratePayslip/GeneratePayslip';
import ProcessSuccesfull from './Components/ProcessSuccesfull/index';
import PaymentHistory from './Components/Payroll/PaymentHistory/index';
import SubmitComplaint from './Components/ComplaintSection/AddComplaint/index';
import ViewComplaint from './Components/ComplaintSection/ViewComplaint/index';
import Settings from './Components/Settings/index';
import TimesheetDashboard from './Components/Timesheets/TimesheetDashboard/index';
import FillTimesheet from './Components/Timesheets/FillTimesheet/index';
import PendingApprovals from './Components/Timesheets/PendingApprovals/index';
import TimesheetHistory from './Components/Timesheets/TimesheetHistory/index';
import TimeOffDashboard from './Components/TimeOff/TimeOffDashboard/index';
import RequestTimeOff from './Components/TimeOff/RequestTimeOff/index';
import LeaveApproval from './Components/TimeOff/TimeOffApprovals/index';
import LeaveHistory from './Components/TimeOff/LeaveHistory/index';
import OverviewPage from './Components/Overview/index';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // If user is not logged in and tries to access a route other than login, redirect to login
    if (!currentUser && location.pathname !== '/') {
      navigate('/');
    }
  }, [location, navigate]);

  return (
    <>
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-job-posting" element={<JobPosting />} />
        <Route path="/view-jobs" element={<ViewJobPostings />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/viewdraft/:id" element={<ViewDraft />} />
        <Route path='/createemployee' element={<CreateEmployee/>}/>
        <Route path='/allemployees' element={<AllEmployees/>}/>
        <Route path='/onboarding' element={<Onboarding/>}/>
        <Route path='/onboarding-candidates' element={<OnboardingCandidates/>}/>
        <Route path='/profile-setup' element={<EmployeeProfileSetup/>}/>
        <Route path='/document-submission' element={<DocumentSubmission/>}/>
        <Route path='/payroll-dashboard' element={<PayrollDashboard/>}/>
        <Route path='/generate-payslip' element={<GeneratePayslip/>}/>
        <Route path='/process-succesfull' element={<ProcessSuccesfull/>}/>
        <Route path='/payment-history' element={<PaymentHistory/>}/>
        <Route path='/add-complaint' element={<SubmitComplaint/>}/>
        <Route path='/view-complaint' element={<ViewComplaint/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/timesheet-dashboard' element={<TimesheetDashboard/>}/>
        <Route path='/fill-timesheet' element={<FillTimesheet/>}/>
        <Route path='/pending-approvals' element={<PendingApprovals/>}/>
        <Route path='/timesheet-history' element={<TimesheetHistory/>}/>
        <Route path='/timeoff-dashboard' element={<TimeOffDashboard/>}/>
        <Route path='/timeoff-req' element={<RequestTimeOff/>}/>
        <Route path='/leave-approvals' element={<LeaveApproval/>}/>
        <Route path='/timeoff-history' element={<LeaveHistory/>}/>
        <Route path='/overview' element={<OverviewPage/>}/>
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
