import React from "react";

function DashboardPlaceholder({ title, description }) {
  return (
    <div className="page-shell">
      <section className="info-card">
        <h2>{title}</h2>
        <p>{description}</p>
      </section>
    </div>
  );
}

export default DashboardPlaceholder;
