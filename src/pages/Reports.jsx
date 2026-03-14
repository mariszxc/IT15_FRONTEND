import React, { useMemo } from "react";
import { downloadCsv } from "../utils/exportCsv";
import { getUserActivities } from "../utils/activityLog";

function Reports() {
  const activityRows = useMemo(() => {
    return getUserActivities().map((entry) => ({
      time: new Date(entry.timestamp).toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      action: entry.action,
      entity: entry.entity,
      details: entry.description,
    }));
  }, []);

  const handleExportReports = () => {
    downloadCsv("user-activity-reports.csv", activityRows);
  };

  return (
    <div className="page-shell">
      <section className="table-card">
        <div className="table-header">
          <div>
            <p className="chart-title">Reports Center</p>
          </div>
          <button className="ghost-btn small" type="button" onClick={handleExportReports}>
            Export
          </button>
        </div>
        <div className="table-body">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activityRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">No user activity recorded yet.</td>
                </tr>
              ) : (
                activityRows.map((row, index) => (
                  <tr key={`${row.time}-${index}`}>
                    <td>{row.time}</td>
                    <td>{row.action}</td>
                    <td>{row.entity}</td>
                    <td>{row.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Reports;
