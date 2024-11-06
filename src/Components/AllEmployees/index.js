import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseconfig';
import './AllEmployees.css';
import { FaEllipsisV } from 'react-icons/fa';

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, 'employees'));
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmployees(employeesData);
    };
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredEmployees.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleActions = (id) => {
    setShowActions(showActions === id ? null : id);
  };

  return (
    <div className="all-employees-container">
      <h1>All Employees</h1>
      <input
        type="text"
        placeholder="Search employees with names..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <table className="employees-table">
        <thead>
          <tr>
            <th>Employee Code</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Job Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(employee => (
            <tr key={employee.id}>
              <td>{employee.employeeCode}</td>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.department}</td>
              <td>{employee.jobTitle}</td>
              <td>
                <div className="actions-container">
                  <FaEllipsisV onClick={() => toggleActions(employee.id)} />
                  {showActions === employee.id && (
                    <div className="actions-menu">
                      <ul>
                        <li>View</li>
                        <li>Edit</li>
                        <li>Delete</li>
                      </ul>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredEmployees.length / recordsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
};

export default AllEmployees;