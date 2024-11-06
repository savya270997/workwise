import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';
import { FaEye } from 'react-icons/fa';
import './ViewComplaint.css';

const ViewComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsCollection = collection(db, 'complaints');
        const snapshot = await getDocs(complaintsCollection);
        const complaintsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComplaints(complaintsList);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate the current complaints to be displayed
  const indexOfLastComplaint = currentPage * itemsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < Math.ceil(complaints.length / itemsPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleViewDetails = (complaintId) => {
    console.log(`View details for complaint ID: ${complaintId}`);
  };

  return (
    <div className="view-complaint-container">
      <h1>Complaints Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Complaint Type</th>
            <th>Date of Incident</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentComplaints.map(complaint => (
            <tr key={complaint.id}>
              <td>{complaint.employeeName}</td>
              <td>{complaint.complaintType}</td>
              <td>{complaint.dateOfIncident}</td>
              <td>
                <span 
                  style={{
                    backgroundColor: complaint.status === 'active' ? 'red' : 'green',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '5px 10px',
                    display: 'inline-block',
                  }}
                >
                  {complaint.status}
                </span>
              </td>
              <td>
                <button onClick={() => handleViewDetails(complaint.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <FaEye size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className='pagination-controls'>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(complaints.length / itemsPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(complaints.length / itemsPerPage)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewComplaint;