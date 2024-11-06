import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseconfig';

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'payments')); // Assuming 'payments' is the collection in Firestore
        const paymentList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPaymentHistory(paymentList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payment history: ", error);
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <div className='payment-history'> 
      <h1>Payment History</h1>
      {loading ? (
        <p>Loading payment history...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Payment Date</th>
              <th>Pay Period</th>
              <th>Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map(payment => (
              <tr key={payment.id}>
                <td>{payment.employeeName}</td>
                <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                <td>{payment.payPeriod}</td>
                <td>{payment.netPay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;