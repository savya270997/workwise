import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import Modal from 'react-modal';
import { db } from '../../../firebase/firebaseconfig';
import './LeaveApproval.css';

Modal.setAppElement('#root');

const LeaveApproval = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [employeeNames, setEmployeeNames] = useState({});
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      const q = query(collection(db, 'timeoffreq'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);

      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setLeaveRequests(requests);
      setLoading(false);

      // Fetch employee names based on email
      requests.forEach(async (request) => {
        const employeeEmail = request.email;
        const employeeQuery = query(
          collection(db, 'users'),
          where('email', '==', employeeEmail)
        );
        const employeeSnapshot = await getDocs(employeeQuery);
        const employeeDoc = employeeSnapshot.docs[0];
        if (employeeDoc) {
          setEmployeeNames((prevNames) => ({
            ...prevNames,
            [employeeEmail]: employeeDoc.data().name,
          }));
        }
      });
    };

    fetchLeaveRequests();
  }, []);

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  const handleApprove = async (id) => {
    const requestRef = doc(db, 'timeoffreq', id);
    await updateDoc(requestRef, { status: 'approved' });
    setLeaveRequests(leaveRequests.filter((request) => request.id !== id));
  };

  const handleReject = (id) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (rejectReason.trim() === '') return;
    const requestRef = doc(db, 'timeoffreq', selectedRequestId);
    await updateDoc(requestRef, { status: 'rejected', reason: rejectReason });
    setLeaveRequests(leaveRequests.filter((request) => request.id !== selectedRequestId));
    setIsModalOpen(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRejectReason('');
    setSelectedRequestId(null);
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === 'next' ? prev + 1 : prev > 1 ? prev - 1 : prev
    );
  };

  const displayedRequests = leaveRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="leave-approval-container">
      <h2>Pending Leave Requests</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="leave-approval-table">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Total Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRequests.map((request) => (
              <tr key={request.id}>
                <td>{employeeNames[request.email] || request.email}</td>
                <td>{request.leaveType}</td>
                <td>{request.startDate}</td>
                <td>{request.endDate}</td>
                <td>{calculateTotalDays(request.startDate, request.endDate)}</td>
                <td>{request.status}</td>
                <td>
                  <FaCheckCircle
                    className="action-icon approve"
                    onClick={() => handleApprove(request.id)}
                  />
                  <FaTimesCircle
                    className="action-icon reject"
                    onClick={() => handleReject(request.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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

      {/* Modal for rejecting a request */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Reject Leave Request</h2>
        <textarea
          placeholder="Enter rejection reason"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="modal-buttons">
        <button className="btn-cancel" onClick={closeModal}>
            Cancel
          </button>
          <button className="reject-btn" onClick={handleRejectSubmit}>
            Reject
          </button>
          
        </div>
      </Modal>
    </div>
  );
};

export default LeaveApproval;