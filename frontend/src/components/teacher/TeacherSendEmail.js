import React, { useState } from "react";
import axios from "axios";

const TeacherSendEmail = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("");

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "http://localhost:5000/api/teacher/send-email",
        emailData,
        config
      );

      setStatus("Email sent successfully!");
      setEmailData({ to: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          {/* Heading same as Admin */}
          <h2 className="mb-4 text-white bg-dark p-3 rounded text-center">
            Send Email
          </h2>

          {/* Card with form */}
          <div className="card shadow-lg p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">To (Email Address):</label>
                <input
                  type="email"
                  name="to"
                  value={emailData.to}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="recipient@example.com"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleChange}
                  required
                  className="form-control"
                  placeholder="Email Subject"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message:</label>
                <textarea
                  name="message"
                  value={emailData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="form-control"
                  placeholder="Type your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`btn btn-success w-100 ${
                  isSending ? "disabled" : ""
                }`}
              >
                {isSending ? "Sending..." : "Send Email"}
              </button>

              {status && (
                <div
                  className={`alert mt-3 ${
                    status.includes("success")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                >
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSendEmail;
