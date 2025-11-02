// components/TeacherDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import About from '../sidebar/About';
import Contact from '../sidebar/Contact';
import AttendanceManager from '../attendence/AttendanceManager';
import AssignmentManager from './AssignmentManager';
import TeacherSendEmail from "../teacher/TeacherSendEmail";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 NEW
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const isTeacher = localStorage.getItem('isTeacher');
      
      if (!token || !isTeacher) {
        navigate('/teacher-login');
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const studentsRes = await axios.get('http://localhost:5000/api/teacher/students', config);
        setStudents(studentsRes.data);

        const userRes = await axios.get('http://localhost:5000/api/auth/teacher', config);
        setUser(userRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('isTeacher');
          navigate('/teacher-login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const indicatorTimer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 5000);

    return () => clearTimeout(indicatorTimer);
  }, [navigate]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && sidebarOpen) {
      setSidebarOpen(false);
    } else if (isRightSwipe && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const handleSidebarItemClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isTeacher');
    navigate('/teacher-login');
  };

 const renderContent = () => {
  // 🔍 Filter students by name
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  switch (activePage) {
    case 'home':
      return (
        <div style={{ width: '100%', minHeight: '100%' }}>
          <h1 className="mb-4 text-white bg-dark p-3 rounded">Welcome, {user?.name}!</h1>
          <p>You are teaching: {user?.teacherCourse}</p>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card text-white bg-primary shadow h-100">
                <div className="card-body text-center">
                  <h2 style={{ color: 'black' }}>Total Students</h2>
                  <p className="display-6 fw-bold" style={{ color: 'black' }}>{students.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card text-white bg-success shadow h-100">
                <div className="card-body text-center">
                  <h2 style={{ color: 'black' }}>Course</h2>
                  <br></br>
                  <p className="display-6 fw-bold" style={{ color: 'black' }}>{user?.teacherCourse}</p>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search student by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Students Table */}
          <div className="user-list">
            <h2>Your Students ({filteredStudents.length})</h2>

            {filteredStudents.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle shadow">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Batch</th>
                      <th>Shift</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.admissionForm?.courseDetails?.courseName || "N/A"}</td>
                        <td>{student.admissionForm?.courseDetails?.batchNo || "N/A"}</td>
                        <td>{student.admissionForm?.courseDetails?.shift || "N/A"}</td>
                        <td>{new Date(student.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );

    case 'assignments':
      return <AssignmentManager teacherCourse={user?.teacherCourse} />;

    case 'attendance':
      return <AttendanceManager teacher={user} students={students} />;

    case 'send-email':
      return <TeacherSendEmail userType="teacher" students={students} />;

    case 'about':
      return <About />;

    case 'contact':
      return <Contact />;

    default:
      return (
        <div className="container-fluid py-3">
          <h1>Welcome, {user?.name}!</h1>
          <p>You are teaching: {user?.teacherCourse}</p>
        </div>
      );
  }
};


  if (isLoading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Swipe Indicator */}
      <div className={`swipe-indicator ${showSwipeIndicator ? '' : 'hidden'}`}>
        <i className="fas fa-chevron-right"></i>
      </div>
       {/* Menu Button (mobile pe show) */}
<button 
  className="menu-btn d-lg-none" 
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  <i className="fas fa-bars"></i>
</button>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>


{/* Sidebar */}
<div
  ref={sidebarRef}
  className={`teacher-sidebar p-3 ${sidebarOpen ? "open" : "closed"}`}
>
  <div className="text-center mb-3">
  <img 
    src="/images.png" 
    alt="ICR Logo" 
    style={{ width: "180px", height: "auto" }}
  />
</div>
  <p className="text-light small text-center">Teacher Portal</p>

  <ul className="list-group list-group-flush">
    {[
      { page: "home", label: "Dashboard", icon: "fas fa-home" },
      { page: "attendance", label: "Attendance", icon: "fas fa-calendar-check" },
      { page: "assignments", label: "Assignments", icon: "fas fa-tasks" },
      { page: "send-email", label: "Send Email", icon: "fas fa-envelope" },
      { page: "about", label: "About Us", icon: "fas fa-info-circle" },
      { page: "contact", label: "Contact Us", icon: "fas fa-phone" },
    ].map((item) => (
      <li key={item.page} className="list-group-item bg-dark border-0 px-0">
        <a
          href={`#${item.page}`}
          className={`d-flex align-items-center text-white text-decoration-none py-2 px-2 rounded ${
            activePage === item.page ? "bg-primary" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            handleSidebarItemClick(item.page);
            setSidebarOpen(false); // mobile pe click ke baad sidebar band ho jaye
          }}
        >
          <i className={`${item.icon} me-2`}></i>
          {item.label}
        </a>
      </li>
    ))}
  </ul>

  <div className="mt-3">
    <button className="btn btn-danger w-100" onClick={logout}>
      Logout
    </button>
  </div>
</div>


      {/* Main Content */}
      <div 
        ref={contentRef}
        className="teacher-content"
    style={{ minHeight: "100vh" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
