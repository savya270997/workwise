import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebaseconfig'; // Import firestore
import './EmployeeProfileSetup.css'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase/firebaseconfig';

const EmployeeProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: null,
    resume: null,
    certificates: [],
    emergencyContacts: [],
    jobRole: '',
    department: '',
    probationAcknowledgment: false,
    communicationPreferences: '',
    workSchedulePreferences: '',
    socialLinks: { linkedin: '', github: '' },
    policiesAcknowledged: false
  });

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate(); 
  const uploadFile = async (file) => {
    const storageRef = ref(storage, `files/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) errors.phone = 'Valid phone number is required';
    if (!formData.address) errors.address = 'Address is required';
    if (currentStep === 5 && !formData.policiesAcknowledged) errors.policiesAcknowledged = 'You must acknowledge the policies';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files.length > 0 ? files : null
    });
  };

  const handleAddEmergencyContact = () => {
    const contact = prompt("Enter emergency contact details");
    if (contact) {
      setFormData({
        ...formData,
        emergencyContacts: [...formData.emergencyContacts, contact]
      });
    }
  };

  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / 5) * 100); // Assuming 5 steps
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setProgress(((currentStep - 1) / 5) * 100);
  };

  const handleSaveEmployee = async () => {
    if (!validateForm()) { // Updated from validateFields to validateForm
      return;
    }
  
    try {
      // Upload files
      const profilePictureURL = formData.profilePicture ? await uploadFile(formData.profilePicture[0]) : null;
      const resumeURL = formData.resume ? await uploadFile(formData.resume[0]) : null;
      const certificatesURLs = formData.certificates
        ? await Promise.all(Array.from(formData.certificates).map(file => uploadFile(file)))
        : [];
  
      // Save data to Firestore
      await addDoc(collection(firestore, 'OnboardedEmployees'), {
        ...formData,
        profilePicture: profilePictureURL,
        resume: resumeURL,
        certificates: certificatesURLs,
        createdAt: new Date()
      });
  
      console.log('Employee added:', formData);
      navigate('/onboarding');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className="employee-profile-setup">
      <h1>Employee Profile Setup</h1>
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      <form>
        {currentStep === 1 && (
          <div className="step">
            <h2>Personal Information</h2>
            <label>Name:
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
              {formErrors.name && <span className="error">{formErrors.name}</span>}
            </label>
            <label>Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              {formErrors.email && <span className="error">{formErrors.email}</span>}
            </label>
            <label>Phone:
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              {formErrors.phone && <span className="error">{formErrors.phone}</span>}
            </label>
            <label>Address:
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
              {formErrors.address && <span className="error">{formErrors.address}</span>}
            </label>
            <label>Profile Picture:
              <input type="file" name="profilePicture" onChange={handleFileChange} />
            </label>
          </div>
        )}
        {currentStep === 2 && (
          <div className="step">
            <h2>Documents Upload</h2>
            <label>Resume:
              <input type="file" name="resume" onChange={handleFileChange} />
            </label>
            <label>Certificates:
              <input type="file" name="certificates" multiple onChange={handleFileChange} />
            </label>
          </div>
        )}
        {currentStep === 3 && (
          <div className="step">
            <h2>Job and Emergency Contact Information</h2>
            <label>Job Role:
              <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} />
            </label>
            <label>Department:
              <input type="text" name="department" value={formData.department} onChange={handleChange} />
            </label>
            <label>Emergency Contacts:
              <button type="button" onClick={handleAddEmergencyContact}>Add Emergency Contact</button>
              <ul>
                {formData.emergencyContacts.map((contact, index) => (
                  <li key={index}>{contact}</li>
                ))}
              </ul>
            </label>
            <label>Probation Period Acknowledgment:
              <input type="checkbox" name="probationAcknowledgment" checked={formData.probationAcknowledgment} onChange={() => setFormData({ ...formData, probationAcknowledgment: !formData.probationAcknowledgment })} />
            </label>
          </div>
        )}
        {currentStep === 4 && (
          <div className="step">
            <h2>Social Media Links</h2>
            <label>LinkedIn:
              <input type="url" name="linkedin" value={formData.socialLinks.linkedin} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })} />
            </label>
            <label>GitHub:
              <input type="url" name="github" value={formData.socialLinks.github} onChange={(e) => setFormData({ ...formData, socialLinks: { ...formData.socialLinks, github: e.target.value } })} />
            </label>
            <label>Communication Preferences:
              <input type="text" name="communicationPreferences" value={formData.communicationPreferences} onChange={handleChange} />
            </label>
            <label>Work Schedule Preferences:
              <input type="text" name="workSchedulePreferences" value={formData.workSchedulePreferences} onChange={handleChange} />
            </label>
          </div>
        )}
        {currentStep === 5 && (
          <div className="step">
            <h2>Legal Agreements and Policies</h2>
            <label>
              <input type="checkbox" name="policiesAcknowledged" checked={formData.policiesAcknowledged} onChange={() => setFormData({ ...formData, policiesAcknowledged: !formData.policiesAcknowledged })} />
              I have read and understood the company policies
            </label>
            {formErrors.policiesAcknowledged && <span className="error">{formErrors.policiesAcknowledged}</span>}
          </div>
        )}
        <div className="form-buttons">
          {currentStep > 1 && <button type="button" onClick={handlePreviousStep}>Previous</button>}
          {currentStep < 5 ? (
            <button type="button" onClick={handleNextStep}>Next</button>
          ) : (
            <button type="button" onClick={handleSaveEmployee}>Save</button>
          )}
          <button type="button" className="cancel-button" onClick={() => {
            if (window.confirm("Are you sure you want to cancel?")) {
              navigate('/dashboard');
            }
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeProfileSetup;