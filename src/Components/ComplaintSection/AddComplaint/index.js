import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../../firebase/firebaseconfig'; // Adjust the import as needed
import { FaUser, FaExclamationCircle, FaCalendarAlt, FaMapMarkerAlt, FaFileUpload, FaFlag } from 'react-icons/fa';
import './AddComplaint.css';
import { useNavigate } from 'react-router-dom';

// Function to generate a unique ID
const generateUniqueId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const SubmitComplaint = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('');
  const [file, setFile] = useState(null);
  const maxDate = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, 'employees'));
      const employeeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeeList);
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedInUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!employeeName || !complaintType || !dateOfIncident || !description || !priority) {
      alert('Please fill all the required fields');
      return;
    }

    let fileURL = null;

    if (file) {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, `complaints/${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        fileURL = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error('Error uploading file: ', error);
        alert('File upload failed. Please try again.');
        return;
      }
    }

    // Generate a unique ID for the complaint
    const complaintId = generateUniqueId();

    const complaintData = {
      id: complaintId, // Add the unique ID to the complaint data
      employeeName,
      complaintType,
      dateOfIncident,
      description,
      location,
      priority,
      fileURL, // Store the file URL, not the file itself
      submittedBy: {
        userId: loggedInUser.username,
        userName: loggedInUser.name,
      },
      submittedAt: new Date(),
      status: "active",
    };

    try {
      await addDoc(collection(db, 'complaints'), complaintData);
      navigate('/process-successful');
    } catch (error) {
      console.error('Error submitting complaint: ', error);
    }
  };

  return (
    <div className="complaint-form">
      <h2>Submit New Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label>
              <FaUser /> Employee Name
              <select value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required>
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.firstName + ' ' + emp.lastName}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-column">
            <label>
              <FaExclamationCircle /> Complaint Type
              <select value={complaintType} onChange={(e) => setComplaintType(e.target.value)} required>
                <option value="">Select Type</option>
                <option value="Harassment">Harassment</option>
                <option value="Discrimination">Discrimination</option>
                <option value="Workplace Safety">Workplace Safety</option>
                <option value="Misconduct">Misconduct</option>
                <option value="Compensation Issues">Compensation Issues</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <div className="form-column">
            <label>
              <FaCalendarAlt /> Date of Incident
              <input 
                type="date" 
                value={dateOfIncident} 
                onChange={(e) => setDateOfIncident(e.target.value)} 
                required 
                max={maxDate} 
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label>
              <FaMapMarkerAlt /> Location of Incident (Optional)
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </label>
          </div>
          <div className="form-column">
            <label>
              <FaFileUpload /> Upload Supporting Documents
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            </label>
          </div>
          <div className="form-column">
            <label>
              <FaFlag /> Priority Level
              <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>
          </div>
        </div>

        <div className="form-row">
          <label>
            <FaExclamationCircle /> Complaint Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Describe the incident in detail"
            ></textarea>
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default SubmitComplaint;