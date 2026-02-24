import React from "react";

function StatCard({ title, value, delta, hint }) {
  const trendClass = delta.includes("+") ? "positive" : "neutral";

  return (
    <div className="stat-card">
      <div>
        <p className="stat-title">{title}</p>
        <h3>{value}</h3>
      </div>
      <div className={`stat-delta ${trendClass}`}>{delta}</div>
      <p className="stat-hint">{hint}</p>
    </div>
  );
}

export default StatCard;
