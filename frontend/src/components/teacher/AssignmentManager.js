// components/teacher/AssignmentManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const AssignmentManager = ({ teacherCourse }) => {
  const [showForm, setShowForm] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: teacherCourse || '', // Set default to teacher's course
    deadline: '',
    maxMarks: 10,
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/assignments/teacher/assignments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setMessage('Error loading assignments');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await axios.post('http://localhost:5000/api/assignments/create', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        course: teacherCourse || '', // Reset to teacher's course
        deadline: '',
        maxMarks: 10,
        file: null
      });
      fetchAssignments();
      setMessage('Assignment created successfully!');
    } catch (err) {
      console.error('Error creating assignment:', err);
      setMessage('Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  const viewAssignmentDetails = async (assignmentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/assignments/teacher/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedAssignment(res.data.assignment);
      setStudents(res.data.students);
    } catch (err) {
      console.error('Error fetching assignment details:', err);
      setMessage('Error loading assignment details');
    }
  };

  const gradeAssignment = async (studentId, marks, feedback) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/assignments/teacher/grade/${studentId}/${selectedAssignment._id}`, 
        { marks, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh the student list
      viewAssignmentDetails(selectedAssignment._id);
      setMessage('Grades updated successfully!');
    } catch (err) {
      console.error('Error grading assignment:', err);
      setMessage('Error updating grades');
    }
  };

  const deleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment? This will also remove all student submissions.')) {
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/assignments/teacher/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the assignments list
      fetchAssignments();
      setMessage('Assignment deleted successfully!');
      
      // If the deleted assignment was currently selected, clear the selection
      if (selectedAssignment && selectedAssignment._id === assignmentId) {
        setSelectedAssignment(null);
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setMessage('Error deleting assignment');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 text-white bg-dark p-3 rounded">Assignment Management</h2>
      
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}
      
      <div className="assignment-header mb-3">
        <button 
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New Assignment'}
        </button>
      </div>

      {showForm && (
        <div className="assignment-form card p-4 mb-4">
          <h3>Create New Assignment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Course</label>
              <div className="course-display p-2 bg-light rounded">
                <strong>{teacherCourse}</strong>
                <input
                  type="hidden"
                  name="course"
                  value={teacherCourse}
                />
              </div>
              <p className="text-muted small mt-1">Assignments are automatically created for your teaching course</p>
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Deadline</label>
              <input
                type="datetime-local"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Maximum Marks</label>
              <input
                type="number"
                name="maxMarks"
                className="form-control"
                value={formData.maxMarks}
                onChange={handleChange}
                min="1"
                max="100"
              />
            </div>
            <div className="form-group mb-3">
              <label className="form-label">Attachment (Optional)</label>
              <input
                type="file"
                name="file"
                className="form-control"
                onChange={handleChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Assignment'}
            </button>
          </form>
        </div>
      )}

      <div className="assignments-list">
        <h3>Your Assignments</h3>
        {assignments.length === 0 ? (
          <p>No assignments created yet.</p>
        ) : (
          assignments.map(assignment => (
            <div key={assignment._id} className="assignment-card card mb-3">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div className="assignment-info flex-grow-1">
                  <h4 className="card-title">{assignment.title}</h4>
                  <p className="card-text">{assignment.description}</p>
                  <div className="assignment-meta text-muted small">
                    <div>Course: {assignment.course}</div>
                    <div>Deadline: {format(new Date(assignment.deadline), 'PPpp')}</div>
                    <div>Max Marks: {assignment.maxMarks}</div>
                  </div>
                </div>
                <div className="assignment-actions d-flex flex-column gap-2">
                  <button 
                    onClick={() => viewAssignmentDetails(assignment._id)}
                    className="btn btn-success btn-sm"
                  >
                    View Submissions
                  </button>
                  <button 
                    onClick={() => deleteAssignment(assignment._id)}
                    className="btn btn-danger btn-sm"
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedAssignment && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submissions for: {selectedAssignment.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedAssignment(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="students-list">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Email</th>
                          <th>Course</th>
                          <th>Status</th>
                          <th>Marks</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <StudentRow 
                            key={student._id} 
                            student={student} 
                            onGrade={gradeAssignment}
                            maxMarks={selectedAssignment.maxMarks}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedAssignment(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentRow = ({ student, onGrade, maxMarks }) => {
  const [showGrading, setShowGrading] = useState(false);
  const [marks, setMarks] = useState(student.submission?.marks || '');
  const [feedback, setFeedback] = useState(student.submission?.feedback || '');

  const handleGradeSubmit = () => {
    onGrade(student._id, parseFloat(marks), feedback);
    setShowGrading(false);
  };

  return (
    <tr>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.course}</td>
      <td>
        <span className={`badge ${student.status === 'graded' ? 'bg-success' : student.status === 'submitted' ? 'bg-primary' : 'bg-warning'}`}>
          {student.status}
        </span>
      </td>
      <td>
        {student.submission?.marks !== undefined ? 
          `${student.submission.marks}/${maxMarks}` : 'N/A'
        }
      </td>
      <td>
        {student.submission ? (
          <div className="d-flex gap-1">
            <button 
              onClick={() => window.open(`http://localhost:5000/uploads/assignments/${student.submission.submissionFile}`, '_blank')}
              className="btn btn-info btn-sm"
            >
              View Submission
            </button>
            <button 
              onClick={() => setShowGrading(true)}
              className="btn btn-warning btn-sm"
            >
              {student.submission.marks !== undefined ? 'Edit Grade' : 'Grade'}
            </button>
          </div>
        ) : (
          <span className="text-muted">Not submitted</span>
        )}
      </td>

      {showGrading && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Grade Assignment for {student.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowGrading(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label className="form-label">Marks (0-{maxMarks})</label>
                  <input
                    type="number"
                    className="form-control"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    min="0"
                    max={maxMarks}
                    step="0.5"
                  />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Feedback</label>
                  <textarea
                    className="form-control"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowGrading(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleGradeSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </tr>
  );
};

export default AssignmentManager;