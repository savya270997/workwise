import React, { useState, useEffect } from 'react';
import './TimesheetHistory.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig'; // Firebase config

const TimesheetHistory = () => {
  const [timesheetHistory, setTimesheetHistory] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userEmail = currentUser.email; // Get the logged-in user's email

  // Fetch timesheet history
  useEffect(() => {
    const fetchTimesheetHistory = async () => {
      const timesheetData = [];

      // Fetch from 'timesheets' (Pending)
      const timesheetQuery = query(collection(db, 'timesheets'), where('email', '==', userEmail));
      const timesheetSnapshot = await getDocs(timesheetQuery);
      timesheetSnapshot.forEach((doc) => {
        timesheetData.push({ id: doc.id, ...doc.data(), status: 'Pending' });
      });

      // Fetch from 'approvedtimesheets' (Approved)
      const approvedQuery = query(collection(db, 'approvedtimesheets'), where('email', '==', userEmail));
      const approvedSnapshot = await getDocs(approvedQuery);
      approvedSnapshot.forEach((doc) => {
        timesheetData.push({ id: doc.id, ...doc.data(), status: 'Approved' });
      });

      // Fetch from 'rejectedtimesheets' (Rejected)
      const rejectedQuery = query(collection(db, 'rejectedtimesheets'), where('email', '==', userEmail));
      const rejectedSnapshot = await getDocs(rejectedQuery);
      rejectedSnapshot.forEach((doc) => {
        timesheetData.push({ id: doc.id, ...doc.data(), status: 'Rejected' });
      });

      setTimesheetHistory(timesheetData);
    };

    fetchTimesheetHistory();
  }, [userEmail]);

  return (
    <div className="timesheet-history-container">
      <h2>Timesheet History</h2>

      {/* Timesheet History Table */}
      <table className="timesheet-history-table">
        <thead>
          <tr>
            <th>Week</th>
            <th>Total Hours</th>
            <th>Submitted On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {timesheetHistory.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>
                {timesheet.weekStart} - {timesheet.weekEnd}
              </td>
              <td>{timesheet.totalHours} hrs</td>
              <td>{new Date(timesheet.timestamp.toDate()).toLocaleString()}</td>
              <td>
                <span
                  className={`status-badge ${
                    timesheet.status === 'Approved'
                      ? 'green-badge'
                      : timesheet.status === 'Rejected'
                      ? 'red-badge'
                      : 'yellow-badge'
                  }`}
                >
                  {timesheet.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetHistory;