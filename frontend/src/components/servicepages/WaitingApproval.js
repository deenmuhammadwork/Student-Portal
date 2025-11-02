import React from 'react';
import { useNavigate } from 'react-router-dom';

const WaitingApproval = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="card-title text-center mb-3">Waiting for Approval</h3>
        <p>Your admission form has been submitted successfully and is waiting for admin approval.</p>
        <p>You will be able to access the dashboard once your application is approved.</p>
        <button 
          onClick={logout} 
          className="btn btn-success w-100 mt-3"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default WaitingApproval;
