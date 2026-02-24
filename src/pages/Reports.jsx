import React from "react";
import { reportQueue } from "../data/mockData";

function Reports() {
  return (
    <div className="page-shell">
      <section className="table-card">
        <div className="table-header">
          <div>
            <p className="chart-title">Reports Center</p>
            <span className="chart-subtitle">Operational analytics</span>
          </div>
          <button className="ghost-btn small">Generate</button>
        </div>
        <div className="table-body">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {reportQueue.map((report) => {
                const statusClass = report.status.toLowerCase().replace(" ", "-");
                return (
                <tr key={report.title}>
                  <td>{report.title}</td>
                  <td>{report.owner}</td>
                  <td>
                    <span className={`status-pill ${statusClass}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.updated}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Reports;
