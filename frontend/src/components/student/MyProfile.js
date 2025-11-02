// src/components/student/MyProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get(
          "http://localhost:5000/api/auth/user",
          config
        );
        setUserData(res.data);
        setFormData(res.data.admissionForm);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (section, field, value, subSection = null) => {
    setFormData((prev) => {
      if (subSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [field]: value,
            },
          },
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };
      }
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        { admissionForm: formData },
        config
      );
      setUserData(res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile data...</div>;
  if (!userData) return <div className="text-center mt-5">Error loading profile data.</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-white bg-dark p-3 rounded">My Profile</h1>

      {userData.hasSubmittedAdmissionForm && formData ? (
        editMode ? (
          <div className="card shadow-sm p-4">
            <h2 className="mb-3">Edit Profile</h2>

            <h4>Personal Information</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Full Name</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.studentName}
                      onChange={(e) =>
                        handleChange("personalDetails", "studentName", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>DOB</th>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.personalDetails.dob.split("T")[0]}
                      onChange={(e) =>
                        handleChange("personalDetails", "dob", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Gender</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.gender}
                      onChange={(e) =>
                        handleChange("personalDetails", "gender", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>CNIC</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.cnic}
                      onChange={(e) =>
                        handleChange("personalDetails", "cnic", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.address}
                      onChange={(e) =>
                        handleChange("personalDetails", "address", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.mobile}
                      onChange={(e) =>
                        handleChange("personalDetails", "mobile", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Father's Name</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.fatherName}
                      onChange={(e) =>
                        handleChange("personalDetails", "fatherName", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Father's Profession</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.personalDetails.fatherProfession || ""}
                      onChange={(e) =>
                        handleChange("personalDetails", "fatherProfession", e.target.value)
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <h4 className="mt-4">Course Information</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Course Name</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.courseDetails.courseName}
                      onChange={(e) =>
                        handleChange("courseDetails", "courseName", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Batch</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.courseDetails.batchNo}
                      onChange={(e) =>
                        handleChange("courseDetails", "batchNo", e.target.value)
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Shift</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.courseDetails.shift}
                      onChange={(e) =>
                        handleChange("courseDetails", "shift", e.target.value)
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <h4 className="mt-4">Educational Background</h4>
            <h5>Matric</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>School</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.matric.school}
                      onChange={(e) =>
                        handleChange("educationalDetails", "school", e.target.value, "matric")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Year</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.matric.year}
                      onChange={(e) =>
                        handleChange("educationalDetails", "year", e.target.value, "matric")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Subjects</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.matric.subjects}
                      onChange={(e) =>
                        handleChange("educationalDetails", "subjects", e.target.value, "matric")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Marks</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.matric.marks}
                      onChange={(e) =>
                        handleChange("educationalDetails", "marks", e.target.value, "matric")
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <h5>Intermediate</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>College</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.intermediate.school}
                      onChange={(e) =>
                        handleChange("educationalDetails", "school", e.target.value, "intermediate")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Year</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.intermediate.year}
                      onChange={(e) =>
                        handleChange("educationalDetails", "year", e.target.value, "intermediate")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Subjects</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.intermediate.subjects}
                      onChange={(e) =>
                        handleChange("educationalDetails", "subjects", e.target.value, "intermediate")
                      }
                    />
                  </td>
                </tr>
                <tr>
                  <th>Marks</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.educationalDetails.intermediate.marks}
                      onChange={(e) =>
                        handleChange("educationalDetails", "marks", e.target.value, "intermediate")
                      }
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            

            <div className="text-end">
              <button className="btn btn-success me-2" onClick={handleUpdate}>Save Changes</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm p-4">
            <h2 className="mb-3">Profile Details</h2>

            <h4>Personal Information</h4>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr><th>Full Name</th><td>{formData.personalDetails.studentName}</td></tr>
                <tr><th>DOB</th><td>{new Date(formData.personalDetails.dob).toLocaleDateString()}</td></tr>
                <tr><th>Gender</th><td>{formData.personalDetails.gender}</td></tr>
                <tr><th>CNIC</th><td>{formData.personalDetails.cnic}</td></tr>
                <tr><th>Address</th><td>{formData.personalDetails.address}</td></tr>
                <tr><th>Mobile</th><td>{formData.personalDetails.mobile}</td></tr>
                <tr><th>Father's Name</th><td>{formData.personalDetails.fatherName}</td></tr>
                <tr><th>Father's Profession</th><td>{formData.personalDetails.fatherProfession}</td></tr>
              </tbody>
            </table>

            <h4 className="mt-4">Course Information</h4>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr><th>Course Name</th><td>{formData.courseDetails.courseName}</td></tr>
                <tr><th>Batch</th><td>{formData.courseDetails.batchNo}</td></tr>
                <tr><th>Shift</th><td>{formData.courseDetails.shift}</td></tr>
              </tbody>
            </table>

            <h4 className="mt-4">Educational Background</h4>
            <h5>Matric</h5>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr><th>School</th><td>{formData.educationalDetails.matric.school}</td></tr>
                <tr><th>Year</th><td>{formData.educationalDetails.matric.year}</td></tr>
                <tr><th>Subjects</th><td>{formData.educationalDetails.matric.subjects}</td></tr>
                <tr><th>Marks</th><td>{formData.educationalDetails.matric.marks}</td></tr>
              </tbody>
            </table>

            <h5>Intermediate</h5>
            <table className="table table-bordered table-striped">
              <tbody>
                <tr><th>College</th><td>{formData.educationalDetails.intermediate.school}</td></tr>
                <tr><th>Year</th><td>{formData.educationalDetails.intermediate.year}</td></tr>
                <tr><th>Subjects</th><td>{formData.educationalDetails.intermediate.subjects}</td></tr>
                <tr><th>Marks</th><td>{formData.educationalDetails.intermediate.marks}</td></tr>
              </tbody>
            </table>

            <div className="text-end">
              <button className="btn btn-success" onClick={() => setEditMode(true)}>Edit Profile</button>
            </div>
          </div>
        )
      ) : (
        <div className="alert alert-info text-center">
          <p>You haven't submitted an admission form yet.</p>
          <a className="btn btn-success" href="/admission-form">Complete your admission form now</a>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
