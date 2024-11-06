import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { db } from '../../../firebase/firebaseconfig';
import './GeneratePayslip.css';
import { useNavigate } from 'react-router-dom';

const GeneratePayslip = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [payPeriod, setPayPeriod] = useState('');
  const [overtime, setOvertime] = useState('');
  const [bonuses, setBonuses] = useState('');
  const [deductions, setDeductions] = useState('');
  const [loading, setLoading] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'employees'));
        const employeeList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(employeeList);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching employees: ", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      const selectedEmp = employees.find(emp => emp.firstName === selectedEmployee);
      setEmployeeDetails(selectedEmp || {});
    }
  }, [selectedEmployee, employees]);

  const handleGeneratePayslip = () => {
    const element = document.getElementById('payslip');
    element.style.display = 'block';
    html2canvas(element, { useCORS: true, allowTaint: true })
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0, undefined, 'FAST');
        pdf.save('payslip.pdf');
        element.style.display = 'none';
        navigate('/process-succesfull'); 

      })
      .catch(error => {
        console.error("Error generating PDF: ", error);
        element.style.display = 'none';
      });
  };

  return (
    <div className="payslip-container">
      <h1>Generate Payslip</h1>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <form>
          <label>
            Employee:
            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.firstName}>
                  {emp.firstName + " " + emp.lastName}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Pay Period:
            <input type="text" value={payPeriod} onChange={e => setPayPeriod(e.target.value)} />
          </label>
          <br />
          <label>
            Overtime:
            <input type="text" value={overtime} onChange={e => setOvertime(e.target.value)} />
          </label>
          <br />
          <label>
            Bonuses:
            <input type="text" value={bonuses} onChange={e => setBonuses(e.target.value)} />
          </label>
          <br />
          <label>
            Deductions:
            <input type="text" value={deductions} onChange={e => setDeductions(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleGeneratePayslip}>
            Generate Payslip
          </button>
        </form>
      )}

      <div id="payslip" className="payslip-template" style={{ display: 'none' }}>
        <div className="payslip-header">
          <h2>WorkWise</h2>
          <p>12345 Court Road, London W1T 1UY, Dummy</p>
          <p>Phone: +44 000 0000, Email: name@provider.com</p>
        </div>

        <div className="payslip-employee-details">
          <h3>Employee Information</h3>
          <p><strong>Full Name: </strong>{employeeDetails.firstName + ' ' + employeeDetails.lastName}</p>
          <p><strong>Address: </strong>123 Any Court Rd, London</p>
          <p><strong>Phone: </strong>+{employeeDetails.phone}</p>
          <p><strong>Email: </strong>{employeeDetails.email}</p>
        </div>

        <div className="payslip-earnings">
          <h3>Earnings</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Pay</td>
                <td>40</td>
                <td>12.50</td>
                <td>500.00</td>
              </tr>
              <tr>
                <td>Overtime Pay</td>
                <td>{overtime}</td>
                <td>15.00</td>
                <td>{parseFloat(overtime) * 15}</td>
              </tr>
              <tr>
                <td>Bonuses</td>
                <td></td>
                <td></td>
                <td>{bonuses}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payslip-deductions">
          <h3>Deductions</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>PAYE Tax</td>
                <td>{deductions}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="payslip-totals">
          <h3>Totals</h3>
          <p><strong>Gross Pay: </strong>{parseFloat(overtime) * 15 + parseFloat(bonuses)}</p>
          <p><strong>Total Deductions: </strong>{deductions}</p>
          <p><strong>Net Pay: </strong>{parseFloat(overtime) * 15 + parseFloat(bonuses) - parseFloat(deductions)}</p>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayslip;