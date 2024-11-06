import React, { useState, useEffect } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaAddressCard, FaBuilding, FaDollarSign,
  FaGraduationCap, FaBriefcase, FaIdCard, FaLaptop, FaFileContract, FaCalendar, FaCode
} from 'react-icons/fa';
import { db } from '../../firebase/firebaseconfig';
import { collection, addDoc } from 'firebase/firestore';
import './AddEmployee.css';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [employeeDetails, setEmployeeDetails] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    jobTitle: '',
    startDate: '',
    salary: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    workAuthorization: '',
    education: '',
    previousEmployment: '',
    companyEquipment: '',
    agreementsSigned: ''
  });

  const [errors, setErrors] = useState({});

  

  useEffect(() => {
    const generateEmployeeCode = () => {
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
      const randomNumber = numbers.charAt(Math.floor(Math.random() * numbers.length));
      const randomDigits = Array.from({ length: 1 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length))).join('');
      return `${randomLetter}${randomDigits}${randomNumber}`;
    };

    setEmployeeDetails(prevState => ({
      ...prevState,
      employeeCode: generateEmployeeCode()
    }));
  }, []);

  const handleInputChange = (e) => {
    setEmployeeDetails({
      ...employeeDetails,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const validateFields = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!employeeDetails.firstName) newErrors.firstName = 'This field is required';
      if (!employeeDetails.lastName) newErrors.lastName = 'This field is required';
      if (!employeeDetails.email) newErrors.email = 'This field is required';
      if (!employeeDetails.phone) newErrors.phone = 'This field is required';
      if (!employeeDetails.address) newErrors.address = 'This field is required';
    }
  
    if (currentStep === 2) {
      if (!employeeDetails.department) newErrors.department = 'This field is required';
      if (!employeeDetails.jobTitle) newErrors.jobTitle = 'This field is required';
      if (!employeeDetails.startDate) newErrors.startDate = 'This field is required';
      if (!employeeDetails.salary) newErrors.salary = 'This field is required';
    }
  
    if (currentStep === 3) {
      if (!employeeDetails.emergencyContactName) newErrors.emergencyContactName = 'This field is required';
      if (!employeeDetails.emergencyContactPhone) newErrors.emergencyContactPhone = 'This field is required';
      if (!employeeDetails.workAuthorization) newErrors.workAuthorization = 'This field is required';
      if (!employeeDetails.education) newErrors.education = 'This field is required';
      if (!employeeDetails.previousEmployment) newErrors.previousEmployment = 'This field is required';
      if (!employeeDetails.companyEquipment) newErrors.companyEquipment = 'This field is required';
      if (!employeeDetails.agreementsSigned) newErrors.agreementsSigned = 'This field is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleSaveEmployee = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      await addDoc(collection(db, 'employees'), {
        ...employeeDetails,
        createdAt: new Date()
      });
      console.log('Employee added:', employeeDetails);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };
  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.');
    if (confirmCancel) {
      navigate('/dashboard');
    }
  };
  return (
    <div className="create-employee-container">
      <h1>Add New Employee</h1>
      <div className="employee-form">
        {currentStep === 1 && (
          <div>
            <div className="form-group">
              <label><FaCode /> Employee Code</label>
              <input
                type="text"
                name="employeeCode"
                value={employeeDetails.employeeCode}
                disabled
              />
            </div>
            <div className="form-group">
              <label><FaUser /> First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={employeeDetails.firstName}
                onChange={handleInputChange}
                required
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label><FaUser /> Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={employeeDetails.lastName}
                onChange={handleInputChange}
                required
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={employeeDetails.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={employeeDetails.phone}
                onChange={handleInputChange}
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label><FaAddressCard /> Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={employeeDetails.address}
                onChange={handleInputChange}
                required
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="form-group">
              <label><FaBuilding /> Department</label>
              <input
                type="text"
                name="department"
                placeholder="Enter department"
                value={employeeDetails.department}
                onChange={handleInputChange}
                required
              />
              {errors.department && <span className="error-message">{errors.department}</span>}
            </div>
            <div className="form-group">
              <label><FaBriefcase /> Job Title</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="Enter job title"
                value={employeeDetails.jobTitle}
                onChange={handleInputChange}
                required
              />
              {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
            </div>
            <div className="form-group">
              <label><FaCalendar /> Start Date</label>
              <input
                type="date"
                name="startDate"
                value={employeeDetails.startDate}
                onChange={handleInputChange}
                required
              />
              {errors.startDate && <span className="error-message">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label><FaDollarSign /> Salary</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                value={employeeDetails.salary}
                onChange={handleInputChange}
                required
              />
              {errors.salary && <span className="error-message">{errors.salary}</span>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="form-group">
              <label><FaUser /> Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                placeholder="Enter emergency contact name"
                value={employeeDetails.emergencyContactName}
                onChange={handleInputChange}
                required
              />
              {errors.emergencyContactName && <span className="error-message">{errors.emergencyContactName}</span>}
            </div>
            <div className="form-group">
              <label><FaPhone /> Emergency Contact Phone</label>
              <input
                type="text"
                name="emergencyContactPhone"
                placeholder="Enter emergency contact phone"
                value={employeeDetails.emergencyContactPhone}
                onChange={handleInputChange}
                required
              />
              {errors.emergencyContactPhone && <span className="error-message">{errors.emergencyContactPhone}</span>}
            </div>
            <div className="form-group">
              <label><FaIdCard /> Work Authorization</label>
              <input
                type="text"
                name="workAuthorization"
                placeholder="Enter work authorization details"
                value={employeeDetails.workAuthorization}
                onChange={handleInputChange}
                required
              />
              {errors.workAuthorization && <span className="error-message">{errors.workAuthorization}</span>}
            </div>
            <div className="form-group">
              <label><FaGraduationCap /> Education</label>
              <input
                type="text"
                name="education"
                placeholder="Enter educational qualifications"
                value={employeeDetails.education}
                onChange={handleInputChange}
                required
              />
              {errors.education && <span className="error-message">{errors.education}</span>}
            </div>
            <div className="form-group">
              <label><FaBriefcase /> Previous Employment</label>
              <input
                type="text"
                name="previousEmployment"
                placeholder="Enter previous employment details"
                value={employeeDetails.previousEmployment}
                onChange={handleInputChange}
                required
              />
              {errors.previousEmployment && <span className="error-message">{errors.previousEmployment}</span>}
            </div>
            <div className="form-group">
              <label><FaLaptop /> Company Equipment</label>
              <input
                type="text"
                name="companyEquipment"
                placeholder="Enter details of company equipment"
                value={employeeDetails.companyEquipment}
                onChange={handleInputChange}
                required
              />
              {errors.companyEquipment && <span className="error-message">{errors.companyEquipment}</span>}
            </div>
            <div className="form-group">
              <label><FaFileContract /> Agreements Signed</label>
              <input
                type="text"
                name="agreementsSigned"
                placeholder="Enter details of agreements signed"
                value={employeeDetails.agreementsSigned}
                onChange={handleInputChange}
                required
              />
              {errors.agreementsSigned && <span className="error-message">{errors.agreementsSigned}</span>}
            </div>
          </div>
        )}

       
        <div className="navigation-buttons">
          <button onClick={handleCancel} className="cancel-button">Cancel</button>
          {currentStep > 1 && <button onClick={handlePrev}>Prev</button>}
          {currentStep < 3 && <button onClick={handleNext}>Next</button>}
          {currentStep === 3 && <button onClick={handleSaveEmployee}>Save</button>}
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;