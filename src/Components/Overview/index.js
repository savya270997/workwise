import React, { useEffect, useState } from 'react';
import { FaUsers, FaCalendarAlt, FaCheck, FaTimes, FaHourglassHalf } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './OverviewPage.css';

const COLORS = ['#173b45','#b43f3f','#ff8225','#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA4643', '#89A54E'];

const OverviewPage = () => {
  const [timesheetData, setTimesheetData] = useState({
    rejected: 0,
    approved: 0,
    pending: 0
  });
  const [jobPostingData, setJobPostingData] = useState({
    active: 0,
    inactive: 0
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalLeaveRequests, setTotalLeaveRequests] = useState(0);
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState(0);
  const [approvedLeaveRequests, setApprovedLeaveRequests] = useState(0);
  const [rejectedLeaveRequests, setRejectedLeaveRequests] = useState(0);
  const [holidays, setHolidays] = useState(0);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [leaveTrendsData, setLeaveTrendsData] = useState([]);
  const [complaintsData, setComplaintsData] = useState([]); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts for rejected, approved, and pending timesheets
        const rejectedSnapshot = await getDocs(collection(db, 'rejectedtimesheets'));
        const approvedSnapshot = await getDocs(collection(db, 'approvedtimesheets'));
        const pendingSnapshot = await getDocs(collection(db, 'timesheets'));

        const rejectedCount = rejectedSnapshot.size;
        const approvedCount = approvedSnapshot.size;
        const pendingCount = pendingSnapshot.size;

        setTimesheetData({
          rejected: rejectedCount,
          approved: approvedCount,
          pending: pendingCount
        });

        // Fetch job postings data
        const jobPostingSnapshot = await getDocs(collection(db, 'jobPostings'));
        const jobPostings = jobPostingSnapshot.docs.map(doc => doc.data());
        const activeCount = jobPostings.filter(posting => posting.status === 'active').length;
        const inactiveCount = jobPostings.filter(posting => posting.status === 'inactive').length;
        const draftjobs = await getDocs(collection(db, 'draftJobPostings'));
        const draftCount = draftjobs.size;

        setJobPostingData({
          active: activeCount,
          inactive: inactiveCount,
          drafts:draftCount
        });

        // Fetch total employees
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        setTotalEmployees(employeesSnapshot.size);

        // Fetch leave requests
        const timeoffSnapshot = await getDocs(collection(db, 'timeoffreq'));
        const leaveRequests = timeoffSnapshot.docs.map(doc => doc.data());
        setTotalLeaveRequests(leaveRequests.length);

        // Count leave requests by status
        const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
        const approvedLeaves = leaveRequests.filter(req => req.status === 'approved').length;
        const rejectedLeaves = leaveRequests.filter(req => req.status === 'rejected').length;

        setPendingLeaveRequests(pendingLeaves);
        setApprovedLeaveRequests(approvedLeaves);
        setRejectedLeaveRequests(rejectedLeaves);

        // Fetch holidays count
        const holidaysSnapshot = await getDocs(collection(db, 'holidays'));
        setHolidays(holidaysSnapshot.size);

        // Prepare leave type distribution data
        const leaveTypes = leaveRequests.reduce((acc, req) => {
          acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
          return acc;
        }, {});
        const leaveTypeChartData = Object.keys(leaveTypes).map(type => ({
          name: type,
          value: leaveTypes[type],
        }));
        setLeaveTypeData(leaveTypeChartData);

        // Prepare leave trends data by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendsData = leaveRequests.reduce((acc, req) => {
          const [year, month] = req.startDate.split('-'); // Extract year and month from 'YYYY-MM-DD'
          const monthName = months[parseInt(month, 10) - 1]; // Convert 'MM' to month name

          const key = `${year}-${monthName}`; // Combine year and month for the x-axis
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        const leaveTrendsChartData = Object.keys(trendsData).map(date => ({
          date,
          count: trendsData[date],
        }));
        setLeaveTrendsData(leaveTrendsChartData);

        // Fetch complaints data
        const complaintsSnapshot = await getDocs(collection(db, 'complaints'));
        const complaints = complaintsSnapshot.docs.map(doc => doc.data());

        // Count complaints by type
        const complaintsCount = complaints.reduce((acc, complaint) => {
          acc[complaint.complaintType] = (acc[complaint.complaintType] || 0) + 1;
          return acc;
        }, {});
        const complaintsChartData = Object.keys(complaintsCount).map(type => ({
          name: type,
          count: complaintsCount[type],
        }));
        setComplaintsData(complaintsChartData);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const timesheetDataChart = [
    { name: 'Rejected', count: timesheetData.rejected },
    { name: 'Approved', count: timesheetData.approved },
    { name: 'Pending', count: timesheetData.pending },
  ];

  const jobPostingDataChart = [
    { name: 'Active', count: jobPostingData.active },
    { name: 'Inactive', count: jobPostingData.inactive },
    { name:'Drafts', count:jobPostingData.drafts },
  ];

  return (
    <div className="overview-page-container">
      <h2>Overview</h2>
      <div className="stats-cards-container">
      <div className="stat-card">
  <FaUsers className="stat-icon-users" />
  <h3>Total Employees</h3>
  <p>{totalEmployees}</p>
</div>
<div className="stat-card">
  <FaCalendarAlt className="stat-icon-holidays" />
  <h3>Total Holidays</h3>
  <p>{holidays}</p>
</div>

<div className="stat-card">
  <FaHourglassHalf className="stat-icon-pending" />
  <h3>Pending Leave Requests</h3>
  <p>{pendingLeaveRequests}</p>
</div>
<div className="stat-card">
  <FaCalendarAlt className="stat-icon-leave-requests" />
  <h3>Total Leave Requests</h3>
  <p>{totalLeaveRequests}</p>
</div>
<div className="stat-card">
  <FaCheck className="stat-icon-approved" />
  <h3>Approved Leave Requests</h3>
  <p>{approvedLeaveRequests}</p>
</div>
<div className="stat-card">
  <FaTimes className="stat-icon-rejected" />
  <h3>Rejected Leave Requests</h3>
  <p>{rejectedLeaveRequests}</p>
</div>

      </div>

      <div className="charts-container">
      <div className='chart'> 
          <h3>Job Postings Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobPostingDataChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {jobPostingDataChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h3>Leave Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leaveTypeData}
                dataKey="value"
                nameKey="name"
                fill="#8884d8"
                label
              >
                {leaveTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h3>Leave Requests Trends (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={leaveTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#b43f3f" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='chart'> 
          <h3>Timesheet Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timesheetDataChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {timesheetDataChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
         

 </ResponsiveContainer>
        </div>  
        <div className='chart'> 
          <h3>Complaints Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count">
                {complaintsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;