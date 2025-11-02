import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import About from '../sidebar/About';
import Contact from '../sidebar/Contact';
import AdminSendEmail from './AdminSendEmail';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  // Minimum swipe distance to trigger sidebar open/close
  const minSwipeDistance = 50;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const isAdmin = localStorage.getItem('isAdmin');
      
      if (!token || !isAdmin) {
        navigate('/admin-login');
        return;
      }

      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        // Fetch both students and teachers
        const [usersRes, teachersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', config),
          axios.get('http://localhost:5000/api/admin/teachers', config)
        ]);

        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);
        setTeachers(teachersRes.data);
        setFilteredTeachers(teachersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAdmin');
          navigate('/admin-login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Hide swipe indicator after 5 seconds
    const indicatorTimer = setTimeout(() => {
      setShowSwipeIndicator(false);
    }, 5000);

    return () => clearTimeout(indicatorTimer);
  }, [navigate]);

  // Filter users and teachers based on search query and pending filter
  useEffect(() => {
    let filteredUsersList = [...users];
    let filteredTeachersList = [...teachers];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredUsersList = filteredUsersList.filter(user => 
        user.name.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.admissionForm?.courseDetails?.courseName && 
         user.admissionForm.courseDetails.courseName.toLowerCase().includes(query))
      );
      
      filteredTeachersList = filteredTeachersList.filter(teacher => 
        teacher.name.toLowerCase().includes(query) || 
        teacher.email.toLowerCase().includes(query) ||
        teacher.teacherCourse.toLowerCase().includes(query)
      );
    }
    
    // Apply pending approval filter
    if (showPendingOnly) {
      filteredUsersList = filteredUsersList.filter(user => !user.isApproved);
      filteredTeachersList = filteredTeachersList.filter(teacher => !teacher.isApproved);
    }
    
    setFilteredUsers(filteredUsersList);
    setFilteredTeachers(filteredTeachersList);
  }, [searchQuery, showPendingOnly, users, teachers]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const togglePendingFilter = () => {
    setShowPendingOnly(!showPendingOnly);
  };

  const viewAdmissionForm = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    const res = await axios.get(`http://localhost:5000/api/admission/${userId}`, config);
    console.log('Admission form data:', res.data); // <-- check yaha
    setSelectedUser({ id: userId, formData: res.data });
    setShowModal(true);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Error fetching admission form');
  }
};

  const approveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.put(
        `http://localhost:5000/api/admin/approve/${userId}`,
        {},
        config
      );

      setUsers(users.map(user => 
        user._id === userId ? res.data : user
      ));
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving user');
    }
  };

  const approveTeacher = async (teacherId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.put(
        `http://localhost:5000/api/admin/approve-teacher/${teacherId}`,
        {},
        config
      );

      setTeachers(teachers.map(teacher => 
        teacher._id === teacherId ? res.data : teacher
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving teacher');
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${userId}`,
        config
      );

      // Remove user from state
      setUsers(users.filter(user => user._id !== userId));
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
      
      // Close modal if it's open for this user
      if (showModal && selectedUser && selectedUser.id === userId) {
        setShowModal(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  // Delete teacher function
  const deleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(
        `http://localhost:5000/api/admin/delete-teacher/${teacherId}`,
        config
      );

      // Remove teacher from state
      setTeachers(teachers.filter(teacher => teacher._id !== teacherId));
      setFilteredTeachers(filteredTeachers.filter(teacher => teacher._id !== teacherId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting teacher');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin-login');
  };

  // Touch handlers for swipe gestures
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

  // Function to render file links
  const renderFileLink = (filePath, label) => {
    if (!filePath) return null;
    
    const fileName = filePath.split('/').pop();
    
    return (
      <div style={{ marginBottom: '10px' }}>
        <strong>{label}: </strong>
        <a 
          href={`http://localhost:5000/${filePath}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: '#007bff', 
            textDecoration: 'underline',
            marginLeft: '10px'
          }}
        >
          View {label} ({fileName})
        </a>
      </div>
    );
  };

  // Function to render multiple file links
  const renderMultipleFileLinks = (filePaths, label) => {
    if (!filePaths || filePaths.length === 0) return null;
    
    return (
      <div style={{ marginBottom: '15px' }}>
        <strong>{label}:</strong>
        {filePaths.map((filePath, index) => {
          const fileName = filePath.split('/').pop();
          return (
            <div key={index} style={{ marginLeft: '20px', marginTop: '5px' }}>
              <a 
                href={`http://localhost:5000/${filePath}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'underline' }}
              >
                {label} {index + 1} ({fileName})
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  // Add the verifyPayment function
  const verifyPayment = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.put(
        `http://localhost:5000/api/admission/verify-payment/${userId}`,
        {},
        config
      );

      setUsers(users.map(user => 
        user._id === userId ? res.data.user : user
      ));
      
      // If modal is open, update the selected user
      if (showModal && selectedUser && selectedUser.id === userId) {
        setSelectedUser({
          ...selectedUser,
          formData: {
            ...selectedUser.formData,
            paymentVerified: true
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error verifying payment');
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

 const renderContent = () => {
  switch (activePage) {
    case "dashboard":
      return (
        
        <div style={{ width: '100%', minHeight: '100%' }}>
  <h1 className="mb-4 text-white bg-dark p-3 rounded">Admin Dashboard</h1>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div
                className="card text-white bg-primary shadow h-100"
                role="button"
                onClick={() => setActiveTab("students")}
              >
                <div className="card-body text-center">
                  <h3 style={{ color: 'black' }}>Total Students</h3>
                  <p className="display-6 fw-bold" style={{ color: 'black' }}>{users.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="card text-white bg-success shadow h-100"
                role="button"
                onClick={() => setActiveTab("teachers")}
              >
                <div className="card-body text-center">
                  <h3 style={{ color: 'black' }}>Total Teachers</h3>
                  <p className="display-6 fw-bold" style={{ color: 'black' }}>{teachers.length}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className={`card text-white shadow h-100 ${
                  showPendingOnly ? "bg-warning" : "bg-warning"
                }`}
                role="button"
                onClick={togglePendingFilter}
              >
                <div className="card-body text-center">
                  <h3 style={{ color: 'black' }}>Pending Approvals</h3>
                  <p className="display-6 fw-bold" style={{ color: 'black' }}>
                    {users.filter((u) => !u.isApproved).length +
                      teachers.filter((t) => !t.isApproved).length}
                  </p>
                  <small  style={{color: 'black'}}>
                    {showPendingOnly
                      ? "Click to show all"
                      : "Click to show pending only"}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "students" ? "active" : ""
                }`}
                onClick={() => setActiveTab("students")}
              >
                Students
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "teachers" ? "active" : ""
                }`}
                onClick={() => setActiveTab("teachers")}
              >
                Teachers
              </button>
            </li>
          </ul>

          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control w-100"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Students Table */}
          {activeTab === "students" && (
            <div className="user-list">
              <h2>Registered Students ({filteredUsers.length})</h2>
              {filteredUsers.length === 0 ? (
                <p>No students found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle shadow">
                    <thead className="table-primary">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Admission Form</th>
                        <th>Payment</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            {user.hasSubmittedAdmissionForm &&
                            user.admissionForm?.courseDetails?.courseName
                              ? user.admissionForm.courseDetails.courseName
                              : "N/A"}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.isApproved
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {user.isApproved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td>
                            {user.hasSubmittedAdmissionForm ? (
                              <span className="badge bg-info">Submitted</span>
                            ) : (
                              <span className="badge bg-secondary">
                                Not Submitted
                              </span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.admissionForm?.paymentVerified
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {user.admissionForm?.paymentVerified
                                ? "Verified"
                                : "Pending"}
                            </span>
                            {user.admissionForm?.paymentMethod === "card" &&
                              user.admissionForm?.paymentVerified && (
                                <small className="ms-1">(Card)</small>
                              )}
                          </td>
                          <td>{formatDate(user.date)}</td>
                          <td>
                            <div className="d-flex flex-column gap-2">
                              {user.hasSubmittedAdmissionForm && (
                                <button
                                  onClick={() => viewAdmissionForm(user._id)}
                                  className="btn btn-info btn-sm"
                                >
                                  View
                                </button>
                              )}
                              {!user.isApproved && (
                                <button
                                  onClick={() => approveUser(user._id)}
                                  className="btn btn-success btn-sm"
                                >
                                  Approve
                                </button>
                              )}
                              {!user.admissionForm?.paymentVerified &&
                                user.admissionForm?.paymentMethod ===
                                  "challan" && (
                                  <button
                                    onClick={() => verifyPayment(user._id)}
                                    className="btn btn-primary btn-sm"
                                  >
                                    Verify Payment
                                  </button>
                                )}
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Teachers Table */}
          {activeTab === "teachers" && (
            <div className="user-list">
              <h2>Registered Teachers ({filteredTeachers.length})</h2>
              {filteredTeachers.length === 0 ? (
                <p>No teachers found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle shadow">
                    <thead className="table-primary">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher._id}>
                          <td>{teacher.name}</td>
                          <td>{teacher.email}</td>
                          <td>{teacher.teacherCourse}</td>
                          <td>
                            <span
                              className={`badge ${
                                teacher.isApproved
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {teacher.isApproved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td>{formatDate(teacher.date)}</td>
                          <td>
                            <div className="d-flex flex-column gap-2">
                              {!teacher.isApproved && (
                                <button
                                  onClick={() => approveTeacher(teacher._id)}
                                  className="btn btn-success btn-sm"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => deleteTeacher(teacher._id)}
                                className="btn btn-danger btn-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      );
    case "about":
      return <About />;
    case "contact":
      return <Contact />;
    case "send-email":
      return <AdminSendEmail />;
    default:
      return (
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome to the administration panel.</p>
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

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

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
  <p className="text-light small text-center">Admin Portal</p>

  <ul className="list-group list-group-flush">
    {[
      { page: "dashboard", label: "Dashboard", icon: "fas fa-home" },
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
       className="Admin-content"
    style={{ minHeight: "100vh" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="content-container">
          {renderContent()}
        </div>
      </div>
      
      {/* Modal for viewing admission form */}
      {showModal && selectedUser && (
        <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050,
    }}
    onClick={() => setShowModal(false)}>
          <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)',
      }}
      onClick={(e) => e.stopPropagation()}> 
            <h2>Admission Form Details - {selectedUser.formData.personalDetails?.studentName}</h2>
            
            {/* Course Details */}
            <div className="section">
              <h3>Course Details</h3>
              <p><strong>Course:</strong> {selectedUser.formData.courseDetails?.courseName || 'N/A'}</p>
              <p><strong>Batch:</strong> {selectedUser.formData.courseDetails?.batchNo || 'N/A'}</p>
              <p><strong>Shift:</strong> {selectedUser.formData.courseDetails?.shift || 'N/A'}</p>
            </div>

            {/* Personal Details */}
            <div className="section">
              <h3>Personal Details</h3>
              <p><strong>Name:</strong> {selectedUser.formData.personalDetails?.studentName || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {selectedUser.formData.personalDetails?.dob ? new Date(selectedUser.formData.personalDetails.dob).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Gender:</strong> {selectedUser.formData.personalDetails?.gender || 'N/A'}</p>
              <p><strong>Religion:</strong> {selectedUser.formData.personalDetails?.religion || 'N/A'}</p>
              <p><strong>CNIC:</strong> {selectedUser.formData.personalDetails?.cnic || 'N/A'}</p>
              <p><strong>Address:</strong> {selectedUser.formData.personalDetails?.address || 'N/A'}</p>
              <p><strong>Mobile:</strong> {selectedUser.formData.personalDetails?.mobile || 'N/A'}</p>
              <p><strong>Father's Name:</strong> {selectedUser.formData.personalDetails?.fatherName || 'N/A'}</p>
              <p><strong>Father's Profession:</strong> {selectedUser.formData.personalDetails?.fatherProfession || 'N/A'}</p>
              <p><strong>Father's Income:</strong> {selectedUser.formData.personalDetails?.fatherIncome || 'N/A'}</p>
            </div>

            {/* Educational Details */}
            <div className="section">
              <h3>Educational Details</h3>
              
              <h4>Matriculation</h4>
              <p><strong>School/Board:</strong> {selectedUser.formData.educationalDetails?.matric?.school || 'N/A'}</p>
              <p><strong>Year of Passing:</strong> {selectedUser.formData.educationalDetails?.matric?.year || 'N/A'}</p>
              <p><strong>Subjects:</strong> {selectedUser.formData.educationalDetails?.matric?.subjects || 'N/A'}</p>
              <p><strong>Marks (%):</strong> {selectedUser.formData.educationalDetails?.matric?.marks || 'N/A'}</p>
              
              <h4>Intermediate</h4>
              <p><strong>School/Board:</strong> {selectedUser.formData.educationalDetails?.intermediate?.school || 'N/A'}</p>
              <p><strong>Year of Passing:</strong> {selectedUser.formData.educationalDetails?.intermediate?.year || 'N/A'}</p>
              <p><strong>Subjects:</strong> {selectedUser.formData.educationalDetails?.intermediate?.subjects || 'N/A'}</p>
              <p><strong>Marks (%):</strong> {selectedUser.formData.educationalDetails?.intermediate?.marks || 'N/A'}</p>
              
              <h4>Graduation</h4>
              <p><strong>School/Board:</strong> {selectedUser.formData.educationalDetails?.graduation?.school || 'N/A'}</p>
              <p><strong>Year of Passing:</strong> {selectedUser.formData.educationalDetails?.graduation?.year || 'N/A'}</p>
              <p><strong>Subjects:</strong> {selectedUser.formData.educationalDetails?.graduation?.subjects || 'N/A'}</p>
              <p><strong>Marks (%):</strong> {selectedUser.formData.educationalDetails?.graduation?.marks || 'N/A'}</p>
              
              <h4>Masters</h4>
              <p><strong>School/Board:</strong> {selectedUser.formData.educationalDetails?.masters?.school || 'N/A'}</p>
              <p><strong>Year of Passing:</strong> {selectedUser.formData.educationalDetails?.masters?.year || 'N/A'}</p>
              <p><strong>Subjects:</strong> {selectedUser.formData.educationalDetails?.masters?.subjects || 'N/A'}</p>
              <p><strong>Marks (%):</strong> {selectedUser.formData.educationalDetails?.masters?.marks || 'N/A'}</p>
            </div>

            {/* Work Experience */}
            <div className="section">
              <h3>Work Experience</h3>
              <p><strong>Duration:</strong> {selectedUser.formData.workExperience?.duration || 'N/A'}</p>
              <p><strong>Company Name:</strong> {selectedUser.formData.workExperience?.companyName || 'N/A'}</p>
              <p><strong>Joining Date:</strong> {selectedUser.formData.workExperience?.joiningDate ? new Date(selectedUser.formData.workExperience.joiningDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Reason to Leave:</strong> {selectedUser.formData.workExperience?.reasonLeave || 'N/A'}</p>
              <p><strong>End Date:</strong> {selectedUser.formData.workExperience?.endDate ? new Date(selectedUser.formData.workExperience.endDate).toLocaleDateString() : 'N/A'}</p>
            </div>

            {/* Career Plan */}
            <div className="section">
              <h3>Career Plan</h3>
              <p>{selectedUser.formData.careerPlan || 'N/A'}</p>
            </div>

            {/* Declaration */}
            <div className="section">
              <h3>Declaration</h3>
              <p><strong>Student Name:</strong> {selectedUser.formData.declaration?.studentName || 'N/A'}</p>
              <p><strong>Parent Name:</strong> {selectedUser.formData.declaration?.parentName || 'N/A'}</p>
              <p><strong>Date:</strong> {selectedUser.formData.declaration?.date ? new Date(selectedUser.formData.declaration.date).toLocaleDateString() : 'N/A'}</p>
            </div>

            {/* Documents */}
            <div className="section">
              <h3>Documents</h3>
              {renderFileLink(selectedUser.formData.documents?.passportPic, 'Passport Picture')}
              {renderFileLink(selectedUser.formData.documents?.cnicDoc, 'CNIC/B-Form')}
              {renderMultipleFileLinks(selectedUser.formData.documents?.academicDocs, 'Academic Document')}
              {renderFileLink(selectedUser.formData.documents?.paymentReceipt, 'Payment Receipt')}
            </div>

             {/* // In the modal section, add this after the documents section */}
              <div className="section">
                <h3>Payment Information</h3>
                <p>
                  <strong>Payment Method:</strong> {selectedUser.formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Challan'}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
    <span
      className={`fw-bold ${
        selectedUser.formData.paymentVerified ? "text-success" : "text-warning"
      }`}
    >
      {selectedUser.formData.paymentVerified ? "Verified" : "Pending"}
    </span>
  </p>
  {selectedUser.formData.paymentMethod === "card" &&
    selectedUser.formData.paymentIntentId && (
      <p>
        <strong>Stripe Payment ID:</strong> {selectedUser.formData.paymentIntentId}
      </p>
    )}
</div>

<div className="mt-3 d-flex flex-wrap gap-2">
  {!users.find((user) => user._id === selectedUser.id)?.isApproved && (
    <button
      className="btn btn-success"
      onClick={() => approveUser(selectedUser.id)}
    >
      Approve Student
    </button>
  )}
  <button
    className="btn btn-danger"
    onClick={() => deleteUser(selectedUser.id)}
  >
    Delete Student
  </button>

              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;