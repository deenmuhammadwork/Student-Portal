// components/StudentPanel.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import About from '../sidebar/About';
import Contact from '../sidebar/Contact';
import AttendanceSummary from '../attendence/AttendanceSummary';
import MyProfile from './MyProfile';
import MyCourses from './MyCourses';
import Schedule from './Schedule';
import Assignments from './Assignments';

const StudentPanel = () => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [attendanceData, setAttendanceData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get('http://localhost:5000/api/auth/user', config);
        setUser(res.data);

        if (!res.data.hasSubmittedAdmissionForm) {
          navigate('/admission-form');
          return;
        }

        const attendanceRes = await axios.get(
          'http://localhost:5000/api/attendance/student/summary',
          config
        );
        setAttendanceData(attendanceRes.data);
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
    const indicatorTimer = setTimeout(() => setShowSwipeIndicator(false), 5000);
    return () => clearTimeout(indicatorTimer);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSidebarItemClick = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && sidebarOpen) setSidebarOpen(false);
    if (distance < -minSwipeDistance && !sidebarOpen) setSidebarOpen(true);
  };

 const renderContent = () => {
    switch (activePage) {
      case 'home':
  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      <h1 className="mb-4 text-white bg-dark p-3 rounded">Welcome, {user?.name}!</h1>
      <div className="d-flex flex-wrap gap-3" style={{ marginTop: '20px' }}>
        <div
          className="card text-white bg-primary shadow"
          style={{ cursor: 'pointer', flex: '1 1 250px', minWidth: '250px', height: '150px' }}
          onClick={() => setActivePage('courses')}
        >
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h3 style={{ color: 'black' }}>My Courses</h3>
            <p style={{ color: 'black' }}>Explore your courses and training programs</p>
          </div>
        </div>

        <div
          className="card text-white bg-success shadow"
          style={{ cursor: 'pointer', flex: '1 1 250px', minWidth: '250px', height: '150px' }}
          onClick={() => setActivePage('schedule')}
        >
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h3 style={{ color: 'black' }}>Schedule</h3>
            <p style={{ color: 'black' }}>Check your class timetable</p>
          </div>
        </div>

        <div
          className="card text-dark bg-warning shadow"
          style={{ cursor: 'pointer', flex: '1 1 250px', minWidth: '250px', height: '150px' }}
          onClick={() => setActivePage('assignments')}
        >
          <div className="card-body d-flex flex-column justify-content-center align-items-center">
            <h3 style={{ color: 'black' }}>Assignments</h3>
            <p style={{ color: 'black' }}>View all your assignments and progress</p>
          </div>
        </div>
      </div>

      {attendanceData && (
        <div className="mt-4">
          <h2>Attendance Summary</h2>
          <AttendanceSummary data={attendanceData} />
        </div>
      )}
    </div>
  );


      case 'courses':
        return <MyCourses />;
      case 'schedule':
        return <Schedule />;
      case 'assignments':
        return <Assignments />;
      case 'profile':
        return <MyProfile />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'attendance':
        return attendanceData ? (
          <AttendanceSummary data={attendanceData} detailed={true} />
        ) : (
          <p>Loading attendance data...</p>
        );
      default:
        return <h1>Welcome, {user?.name}!</h1>;
    }
  };

  if (!user) return <div className="p-3">Loading...</div>;

  return (
    <div className="d-flex m-0 p-0" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>

            {/* Menu Button (mobile pe show) */}
<button 
  className="menu-btn d-lg-none" 
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  <i className="fas fa-bars"></i>
</button>
      {/* Sidebar */}
<div
  ref={sidebarRef}
  className={`sidebar d-flex flex-column p-3 m-0 ${sidebarOpen ? "open" : "closed"}`}
>
  <div className="text-center mb-3">
  <img 
    src="/images.png" 
    alt="ICR Logo" 
    style={{ width: "180px", height: "auto" }}
  />
</div>

  <p className="text-light small text-center">Student Portal</p>

  <ul className="list-group list-group-flush flex-grow-1 p-0 m-0">
    {[
      { page: "home", label: "Home", icon: "fas fa-home" },
      { page: "attendance", label: "Attendance", icon: "fas fa-chart-bar" },
      { page: "assignments", label: "Assignments", icon: "fas fa-tasks" },
      { page: "courses", label: "Courses", icon: "fas fa-book" },
      { page: "schedule", label: "Schedule", icon: "fas fa-calendar-alt" },
      { page: "profile", label: "My Profile", icon: "fas fa-user" },
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


     {/* Main content */}
<div
  ref={contentRef}
  className="content"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentPanel;