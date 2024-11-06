import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaFileAlt, FaUserTie, FaBuilding, FaTools, FaMoneyBillWave, FaPenFancy, FaSave, FaTimes, FaMapMarkerAlt, FaGraduationCap, FaGlobe } from 'react-icons/fa';
import './Drafts.css'; 
import { db } from '../../firebase/firebaseconfig'; 
import { doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { collection } from "firebase/firestore";

const ViewDraft = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobType, setJobType] = useState(''); 
    const [workType, setWorkType] = useState(''); 
    const [experience, setExperience] = useState(''); 
    const [jobDetails, setJobDetails] = useState({
        description: '',
        designation: '',
        department: '',
        skills: '',
        location: '',
        salary: '',
        qualification: '',
        shiftSchedule: '',
    });

    useEffect(() => {
        const fetchDraft = async () => {
            const draftRef = doc(db, 'draftJobPostings', id);
            const draftSnapshot = await getDoc(draftRef);
            if (draftSnapshot.exists()) {
                const draftData = draftSnapshot.data();
                setJobDetails({
                    description: draftData.description,
                    designation: draftData.designation,
                    department: draftData.department,
                    skills: draftData.skills,
                    location: draftData.location,
                    salary: draftData.salary,
                    qualification: draftData.qualification,
                    shiftSchedule: draftData.shiftSchedule,
                });
                setJobType(draftData.jobType);
                setWorkType(draftData.workType);
                setExperience(draftData.experience || '');
            }
        };

        fetchDraft();
    }, [id]);

    const handleInputChange = (e) => {
        setJobDetails({
            ...jobDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleJobTypeChange = (e) => {
        setJobType(e.target.value);
        if (e.target.value !== 'Experience') {
            setExperience('');
        }
    };

    const validateFields = () => {
        const requiredFields = ['description', 'designation', 'department', 'skills', 'salary', 'location', 'qualification'];
        for (let field of requiredFields) {
            if (!jobDetails[field] || (field === 'experience' && jobType === 'Experience' && !experience)) {
                return false;
            }
        }
        return true;
    };

    const handlePostJob = async () => {
        if (validateFields()) {
            try {
                const jobCode = generateCode();
                await addDoc(collection(db, 'jobPostings'), {
                    ...jobDetails,
                    jobType,
                    workType,
                    experience,
                    jobCode,
                    createdAt: new Date(),
                    status: 'active',
                });
                await deleteDoc(doc(db, 'draftJobPostings', id)); 
                console.log('Draft posted as job:', jobDetails);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error posting job:', error);
            }
        } else {
            alert('Please fill out all required fields.');
        }
    };

    const handleCancel = () => {
        console.log('Draft editing cancelled');
        navigate('/drafts');
    };

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 5).toUpperCase();
    };

    return (
        <div className="job-posting-container">
            <div className="form-footer">
                <h1>Edit Draft</h1>
            </div>
            <div className="form-buttons">
                <button className="btn-primary" onClick={handlePostJob}><FaPenFancy /> Post Job</button>
                <button className="btn-secondary" onClick={handleCancel}><FaTimes /> Cancel</button>
            </div>
            <div className="job-posting-form">
                <div className="column">
                    <div className="form-group">
                        <label><FaFileAlt /> Description <span className="required">*</span></label>
                        <textarea 
                            name="description" 
                            placeholder="Roles & Responsibilities" 
                            value={jobDetails.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label><FaBriefcase /> Designation <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="designation" 
                            placeholder="Enter job designation"
                            value={jobDetails.designation}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaUserTie /> Job Type <span className="required">*</span></label>
                        <select name="jobType" onChange={handleJobTypeChange} value={jobType} required>
                            <option value="">Select Job Type</option>
                            <option value="Internship">Internship</option>
                            <option value="Fresher">Fresher</option>
                            <option value="Experience">Experience</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label><FaGraduationCap /> Qualification Req <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="qualification" 
                            placeholder="Enter qualification requirements"
                            value={jobDetails.qualification}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaTools /> Shift and Schedule</label>
                        <input 
                            type="text" 
                           

 name="shiftSchedule" 
                            placeholder="Enter shift details"
                            value={jobDetails.shiftSchedule}
                            onChange={handleInputChange} 
                        />
                    </div>
                </div>
                <div className="column">
                    <div className="form-group">
                        <label><FaBuilding /> Department <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="department" 
                            placeholder="Enter job department"
                            value={jobDetails.department}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaTools /> Skills Req <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="skills" 
                            placeholder="Enter skills requirements"
                            value={jobDetails.skills}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    {jobType === 'Experience' && (
                        <div className="form-group">
                            <label><FaTools /> Experience <span className="required">*</span></label>
                            <input 
                                type="text" 
                                name="experience" 
                                placeholder="Enter experience details"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)} 
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label><FaMapMarkerAlt /> Location <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="location" 
                            placeholder="Enter job location"
                            value={jobDetails.location}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaMoneyBillWave /> Salary <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="salary" 
                            placeholder="Enter salary details"
                            value={jobDetails.salary}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDraft;