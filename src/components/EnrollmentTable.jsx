import React from "react";

function EnrollmentTable({ rows }) {
  return (
    <section className="table-card">
      <div className="table-header">
        <div>
          <p className="chart-title">Recent Enrollment Activity</p>
          <span className="chart-subtitle">Live queue (mock data)</span>
        </div>
        <button className="ghost-btn small">Manage</button>
      </div>
      <div className="table-body">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Program</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const statusClass = row.status.toLowerCase().replace(" ", "-");
              return (
              <tr key={row.id}>
                <td>
                  <div className="table-primary">{row.student}</div>
                  <div className="table-secondary">{row.id}</div>
                </td>
                <td>{row.program}</td>
                <td>
                  <span className={`status-pill ${statusClass}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.date}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default EnrollmentTable;
