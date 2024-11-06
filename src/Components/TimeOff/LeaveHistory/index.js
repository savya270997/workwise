import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';
import './LeaveHistory.css';

const LeaveHistory = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserEmail = currentUser.email;

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const q = query(collection(db, 'timeoffreq'), where('email', '==', currentUserEmail));
      const querySnapshot = await getDocs(q);

      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLeaveRequests(requests);
    };

    fetchLeaveHistory();
  }, [currentUserEmail]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === 'next' ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const displayedRequests = leaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <div className="leave-history-container">
      <h2>My Leave History</h2>
      <table className="leave-history-table">
        <thead>
          <tr>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Days</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.leaveType}</td>
              <td>{request.startDate}</td>
              <td>{request.endDate}</td>
              <td>{Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24)) + 1}</td>
              <td>
                <span className={`status-pill ${getStatusClass(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <FaChevronLeft
          className={`pagination-icon ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange('prev')}
        />
        <span>Page {currentPage}</span>
        <FaChevronRight
          className={`pagination-icon ${displayedRequests.length < itemsPerPage ? 'disabled' : ''}`}
          onClick={() => handlePageChange('next')}
        />
      </div>
    </div>
  );
};

export default LeaveHistory;