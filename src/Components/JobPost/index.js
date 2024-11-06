import React, { useState } from 'react';
import { FaBriefcase, FaFileAlt, FaUserTie, FaBuilding, FaTools, FaMoneyBillWave, FaPenFancy, FaSave, FaTimes, FaMapMarkerAlt, FaGraduationCap, FaGlobe } from 'react-icons/fa';
import './JobPost.css'; 
import { db } from '../../firebase/firebaseconfig'; 
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const JobPosting = () => {
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
                    status: 'active', // Default status
                    createdAt: new Date(),
                });
                console.log('Job posted:', jobDetails);
                navigate('/dashboard');
            } catch (error) {
                console.error('Error posting job:', error);
            }
        } else {
            alert('Please fill out all required fields.');
        }
    };

    const handleDraft = async () => {
        if (validateFields()) {
            try {
                await addDoc(collection(db, 'draftJobPostings'), {
                    ...jobDetails,
                    jobType,
                    workType,
                    experience,
                    createdAt: new Date(),
                });
                console.log('Job draft saved:', jobDetails);
            } catch (error) {
                console.error('Error saving draft:', error);
                navigate('/dahsboard')
            }
        } else {
            alert('Please fill out all required fields.');
        }
    };

    const handleCancel = () => {
        console.log('Job posting cancelled');
        setJobDetails({
            description: '',
            designation: '',
            department: '',
            skills: '',
            location: '',
            salary: '',
            qualification: '',
            shiftSchedule: '',
        });
        setJobType('');
        setWorkType('');
        setExperience('');
        navigate('/dashboard');
    };

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 5).toUpperCase();
    };

    return (
        <div className="job-posting-container">
            <div className="form-footer">
                <h1>Create Job Posting</h1>
            </div>
            <div className="form-buttons">
                <button className="btn-primary" onClick={handlePostJob}><FaPenFancy /> Post Job</button>
                <button className="btn-secondary" onClick={handleDraft}><FaSave /> Draft</button>
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
                            placeholder="Enter shift and schedule details"
                            value={jobDetails.shiftSchedule}
                            onChange={handleInputChange} 
                        />
                    </div>
                    {jobType === 'Experience' && (
                        <div className="form-group">
                            <label><FaTools /> Req Experience <span className="required">*</span></label>
                            <input 
                                type="number" 
                                name="experience" 
                                placeholder="Enter required experience in years"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)} 
                                required
                            />
                        </div>
                    )}
                </div>
                <div className="column">
                    <div className="form-group">
                        <label><FaBuilding /> Department <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="department" 
                            placeholder="Enter department"
                            value={jobDetails.department}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaTools /> Skills Required <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="skills" 
                            placeholder="Enter required skills"
                            value={jobDetails.skills}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaMoneyBillWave /> Proposed Salary <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="salary" 
                            placeholder="Enter proposed salary"
                            value={jobDetails.salary}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label><FaGlobe /> Work Type <span className="required">*</span></label>
                        <select name="workType" onChange={(e) => setWorkType(e.target.value)} value={workType} required>
                            <option value="">Select Work Type</option>
                            <option value="Remote">Remote work</option>
                            <option value="Hybrid">Hybrid work</option>
                            <option value="On-site">On-site work</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label><FaMapMarkerAlt /> Location <span className="required">*</span></label>
                        <input 
                            type="text" 
                            name="location" 
                            placeholder="Enter location"
                            value={jobDetails.location}
                            onChange={handleInputChange} 
                            required
                        />
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default JobPosting;