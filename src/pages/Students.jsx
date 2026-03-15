import React, { useEffect, useState } from "react";
import api from "../services/api";
import { logUserActivity } from "../utils/activityLog";
import { getEnrollmentRecordForStudent } from "../utils/enrollmentStore";
import FilterBar from "../components/FilterBar";

function Students() {
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsStatus, setStudentsStatus] = useState({ loading: true, error: "" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");

  const loadStudents = async () => {
    setStudentsStatus({ loading: true, error: "" });

    try {
      const response = await api.get("/students", { params: { per_page: 500 } });
      const payload = response.data;
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

      setStudents(rows);
      setStudentsStatus({ loading: false, error: "" });
    } catch (error) {
      setStudentsStatus({
        loading: false,
        error: error.response?.data?.message || "Unable to load students.",
      });
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const searchKey = search.trim().toLowerCase();

    if (!searchKey) {
      return true;
    }

    const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim().toLowerCase();

    return (
      String(student.student_number || "").toLowerCase().includes(searchKey) ||
      fullName.includes(searchKey) ||
      String(student.first_name || "").toLowerCase().includes(searchKey) ||
      String(student.last_name || "").toLowerCase().includes(searchKey)
    );
  });

  const capitalizeFirstLetter = (value) => {
    const trimmed = value.trimStart();

    if (!trimmed) {
      return value;
    }

    const firstChar = trimmed.charAt(0).toUpperCase();
    const rest = trimmed.slice(1).toLowerCase();
    const leadingSpaces = value.slice(0, value.length - trimmed.length);

    return `${leadingSpaces}${firstChar}${rest}`;
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    const nextValue =
      name === "firstName" || name === "lastName"
        ? capitalizeFirstLetter(value)
        : value;
    setStudentForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setFormStatus({ type: "", message: "" });
    setIsSaving(true);

    try {
      await api.post("/students", {
        first_name: studentForm.firstName,
        last_name: studentForm.lastName,
        email: studentForm.email,
      });

      logUserActivity({
        action: "Add",
        entity: "Student",
        description: `Added student ${studentForm.firstName} ${studentForm.lastName}.`,
      });

      handleFormCancel();
      setFormStatus({ type: "success", message: "Student saved successfully." });
      await loadStudents();
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.email?.[0] ||
        "Unable to save student. Please try again.";
      setFormStatus({ type: "error", message: apiMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormCancel = () => {
    setStudentForm({
      firstName: "",
      lastName: "",
      email: "",
    });
  };

  const handleViewProfile = async (student) => {
    setProfileStatus({ loading: true, error: "" });

    try {
      const response = await api.get(`/students/${student.id}`);
      const profile = response.data?.data || student;
      const enrollment = await getEnrollmentRecordForStudent(profile || student);
      setSelectedStudent({ ...profile, enrollment });
      setProfileStatus({ loading: false, error: "" });
      logUserActivity({
        action: "View",
        entity: "Student Profile",
        description: `Viewed profile of ${student.first_name} ${student.last_name}.`,
      });
    } catch (error) {
      const enrollment = await getEnrollmentRecordForStudent(student);
      setSelectedStudent({ ...student, enrollment });
      setProfileStatus({
        loading: false,
        error: error.response?.data?.message || "Unable to load student profile.",
      });
    }
  };

  const handleCloseProfile = () => {
    setSelectedStudent(null);
    setProfileStatus({ loading: false, error: "" });
  };

  return (
    <div className="page-shell">
      <FilterBar
        title="Student Filters"
        actions={(
          <button
            className="primary-btn"
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
          >
            Add Student
          </button>
        )}
      >
        <label className="filter-field">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student number or name"
          />
        </label>
      </FilterBar>

      <section className="info-card">
        <div className="table-header">
          <div>
            <h2>Students</h2>
            <span className="chart-subtitle">Showing {filteredStudents.length} of {students.length} students</span>
          </div>
        </div>

        {studentsStatus.loading && <p className="dashboard-feedback">Loading students...</p>}
        {studentsStatus.error && <p className="dashboard-feedback error">{studentsStatus.error}</p>}

        {!studentsStatus.loading && !studentsStatus.error && (
          <ul className="recent-list student-list">
            {filteredStudents.length === 0 && <li className="empty-state">No students match your search.</li>}
            {filteredStudents.map((student) => (
              <li key={student.id} className="student-row">
                <div className="student-row-main">
                  <div>
                    <strong>
                      {student.first_name} {student.last_name}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() => handleViewProfile(student)}
                  >
                    View Profile
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedStudent && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button type="button" className="modal-close-btn" onClick={handleCloseProfile} aria-label="Close">
              ×
            </button>
            <div className="table-header">
              <div>
                <h2>Student Profile</h2>
              </div>
            </div>

            {profileStatus.error && (
              <div className="dashboard-feedback error">{profileStatus.error}</div>
            )}

            {profileStatus.loading ? (
              <div className="dashboard-feedback">Loading profile...</div>
            ) : (
              <div className="details-grid">
                <div className="info-item">
                  <p>Student Number</p>
                  <strong>{selectedStudent.student_number || "-"}</strong>
                </div>
                <div className="info-item">
                  <p>First Name</p>
                  <strong>{selectedStudent.first_name}</strong>
                </div>
                <div className="info-item">
                  <p>Last Name</p>
                  <strong>{selectedStudent.last_name}</strong>
                </div>
                <div className="info-item">
                  <p>Email</p>
                  <strong>{selectedStudent.email}</strong>
                </div>
                <div className="info-item">
                  <p>Enrollment Status</p>
                  <strong>{selectedStudent.enrollment?.enrollmentStatus || "Not Enrolled"}</strong>
                </div>
                <div className="info-item">
                  <p>Batch</p>
                  <strong>{selectedStudent.enrollment?.batch || "-"}</strong>
                </div>
                <div className="info-item">
                  <p>Submitted</p>
                  <strong>{selectedStudent.enrollment?.submitted ? "Yes" : "No"}</strong>
                </div>
                <div className="info-item">
                  <p>Pending</p>
                  <strong>{selectedStudent.enrollment?.pending ? "Yes" : "No"}</strong>
                </div>
                <div className="info-item">
                  <p>Approved</p>
                  <strong>{selectedStudent.enrollment?.approved ? "Yes" : "No"}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => {
                handleFormCancel();
                setShowAddForm(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="table-header">
              <div>
                <h2>Add Student Information</h2>
              </div>
            </div>

            <form className="student-form" onSubmit={handleFormSubmit}>
              <div className="student-form-grid">
                <label className="student-form-field">
                  Student Number
                  <input
                    type="text"
                    name="studentNumber"
                    value="Auto-generated (6 digits)"
                    disabled
                    readOnly
                  />
                </label>

                <label className="student-form-field">
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={studentForm.firstName}
                    onChange={handleFormChange}
                    placeholder="Maris"
                  />
                </label>

                <label className="student-form-field">
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={studentForm.lastName}
                    onChange={handleFormChange}
                    placeholder="Bautista"
                  />
                </label>

                <label className="student-form-field">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={studentForm.email}
                    onChange={handleFormChange}
                    placeholder="student@example.com"
                  />
                </label>
              </div>

              <div className="student-form-actions">
                <button type="submit" className="action-btn save-btn" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>

              {formStatus.message && (
                <div className={`dashboard-feedback ${formStatus.type === "error" ? "error" : ""}`}>
                  {formStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
