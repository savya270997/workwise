import React, { useState, useEffect } from 'react';
import { FaEllipsisV, FaTrash, FaEye } from 'react-icons/fa';
import { db } from '../../firebase/firebaseconfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './Drafts.css';
import { useNavigate } from 'react-router-dom';

const Drafts = () => {
    const [drafts, setDrafts] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            const draftsCollection = collection(db, 'draftJobPostings');
            const draftsSnapshot = await getDocs(draftsCollection);
            const draftsList = draftsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDrafts(draftsList);
            console.log('Fetched drafts:', draftsList);
        };

        fetchDrafts();
    }, []);

    const handleMenuClick = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };

    const handleOutsideClick = (e) => {
        if (!e.target.closest('.menu-container')) {
            setActiveMenu(null);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'draftJobPostings', id));
        setDrafts(drafts.filter(draft => draft.id !== id));
    };

    const handleViewDraft = (id) => {
        navigate(`/viewdraft/${id}`);
    };

    return (
        <div className="drafts-container">
            <h1>Draft Job Postings</h1>
            <table className="drafts-table">
                <thead>
                    <tr>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Job Type</th>
                        <th>Location</th>
                        <th>Skills</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drafts.map((draft) => (
                        <tr key={draft.id}>
                            <td>{draft.designation}</td>
                            <td>{draft.department}</td>
                            <td>{draft.jobType}</td>
                            <td>{draft.location}</td>
                            <td>{draft.skills}</td>
                            <td>{draft.salary}</td>
                            <td>
                                <div className="menu-container">
                                    <FaEllipsisV className="menu-icon" onClick={() => handleMenuClick(draft.id)} />
                                    {activeMenu === draft.id && (
                                        <div className="menu">
                                            <div onClick={() => handleViewDraft(draft.id)}><FaEye /> View Draft</div>
                                            <div onClick={() => handleDelete(draft.id)}><FaTrash /> Delete Draft</div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Drafts;