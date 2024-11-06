import React, { useState } from 'react';
import './Onboarding.css';
import { useNavigate } from 'react-router-dom';
import {
  FaUserCircle, FaFileAlt, FaHandshake, FaBook, FaLaptop, FaUserFriends
} from 'react-icons/fa';
import AssignEmployeeModal from './TrainingAssignModal';
import AssignEmployeeEquipModal from './AssignEmployeeEquipModal';
import Modal from './CompanyPoliciesModal';

const Onboarding = () => {
  const navigate = useNavigate();
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [isCompanyPoliciesModalOpen,setIsompanyPoliciesModalOpen]= useState(false);

  const cards = [
    {
      icon: <FaUserCircle />,
      title: "Employee Profile Setup",
      description: "Complete your personal and job-related information.",
      route: "/profile-setup"
    },
    {
      icon: <FaFileAlt />,
      title: "Document Submission",
      description: "Submit required documents for your HR file.",
      route: "/document-submission"
    },
    {
      icon: <FaHandshake />,
      title: "Company Policies & Agreements",
      description: "Review and sign company policies and agreements.",
      route: "#",
      onClick: () => setIsompanyPoliciesModalOpen(true) 
    },
    {
      icon: <FaBook />,
      title: "Training & Orientation",
      description: "Attend mandatory training and orientation sessions.",
      route: "#",
      onClick: () => {
        setIsTrainingModalOpen(true);
      } 
    },
    {
      icon: <FaLaptop />,
      title: "Assign Company Equipment",
      description: "Confirm your assigned company equipment.",
      route: "#",
      onClick: () => setIsEquipmentModalOpen(true)
    },
    {
      icon: <FaUserFriends />,
      title: "Buddy Assignment",
      description: "Meet your assigned buddy for a smooth transition.",
      route: "#",
      onClick: () => {
        setIsTrainingModalOpen(true);
      } 
    },
    
  ];

  return (
    <div className="onboarding-container">
      <h1>Onboarding Tasks</h1>
      <div className="onboarding-cards">
        {cards.map((card, index) => (
          <div key={index} className="onboarding-card" onClick={() => card.onClick ? card.onClick() : navigate(card.route)}>
            <div className="card-border-top"></div>
            <div className="card-icon">{card.icon}</div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <button className="card-button">Proceed</button>
          </div>
        ))}
      </div>
      {isTrainingModalOpen && <AssignEmployeeModal onClose={() => setIsTrainingModalOpen(false)} />}
      {isEquipmentModalOpen && <AssignEmployeeEquipModal onClose={() => setIsEquipmentModalOpen(false)} />}
      {isCompanyPoliciesModalOpen && <Modal onClose={() => setIsompanyPoliciesModalOpen(false)} />}
    </div>
  );
};

export default Onboarding;