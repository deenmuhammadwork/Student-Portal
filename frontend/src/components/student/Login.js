import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

    localStorage.setItem('token', res.data.token);

    const { isApproved, hasSubmittedAdmissionForm } = res.data.user;

    if (!hasSubmittedAdmissionForm) {
      // Student has not submitted admission form yet
      navigate('/admission-form');
    } else if (!isApproved) {
      // Student submitted form but waiting for admin approval
      navigate('/waiting-approval');
    } else {
      // Approved student, go to dashboard
      navigate('/dashboard');
    }

  } catch (err) {
    if (err.response?.data?.requiresVerification) {
      navigate('/verify-email', { state: { email } });
    } else if (err.response?.data?.requiresApproval) {
      navigate('/waiting-approval');
    } else {
      setError(err.response?.data?.message || 'Login failed');
    }
  }
};


  return (
   
       
<div className="shadow p-4 rounded-3"
        style={{ maxWidth: "400px", width: "100%", background: "#ffffff" }}>
        <h2 className="text-center mb-4">Student Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Login</button>
        </form>

        <div className="mt-3 text-center">
          <p className="mb-1">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
  
  );
};

export default Login;
