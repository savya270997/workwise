import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './PendingApprovals.css';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig'; 
import { deleteDoc, doc } from 'firebase/firestore'; 

Modal.setAppElement('#root');

const PendingApprovals = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(''); // 'approve' or 'reject'
  const [rejectReason, setRejectReason] = useState('');

  const recordsPerPage = 10;

  // Fetch submitted timesheets
  useEffect(() => {
    const fetchTimesheets = async () => {
      const querySnapshot = await getDocs(collection(db, 'timesheets'));
      const timesheetData = [];
      querySnapshot.forEach((doc) => {
        timesheetData.push({ id: doc.id, ...doc.data() });
      });
      setTimesheets(timesheetData);
    };
    fetchTimesheets();
  }, []);

  // Open modal for approval/rejection
  const handleOpenModal = (timesheet, action) => {
    setModalData(timesheet);
    setModalAction(action);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRejectReason('');
  };

  // Handle approval or rejection of the timesheet
  const handleApprovalAction = async () => {
    if (modalAction === 'reject' && !rejectReason) {
      alert('Please provide a reason for rejection.');
      return;
    }
  
    const newDocData = {
      ...modalData,
      status: modalAction === 'approve' ? 'Approved' : 'Rejected',
      timestamp: new Date(),
      rejectReason: modalAction === 'reject' ? rejectReason : '',
    };
  
    try {
      // Define the collection name (approvedtimesheets or rejectedtimesheets)
      const collectionName = modalAction === 'approve' ? 'approvedtimesheets' : 'rejectedtimesheets';
      
      // Add the approved/rejected timesheet to the respective collection
      await addDoc(collection(db, collectionName), newDocData);
      
      // Delete the original timesheet from the 'timesheets' collection
      const timesheetRef = doc(db, 'timesheets', modalData.id); // Get reference to the timesheet document
      await deleteDoc(timesheetRef); // Delete the document
      
      // Update UI after deletion
      setTimesheets(timesheets.filter((sheet) => sheet.id !== modalData.id));
      
      alert(`Timesheet ${modalAction}ed successfully!`);
    } catch (error) {
      console.error(`Error ${modalAction}ing timesheet: `, error);
    } finally {
      setIsModalOpen(false);
      setRejectReason('');
    }
  };
  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = timesheets.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(timesheets.length / recordsPerPage);

  return (
    <div className="pending-approvals-container">
      <h2>Pending Timesheet Approvals</h2>

      {/* Timesheet Table */}
      <table className="pending-approvals-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Recorded Hours</th>
            <th>Week</th>
            <th>Submitted On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((timesheet) => (
            <tr key={timesheet.id}>
              <td>{timesheet.email}</td>
              <td>
                <span
                  className={`hours-badge ${
                    timesheet.totalHours < 45
                      ? 'red-badge'
                      : timesheet.totalHours === 45
                      ? 'green-badge'
                      : 'orange-badge'
                  }`}
                >
                  {timesheet.totalHours} hrs
                </span>
              </td>
              <td>
                {timesheet.weekStart} - {timesheet.weekEnd}
              </td>
              <td>{new Date(timesheet.timestamp.toDate()).toLocaleString()}</td>
              <td>
                <button onClick={() => handleOpenModal(timesheet, 'approve')} className="btn-approve">
                  Approve
                </button>
                <button onClick={() => handleOpenModal(timesheet, 'reject')} className="btn-reject">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={index + 1 === currentPage ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal for approval/rejection */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="approval-modal" overlayClassName="approval-modal-overlay">
        <div>
          <h2>{modalAction === 'approve' ? 'Approve Timesheet' : 'Reject Timesheet'}</h2>
          <p>Are you sure you want to {modalAction} this timesheet?</p>
          {modalAction === 'reject' && (
            <textarea
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          )}
          <button onClick={handleApprovalAction} className="btn-primary">
            Yes
          </button>
          <button onClick={handleCloseModal} className="btn-secondary">
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PendingApprovals;