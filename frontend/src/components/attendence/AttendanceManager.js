import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

const AttendanceManager = ({ teacher, students }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentAttendanceHistory, setStudentAttendanceHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
    fetchAvailableDates();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:5000/api/attendance/date/${selectedDate}`, config);

      if (res.data && res.data.length > 0) {
        const formattedRecords = res.data.map(record => ({
          _id: record._id,
          studentId: record.studentId._id || record.studentId,
          studentName: record.studentId.name || record.studentName,
          status: record.status,
          date: record.date
        }));
        setAttendanceRecords(formattedRecords);
        setIsEditing(true);
      } else {
        const defaultRecords = students.map(student => ({
          studentId: student._id,
          studentName: student.name,
          status: 'absent',
          date: selectedDate
        }));
        setAttendanceRecords(defaultRecords);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setMessage('Error loading attendance data');
    }
  };

  const fetchAvailableDates = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/api/attendance/dates', config);
      setAvailableDates(res.data);
    } catch (err) {
      console.error('Error fetching available dates:', err);
    }
  };

  const fetchStudentAttendanceHistory = async (studentId) => {
    setIsLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await axios.get(`http://localhost:5000/api/attendance/student/${studentId}`, config);
      setStudentAttendanceHistory(res.data);
    } catch (err) {
      console.error('Error fetching student attendance history:', err);
      setMessage('Error loading student attendance history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceRecords(prevRecords =>
      prevRecords.map(record => record.studentId === studentId ? { ...record, status: newStatus } : record)
    );
  };

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    await fetchStudentAttendanceHistory(student.studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setStudentAttendanceHistory([]);
  };

  const updateStudentAttendance = async (recordId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/attendance/${recordId}`, { status: newStatus }, config);

      setStudentAttendanceHistory(prevRecords =>
        prevRecords.map(record => record._id === recordId ? { ...record, status: newStatus } : record)
      );

      const updatedRecord = studentAttendanceHistory.find(record => record._id === recordId);
      if (updatedRecord && format(parseISO(updatedRecord.date), 'yyyy-MM-dd') === selectedDate) {
        setAttendanceRecords(prevRecords =>
          prevRecords.map(record => record.studentId === updatedRecord.studentId ? { ...record, status: newStatus } : record)
        );
      }

      setMessage('Attendance updated successfully!');
    } catch (err) {
      console.error('Error updating attendance:', err);
      setMessage('Error updating attendance: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const payload = {
        date: selectedDate,
        attendanceRecords: attendanceRecords.map(record => ({
          studentId: record.studentId || record.studentId._id,
          status: record.status
        }))
      };
      await axios.post('http://localhost:5000/api/attendance/submit', payload, config);
      setMessage('Attendance submitted successfully!');
      setIsEditing(true);
      fetchAvailableDates();
      fetchAttendanceData();
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setMessage('Error submitting attendance: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = (studentId, currentStatus) => {
    const newStatus = currentStatus === 'absent' ? 'present' : currentStatus === 'present' ? 'leave' : 'absent';
    handleStatusChange(studentId, newStatus);
  };

  const getStatusButtonClass = (status) => {
    switch (status) {
      case 'present': return 'btn-success';
      case 'absent': return 'btn-danger';
      case 'leave': return 'btn-warning';
      default: return 'btn-secondary';
    }
  };

  const getStatusText = (status) => status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-white bg-dark p-3 rounded">Attendance Management</h2>
      <p className="mb-4">Course: {teacher.teacherCourse}</p>

      {/* Date Picker & Buttons */}
      <div className="mb-3 row g-2 align-items-center">
        <label htmlFor="attendance-date" className="col-12 col-md-auto col-form-label">Select Date:</label>
        <div className="col-12 col-md-auto">
          <input
            type="date"
            id="attendance-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-12 mt-2 col-md-auto mt-md-0 d-flex flex-wrap">
          {availableDates.map(date => (
            <button
              key={date}
              className={`btn btn-outline-primary btn-sm me-1 mb-1 ${date === selectedDate ? 'active' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              {format(parseISO(date), 'MMM dd')}
            </button>
          ))}
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
          {message}
        </div>
      )}

      {/* Attendance Table */}
      <h5 className="mt-4">Student Attendance for {format(parseISO(selectedDate), 'MMMM dd, yyyy')}</h5>
      {attendanceRecords.length === 0 ? (
        <p>No students found for this course.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map(record => (
                <tr key={record.studentId}>
                  <td>
                    <button className="btn btn-link p-0" onClick={() => handleStudentClick(record)}>
                      {record.studentName}
                    </button>
                  </td>
                  <td className="text-center">
                    <span className={`badge ${record.status === 'present' ? 'bg-success' : record.status === 'absent' ? 'bg-danger' : 'bg-warning'}`}>
                      {getStatusText(record.status)}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className={`btn btn-sm ${getStatusButtonClass(record.status)}`}
                      onClick={() => toggleStatus(record.studentId, record.status)}
                      disabled={isSubmitting}
                    >
                      Mark {record.status === 'absent' ? 'Present' : record.status === 'present' ? 'Leave' : 'Absent'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-3">
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : isEditing ? 'Update Attendance' : 'Submit Attendance'}
        </button>
      </div>

      {/* Student Attendance History Modal */}
      {isModalOpen && selectedStudent && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Attendance History for {selectedStudent.studentName}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                {isLoadingHistory ? (
                  <p>Loading...</p>
                ) : studentAttendanceHistory.length === 0 ? (
                  <p>No attendance records found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendanceHistory.map(record => (
                          <tr key={record._id}>
                            <td>{format(parseISO(record.date), 'MMMM dd, yyyy')}</td>
                            <td>
                              <span className={`badge ${record.status === 'present' ? 'bg-success' : record.status === 'absent' ? 'bg-danger' : 'bg-warning'}`}>
                                {getStatusText(record.status)}
                              </span>
                            </td>
                            <td>
                              <select
                                value={record.status}
                                onChange={(e) => updateStudentAttendance(record._id, e.target.value)}
                                className="form-select form-select-sm"
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="leave">Leave</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AttendanceManager;
