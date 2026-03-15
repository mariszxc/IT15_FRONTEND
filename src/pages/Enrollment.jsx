import React, { useEffect, useMemo, useState } from "react";
import { logUserActivity } from "../utils/activityLog";
import api from "../services/api";
import { enrollStudentRecord, getEnrollmentRecords } from "../utils/enrollmentStore";

const getCurrentBatch = () =>
  new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });

function Enrollment() {
  const [students, setStudents] = useState([]);
  const [studentStatus, setStudentStatus] = useState({ loading: true, error: "" });
  const [searchValue, setSearchValue] = useState("");
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });
  const [records, setRecords] = useState(() => getEnrollmentRecords());

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      setStudentStatus({ loading: true, error: "" });

      try {
        const response = await api.get("/students", { params: { per_page: 500 } });

        if (!isMounted) {
          return;
        }

        const payload = response.data;
        const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];

        setStudents(rows);
        setStudentStatus({ loading: false, error: "" });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStudents([]);
        setStudentStatus({
          loading: false,
          error: error.response?.data?.message || "Unable to load students for enrollment.",
        });
      }
    }

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const enrollmentSummary = useMemo(() => {
    const submitted = records.filter((record) => record.submitted).length;
    const pending = records.filter((record) => record.pending).length;
    const approved = records.filter((record) => record.approved).length;

    return [
      { label: "Batch", count: records[0]?.batch || getCurrentBatch()},
      { label: "Submitted", count: String(submitted)},
      { label: "Pending", count: String(pending) },
      { label: "Approved", count: String(approved) },
    ];
  }, [records]);

  const filteredStudents = useMemo(() => {
    const key = searchValue.trim().toLowerCase();

    if (!key) {
      return students;
    }

    return students.filter((student) => {
      const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim().toLowerCase();
      return (
        String(student.student_number || "").toLowerCase().includes(key) ||
        fullName.includes(key) ||
        String(student.first_name || "").toLowerCase().includes(key) ||
        String(student.last_name || "").toLowerCase().includes(key)
      );
    });
  }, [students, searchValue]);

  const handleEnrollStudent = (student) => {
    if (!student) {
      setActionMessage({ type: "error", text: "No student selected for enrollment." });
      return;
    }

    const record = enrollStudentRecord(student);
    setRecords(getEnrollmentRecords());

    logUserActivity({
      action: "Enroll",
      entity: "Student",
      description: `Enrolled student ${record.studentName || student.student_number}.`,
      metadata: {
        studentId: student.id,
        studentNumber: student.student_number,
        batch: record.batch,
      },
    });

    setActionMessage({
      type: "success",
      text: `${record.studentName || "Student"} is now enrolled for ${record.batch}.`,
    });
    setSearchValue("");
  };

  return (
    <div className="page-shell">
      <section className="info-card">
        <div className="table-header">
          <div>
            <h2>Enrollment Status</h2>
          </div>
          <div style={{ minWidth: 280 }}>
            <label className="filter-field">
            <input
              type="text"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search by student number or name"
            />
            </label>
            </div>
        </div>

        {actionMessage.text && (
          <p className={`dashboard-feedback ${actionMessage.type === "error" ? "error" : ""}`}>
            {actionMessage.text}
          </p>
        )}

        <div className="pipeline">
          {enrollmentSummary.map((stage) => (
            <div key={stage.label} className="pipeline-card">
              <h3>{stage.count}</h3>
              <p>{stage.label}</p>
              <span>{stage.note}</span>
            </div>
          ))}
        </div>

        {studentStatus.loading && <p className="dashboard-feedback">Loading students...</p>}
        {studentStatus.error && <p className="dashboard-feedback error">{studentStatus.error}</p>}

        {!studentStatus.loading && !studentStatus.error && (
          <ul className="recent-list student-list" style={{ marginTop: 16 }}>
            {filteredStudents.length === 0 && (
              <li className="empty-state">No students found for the selected search option.</li>
            )}

            {filteredStudents.map((student) => (
              <li key={student.id} className="student-row">
                <div className="student-row-main">
                  <div>
                    <strong>
                      {student.first_name} {student.last_name}
                    </strong>
                    <p style={{ marginTop: 4, color: "var(--text-muted)" }}>
                      Student No: {student.student_number || "-"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() => handleEnrollStudent(student)}
                  >
                    Enroll
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Enrollment;
