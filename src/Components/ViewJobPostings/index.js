import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEye, FaBan } from 'react-icons/fa';
import { db } from '../../firebase/firebaseconfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './ViewJobPostings.css';

const ViewJobPostings = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [statusFilter, setStatusFilter] = useState('active');

    useEffect(() => {
        const fetchJobPostings = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'jobPostings'));
                const jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                console.log('Fetched jobs:', jobs); // Debugging log
                setJobPostings(jobs);
            } catch (error) {
                console.error('Error fetching job postings:', error);
            }
        };

        fetchJobPostings();
    }, []);

    const handleMenuToggle = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'jobPostings', id));
            setJobPostings(jobPostings.filter(job => job.id !== id));
        } catch (error) {
            console.error('Error deleting job posting:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const jobRef = doc(db, 'jobPostings', id);
            await updateDoc(jobRef, { status: newStatus });
            setJobPostings(jobPostings.map(job => job.id === id ? { ...job, status: newStatus } : job));
        } catch (error) {
            console.error('Error updating job status:', error);
        }
    };

    const filteredJobs = jobPostings.filter(job => job.status?.toLowerCase() === statusFilter);
    console.log('Filtered jobs:', filteredJobs);

    return (
        <div className="view-job-postings-container job-posting-container">
            <div className="tabs">
                <button 
                    className={`tab ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                >
                    Active
                </button>
                <button 
                    className={`tab ${statusFilter === 'inactive' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('inactive')}
                >
                    Inactive
                </button>
            </div>
            <div className="job-list">
                {filteredJobs.length === 0 ? (
                    <p>No job postings available.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Job Code</th>
                                <th>Description</th>
                                <th>Designation</th>
                                <th>Department</th>
                                <th>Job Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.jobCode}</td>
                                    <td>{job.description}</td>
                                    <td>{job.designation}</td>
                                    <td>{job.department}</td>
                                    <td>{job.jobType}</td>
                                    <td>{job.status}</td>
                                    <td>
                                        <div className="menu-container">
                                            <FaEllipsisV onClick={() => handleMenuToggle(job.id)} />
                                            {activeMenu === job.id && (
                                                <div className="menu">
                                                    <button onClick={() => handleDelete(job.id)}><FaTrash /> Delete</button>
                                                    <button onClick={() => handleStatusChange(job.id, job.status === 'active' ? 'inactive' : 'active')}>
                                                        {job.status === 'active' ? <FaBan /> : <FaEye />} 
                                                        {job.status === 'active' ? 'Make Inactive' : 'Make Active'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ViewJobPostings;