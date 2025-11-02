import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const isTeacher = location.state?.isTeacher || false;

  const onChange = e => setVerificationCode(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-email', {
        code: verificationCode
      });

      setSuccess(res.data.message);
      setTimeout(() => {
        const userIsTeacher = res.data.isTeacher !== undefined 
          ? res.data.isTeacher 
          : isTeacher;
        if (userIsTeacher) {
          navigate('/teacher-login');
        } else {
          navigate('/login');
        }
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email
      });
      setSuccess('Verification email sent successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend verification email');
    }
  };

  const redirectToLogin = () => {
    if (isTeacher) {
      navigate('/teacher-login');
    } else {
      navigate('/login');
    }
  };

  return (
   
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="card-title text-center mb-3">Verify Your Email</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">6-Digit Verification Code</label>
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={onChange}
              required
              maxLength="6"
              placeholder="Enter the 6-digit code sent to your email"
              className="form-control"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn btn-success w-100"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="mb-1">Didn't receive the code?</p>
          <button
            onClick={resendVerification}
            className="btn btn-link p-0"
          >
            Resend Verification Email
          </button>
        </div>

        <div className="mt-4 text-center">
          <p>
            Already verified?{' '}
            <button
              onClick={redirectToLogin}
              className="btn btn-link p-0"
            >
              {isTeacher ? 'Teacher Login' : 'Student Login'}
            </button>
          </p>
        </div>
      </div>
    
  );
};

export default VerifyEmail;
