import React, { useState, useEffect } from 'react';
import './TrainingAssignModal.css';
import { db } from '../../../firebase/firebaseconfig';
import { doc, updateDoc } from 'firebase/firestore';

const AssignEmployeeModal = ({ onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch employees from Firebase (for now using a temp user object)
    const tempEmployees = [
      { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'IT' },
      // Add more employee data from Firebase
    ];
    setEmployees(tempEmployees);
  }, []);

  const handleAssign = async () => {
    if (selectedEmployee) {
      const candidateId = 1; // Example candidate ID (replace with real logic)
      const candidateRef = doc(db, 'onboardingCandidates', `${candidateId}`);

      try {
        await updateDoc(candidateRef, {
          assignedTrainingEmployee: selectedEmployee.name,
        });
        onClose(); 
      } catch (error) {
        console.error('Error updating candidate with training employee:', error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Assign Training Employee</h2>
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === parseInt(e.target.value)))}>
          <option value="">Select Employee</option>
          {employees
            .filter((employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.position}
              </option>
            ))}
        </select>
        <div className="modal-buttons">
          <button className="assign-button" onClick={handleAssign} disabled={!selectedEmployee}>
            Assign
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployeeModal;