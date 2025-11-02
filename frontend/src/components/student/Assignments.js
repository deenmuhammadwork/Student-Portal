// components/student/Assignments.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, isAfter } from "date-fns";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/assignments/student/assignments",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(res.data);

      // check submissions
      const statuses = {};
      for (const assignment of res.data) {
        try {
          const statusRes = await axios.get(
            `http://localhost:5000/api/assignments/student/submission/${assignment._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          statuses[assignment._id] = statusRes.data;
        } catch (err) {
          if (err.response?.status === 404) {
            statuses[assignment._id] = null;
          }
        }
      }
      setSubmissionStatus(statuses);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setMessage("Error loading assignments");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file to upload");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `http://localhost:5000/api/assignments/student/submit/${selectedAssignment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Assignment submitted successfully!");
      setSelectedAssignment(null);
      setFile(null);
      fetchAssignments();
    } catch (err) {
      console.error("Error submitting assignment:", err);
      setMessage(err.response?.data?.message || "Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };

  const isPastDeadline = (deadline) => {
    return isAfter(new Date(), new Date(deadline));
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-white bg-dark p-3 rounded text-center">My Assignments</h1>

      {message && (
        <div
          className={`alert ${
            message.includes("Error") ? "alert-danger" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="text-center p-5 border rounded bg-light">
          <i className="fas fa-clipboard-list fa-3x mb-3 text-secondary"></i>
          <h3>No assignments yet</h3>
          <p className="text-muted">
            Your teacher hasn't posted any assignments yet.
          </p>
        </div>
      ) : (
        <div className="row">
          {assignments.map((assignment) => {
            const submission = submissionStatus[assignment._id];
            const deadlinePassed = isPastDeadline(assignment.deadline);

            return (
              <div key={assignment._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  {/* header */}
                  <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <h5 className="mb-0 text-dark">
                      <i className="fas fa-file-alt me-2"></i>
                      {assignment.title}
                    </h5>
                    {assignment.file && (
                      <a
                        href={`http://localhost:5000/uploads/assignments/${assignment.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-success"
                      >
                        <i className="fas fa-download"></i>
                      </a>
                    )}
                  </div>

                  {/* body */}
                  <div className="card-body d-flex flex-column">
                    <p>{assignment.description}</p>

                    <ul className="list-unstyled mb-3 text-muted small">
                      <li>
                        <i className="fas fa-book me-2 text-info"></i>
                        {assignment.course}
                      </li>
                      <li>
                        <i className="fas fa-clock me-2 text-warning"></i>
                        Deadline: {format(new Date(assignment.deadline), "PPpp")}
                      </li>
                      <li>
                        <i className="fas fa-star me-2 text-secondary"></i>
                        Max Marks: {assignment.maxMarks}
                      </li>
                    </ul>

                    {/* status */}
                    <div className="mt-auto">
                      {submission ? (
                        <div className="border rounded p-2">
                          <div
                            className={`fw-bold mb-2 ${
                              submission.status === "graded"
                                ? "text-success"
                                : submission.status === "submitted"
                                ? "text-primary"
                                : "text-danger"
                            }`}
                          >
                            <i
                              className={`me-2 ${
                                submission.status === "graded"
                                  ? "fas fa-check-circle"
                                  : submission.status === "submitted"
                                  ? "fas fa-clock"
                                  : "fas fa-times-circle"
                              }`}
                            ></i>
                            {submission.status === "graded"
                              ? "Graded"
                              : submission.status === "submitted"
                              ? "Submitted"
                              : "Pending"}
                          </div>

                          {submission.submittedAt && (
                            <small className="text-muted d-block mb-1">
                              <i className="fas fa-calendar-alt me-1"></i>
                              Submitted:{" "}
                              {format(new Date(submission.submittedAt), "PPpp")}
                            </small>
                          )}

                          {submission.marks !== undefined && (
                            <span className="badge bg-success mb-1">
                              Marks: {submission.marks}/{assignment.maxMarks}
                            </span>
                          )}

                          {submission.feedback && (
                            <div className="text-dark small">
                              <i className="fas fa-comment-dots me-1"></i>
                              <p><strong>Teacher's Feedback:</strong></p>
                              {submission.feedback}
                            </div>
                          )}
                        </div>
                      ) : deadlinePassed ? (
                        <div className="alert alert-danger py-2">
                          <i className="fas fa-exclamation-circle me-2"></i>
                          Deadline Passed
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="btn btn-success"
                        >
                          <i className="fas fa-upload me-2"></i> Submit
                          Assignment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedAssignment && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              {/* header */}
              <div className="modal-header">
                <h5 className="modal-title">
                  Submit Assignment: {selectedAssignment.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedAssignment(null)}
                ></button>
              </div>

              {/* body */}
              <div className="modal-body">
                <p>{selectedAssignment.description}</p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {format(new Date(selectedAssignment.deadline), "PPpp")}
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      Upload your submission (PDF, Word, or Images)
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedAssignment(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? "Submitting..." : "Submit Assignment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
