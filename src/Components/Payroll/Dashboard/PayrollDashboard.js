import React from 'react';
import './PayrollDashboard.css';
import {
  FaDollarSign, FaUserAlt, FaChartLine, FaClock, FaMoneyBillWave, FaCalendarAlt, FaExclamationTriangle, FaCheckSquare
} from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const payrollData = [
  { name: 'Jan', salary: 4000, tax: 1200, bonus: 500 },
  { name: 'Feb', salary: 4500, tax: 1400, bonus: 300 },
  { name: 'Mar', salary: 5000, tax: 1500, bonus: 400 },
  { name: 'Apr', salary: 4700, tax: 1300, bonus: 600 },
  { name: 'May', salary: 5200, tax: 1600, bonus: 350 },
  { name: 'Jun', salary: 4800, tax: 1400, bonus: 200 },
];

const hoursData = [
  { name: 'Jan', hours: 160, overtime: 10 },
  { name: 'Feb', hours: 170, overtime: 5 },
  { name: 'Mar', hours: 165, overtime: 8 },
  { name: 'Apr', hours: 158, overtime: 12 },
  { name: 'May', hours: 175, overtime: 9 },
  { name: 'Jun', hours: 162, overtime: 6 },
];

const PayrollDashboard = () => {
  return (
    <div className="payroll-dashboard-container">
      <h1>Payroll Summary</h1>

      {/* Payroll Summary Stats */}
      <div className="payroll-stats">
        <div className="stat-card">
          <FaDollarSign className="stat-icon dollar-icon" />
          <h3>Total Salary Paid</h3>
          <p>$25,200</p>
        </div>
        <div className="stat-card">
          <FaUserAlt className="stat-icon user-icon" />
          <h3>Total Employees</h3>
          <p>45 Employees</p>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon clock-icon" />
          <h3>Total Overtime Payments</h3>
          <p>$1,500</p>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon chart-icon" />
          <h3>Total Tax Deducted</h3>
          <p>$8,400</p>
        </div>
        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon bonus-icon" />
          <h3>Total Bonuses</h3>
          <p>$2,350</p>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon calendar-icon" />
          <h3>Next Payroll Date</h3>
          <p>September 30, 2024</p>
        </div>
        <div className="stat-card">
          <FaExclamationTriangle className="stat-icon error-icon" />
          <h3>Payroll Errors</h3>
          <p>No Issues</p>
        </div>
        <div className="stat-card">
          <FaCheckSquare className="stat-icon approval-icon" />
          <h3>Pending Approvals</h3>
          <p>2 Pending</p>
        </div>
        </div>

      {/* Charts Section */}
      <div className="chart-container">
        <div className="chart-section">
          <h2>Salary & Tax Overview</h2>
          <LineChart width={600} height={300} data={payrollData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="salary" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="tax" stroke="#82ca9d" />
            <Line type="monotone" dataKey="bonus" stroke="#ffc658" />
          </LineChart>
        </div>

        <div className="chart-section">
          <h2>Hours Worked & Overtime</h2>
          <BarChart width={600} height={300} data={hoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#8884d8" />
            <Bar dataKey="overtime" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;