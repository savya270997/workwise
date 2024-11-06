import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './FillTimesheet.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'; // Firebase
import { db } from '../../../firebase/firebaseconfig'; // Import your Firebase config

Modal.setAppElement('#root');

const FillTimesheet = () => {
  const [timesheetData, setTimesheetData] = useState([
    { day: 'Mon', hours: 0 },
    { day: 'Tue', hours: 0 },
    { day: 'Wed', hours: 0 },
    { day: 'Thu', hours: 0 },
    { day: 'Fri', hours: 0 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
  ]);
  const [totalRequiredHours, setTotalRequiredHours] = useState(45);
  const [notes, setNotes] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ project: 'Project A', task: 'Testing', hours: '', description: '', day: 'Mon' });
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRejected, setIsRejected] = useState(false); // To track if the week was rejected

  // Get current user's email
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, []);

  // Load timesheet data for the current week
  useEffect(() => {
    if (email) {
      fetchTimesheetData(currentWeek);
    }
  }, [currentWeek, email]);

  // Function to fetch timesheet data from Firebase for the current week
  const fetchTimesheetData = async (week) => {
    const q = query(
      collection(db, 'timesheets'),
      where('email', '==', email),
      where('weekStart', '==', week.start),
      where('weekEnd', '==', week.end)
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      console.log("Timesheet data fetched:", data);
      setIsSubmitted(true);
      setIsRejected(false); // Timesheet was not rejected if found
    } else {
      // Check if it was rejected
      const rejectedQuery = query(
        collection(db, 'rejectedtimesheet'),
        where('email', '==', email),
        where('weekStart', '==', week.start),
        where('weekEnd', '==', week.end)
      );
      const rejectedSnapshot = await getDocs(rejectedQuery);
      if (!rejectedSnapshot.empty) {
        setIsRejected(true);
        console.log("Timesheet for this week was rejected, resubmission allowed.");
      } else {
        setIsRejected(false);
      }
      setIsSubmitted(false); // Week is not submitted
      resetTimesheetData(); // Reset timesheet data if no records exist for the week
    }
    populateTimesheetData(data);
  };

  // Reset timesheet data to default
  const resetTimesheetData = () => {
    setTimesheetData([
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 },
    ]);
  };

  // Populate timesheet data with fetched records
  const populateTimesheetData = (data) => {
    const fetchedData = data.flatMap(record => record.timesheetData || []);
    setTimesheetData(prevData => {
      return prevData.map(dayData => {
        const matched = fetchedData.find(fd => fd.day === dayData.day);
        return matched ? { ...dayData, hours: matched.hours } : dayData;
      });
    });
  };

  // Handle hours change
  const handleHoursChange = (index, value) => {
    if (isSubmitted) return; // Prevent editing if already submitted
    const updatedData = [...timesheetData];
    updatedData[index].hours = parseFloat(value) || 0;
    setTimesheetData(updatedData);
  };

  // Open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Form input changes
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add a new record
  const handleAddNewRecord = () => {
    const newRecordHours = parseFloat(form.hours) || 0;

    setTimesheetData(prevData => {
      const updatedData = [...prevData];
      const dayIndex = updatedData.findIndex(item => item.day === form.day);

      // If the day exists, add hours to it, else create a new day entry
      if (dayIndex !== -1) {
        updatedData[dayIndex].hours += newRecordHours;
      } else {
        updatedData.push({
          day: form.day,
          hours: newRecordHours,
        });
      }
      return updatedData;
    });

    handleCloseModal();
  };

  // Get the current week range
  function getCurrentWeek() {
    const today = new Date();
    const firstDay = today.getDate() - today.getDay() + 1; // Monday of the week
    const lastDay = firstDay + 6; // Sunday
    const startOfWeek = new Date(today.setDate(firstDay));
    const endOfWeek = new Date(today.setDate(lastDay));
    return {
      start: startOfWeek.toDateString(),
      end: endOfWeek.toDateString(),
    };
  }

  // Change week
  const changeWeek = (direction) => {
    const newStartDate = new Date(currentWeek.start);
    const newEndDate = new Date(currentWeek.end);
    newStartDate.setDate(newStartDate.getDate() + direction * 7);
    newEndDate.setDate(newEndDate.getDate() + direction * 7);
    setCurrentWeek({
      start: newStartDate.toDateString(),
      end: newEndDate.toDateString(),
    });
  };

  // Check if the current week submission is allowed
  const isCurrentWeekSubmitAllowed = () => {
    const today = new Date();
    const weekStart = new Date(currentWeek.start);
    const weekEnd = new Date(currentWeek.end);

    if (today > weekEnd) {
      return true;
    } else if (today >= weekStart && today.getDay() >= 1) {
      return true;
    }
    return false;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isCurrentWeekSubmitAllowed()) {
      alert('Submission is not allowed yet.');
      return;
    }

    const totalHours = timesheetData.reduce((acc, cur) => acc + cur.hours, 0);

    if (totalHours < 1) {
      alert(`You need to record at least 1 hour before submitting.`);
      return;
    }

    try {
      // Save timesheet to Firebase
      await addDoc(collection(db, 'timesheets'), {
        email,
        timesheetData,
        weekStart: currentWeek.start,
        weekEnd: currentWeek.end,
        notes,
        totalHours,
        timestamp: new Date(),
      });

      setIsSubmitted(true); // Prevent further submissions
      alert('Timesheet submitted successfully!');
    } catch (error) {
      console.error('Error submitting timesheet: ', error);
      alert('There was an error submitting your timesheet. Please try again.');
    }
  };

  // Total hours calculation
  const totalHours = timesheetData.reduce((acc, cur) => acc + cur.hours, 0);

  // Graph data preparation
  const graphData = timesheetData.map(item => ({
    day: item.day,
    hours: item.hours,
    color: item.hours > 9 ? '#173b45' : '#b43f3f',
  }));

  return (
    <div className="timesheet-container">
      <h2>Timesheet Submission</h2>

      {/* Week Navigation */}
      <div className='week-navigation'>
        <button onClick={() => changeWeek(-1)}>Previous Week</button>
        <span>{currentWeek.start} - {currentWeek.end}</span>
        <button onClick={() => changeWeek(1)}>Next Week</button>
      </div>

      <div className='timesheet-group'>
        <table className="timesheet-table

">
          <thead>
            <tr>
              <th>Day</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            {timesheetData.map((dayData, index) => (
              <tr key={index}>
                <td>{dayData.day}</td>
                <td>
                  <input
                    type="number"
                    value={dayData.hours}
                    onChange={(e) => handleHoursChange(index, e.target.value)}
                    disabled={isSubmitted && !isRejected} // Disable if submitted and not rejected
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='columntwo'>
          {/* Display total hours */}
      <div className='summary'>
        <h4>Total Required Hours: <span>{totalRequiredHours}</span></h4>
        <h4>Total Recorded Hours: <span>{totalHours}</span></h4>
      </div>
        {isSubmitted && !isRejected && <p className='error'>You have already submitted this week's timesheet.</p>}
        {isRejected && <p className='error'>Your previous submission was rejected. You can resubmit for this week.</p>}
          {/* Graph */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="hours" fill="#b43f3f">
            {graphData.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className='button-group'>
        <button onClick={handleOpenModal} disabled={isSubmitted && !isRejected}> Add Record </button>
        {/* Submit button */}
      <button onClick={handleSubmit} disabled={isSubmitted && !isRejected}> {isRejected ? 'Resubmit Timesheet' : 'Submit Timesheet'}
      </button>
      </div>
        </div>
      </div>
      {/* Modal */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="timesheet-modal"
        overlayClassName="timesheet-modal-overlay" contentLabel="Add New Record">
        <h2>Add New Record</h2>
        <form>
          <label>
            Project:
            <select name="project" value={form.project} onChange={handleFormChange}>
              <option value="Project A">Project A</option>
              <option value="Project B">Project B</option>
            </select>
          </label>
          <label>
            Task:
            <select name="task" value={form.task} onChange={handleFormChange}>
              <option value="Testing">Testing</option>
              <option value="Designing">Designing</option>
              <option value="Development">Development</option>
            </select>
          </label>
          <label>
            Hours:
            <input
              type="number"
              name="hours"
              value={form.hours}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleFormChange}
            />
          </label>
          <label>
            Day:
            <select name="day" value={form.day} onChange={handleFormChange}>
              <option value="Mon">Mon</option>
              <option value="Tue">Tue</option>
              <option value="Wed">Wed</option>
              <option value="Thu">Thu</option>
              <option value="Fri">Fri</option>
              <option value="Sat">Sat</option>
              <option value="Sun">Sun</option>
            </select>
          </label>
          <button type="button" onClick={handleAddNewRecord}>Add</button>
          <button type="button" onClick={handleCloseModal}>Close</button>
        </form>
      </Modal>
    </div>
  );
};

export default FillTimesheet;