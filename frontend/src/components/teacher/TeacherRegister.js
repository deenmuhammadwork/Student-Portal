import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const TeacherRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    teacherCourse: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, password2, teacherCourse } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== password2) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/teacher-register', {
        name,
        email,
        password,
        teacherCourse
      });

      if (res.data.requiresVerification) {
        navigate('/verify-email', { state: { email, isTeacher: true } });
      } else {
        setSuccess(res.data.message);
        setError('');
        setFormData({
          name: '',
          email: '',
          password: '',
          password2: '',
          teacherCourse: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
   
       
  <div className="shadow p-4 rounded-3"
        style={{ maxWidth: "400px", width: "100%", background: "#ffffff" }}>
        <h2 className="text-center mb-4">Teacher Registration</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Course</label>
            <select
              name="teacherCourse"
              value={teacherCourse}
              onChange={onChange}
              className="form-select"
              required
            >
              <option value="">Select a Course</option>
              <option value="Web Development (MERN Stack)">Web Development (MERN Stack)</option>
              <option value="App Development">App Development</option>
              <option value="Graphic Designing">Graphic Designing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Shopify / Ecommerce">Shopify / Ecommerce</option>
              <option value="Business Development">Business Development</option>
              <option value="ICR For Kids">ICR For Kids</option>
              <option value="YouTube Automation">YouTube Automation</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="English Language">English Language</option>
              <option value="IELTS">IELTS</option>
              <option value="Other Specialized">Other Specialized</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p>Already have an account? <Link to="/teacher-login">Teacher Login</Link></p>
        </div>
      </div>
    
  );
};

export default TeacherRegister;
