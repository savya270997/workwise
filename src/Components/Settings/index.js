import React, { useState, useEffect } from 'react';
import './Settings.css';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/firebaseconfig'; // Import your Firebase config

const Settings = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [activeTab, setActiveTab] = useState('profile');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <UserProfile currentUser={currentUser} />;
      case 'company':
        return <CompanySettings />;
      case 'notifications':
        return <NotificationPreferences />;
      case 'integrations':
        return <SystemIntegrations />;
      default:
        return <UserProfile currentUser={currentUser} />;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          User Profile
        </button>
        <button
          className={activeTab === 'company' ? 'active' : ''}
          onClick={() => setActiveTab('company')}
        >
          Company Settings
        </button>
        <button
          className={activeTab === 'notifications' ? 'active' : ''}
          onClick={() => setActiveTab('notifications')}
        >
          Notification Preferences
        </button>
        <button
          className={activeTab === 'integrations' ? 'active' : ''}
          onClick={() => setActiveTab('integrations')}
        >
          System Integrations
        </button>
      </div>

      <div className="settings-content">{renderTabContent()}</div>
    </div>
  );
};

const UserProfile = ({ currentUser }) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [docId, setDocId] = useState(''); // For storing document ID of the user

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUserName(currentUser.username || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phoneNum || '');

      // Fetch user data from Firestore using email
      const fetchUserData = async () => {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setDocId(doc.id); // Store document ID for future updates
          setName(userData.name);
          setUserName(userData.username);
          setPhone(userData.phoneNum);
        });
      };
      
      fetchUserData();
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (docId) {
      const userDocRef = doc(db, 'users', docId);

      // Update user data in Firestore
      await updateDoc(userDocRef, {
        name,
        username: userName,
        phoneNum: phone,
        ...(password && { password }), // Only update the password if it's not empty
      });

      alert('Profile updated!');
    }
  };

  return (
    <div className="tab-content">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            disabled // Email should be immutable
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Change Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="save-btn">
          Save Profile
        </button>
      </form>
    </div>
  );
};

const CompanySettings = () => (
  <div className="tab-content">
    <h2>Company Settings</h2>
    <form>
      <div className="form-group">
        <label htmlFor="companyName">Company Name</label>
        <input type="text" id="companyName" placeholder="Enter company name" />
      </div>
      <div className="form-group">
        <label htmlFor="address">Company Address</label>
        <textarea id="address" placeholder="Enter company address" />
      </div>
      <button type="submit" className="save-btn">Save Company Settings</button>
    </form>
  </div>
);

const NotificationPreferences = () => (
  <div className="tab-content">
    <h2>Notification Preferences</h2>
    <form>
      <div className="form-group">
        <label htmlFor="emailNotifications">Email Notifications</label>
        <select id="emailNotifications">
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      </div>
      <button type="submit" className="save-btn">Save Preferences</button>
    </form>
  </div>
);

const SystemIntegrations = () => (
  <div className="tab-content">
    <h2>System Integrations</h2>
    <form>
      <div className="form-group">
        <label htmlFor="slack">Slack Integration</label>
        <input type="text" id="slack" placeholder="Enter Slack API Key" />
      </div>
      <button type="submit" className="save-btn">Save Integrations</button>
    </form>
  </div>
);

export default Settings;