import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingCandidates.css';

const OnboardingCandidates = () => {
  const navigate = useNavigate();

  // Dummy data for onboarding candidates
  const candidates = [
    { id: 1, name: 'John Doe', position: 'Software Engineer', department: 'IT', status: 'Pending' },
    { id: 2, name: 'Jane Smith', position: 'Product Manager', department: 'Product', status: 'Pending' },
    { id: 3, name: 'Alice Johnson', position: 'HR Specialist', department: 'HR', status: 'Pending' },
  ];

  const handleStartOnboarding = (candidateId) => {
    // Add any additional logic for starting the onboarding process if needed
    console.log(`Starting onboarding for candidate ID: ${candidateId}`);
    navigate('/onboarding');
  };

  return (
    <div className="onboarding-candidates-container">
      <h1>Onboarding Candidates</h1>
      <table className="onboarding-table">
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map(candidate => (
            <tr key={candidate.id}>
              <td>{candidate.name}</td>
              <td>{candidate.position}</td>
              <td>{candidate.department}</td>
              <td>{candidate.status}</td>
              <td>
                <button
                  className="start-onboarding-button"
                  onClick={() => handleStartOnboarding(candidate.id)}
                >
                  Start Onboarding
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardingCandidates;