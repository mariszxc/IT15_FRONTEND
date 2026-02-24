import React from "react";

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-title">{title}</p>
          <span className="chart-subtitle">{subtitle}</span>
        </div>
        <button className="ghost-btn small">View</button>
      </div>
      <div className="chart-body">{children}</div>
    </section>
  );
}

export default ChartCard;
