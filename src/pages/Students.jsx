import React from "react";
import { studentSnapshot } from "../data/mockData";

function Students() {
  return (
    <div className="page-shell">
      <section className="info-card">
        <h2>Student Directory</h2>
        <p>Mock data prepared for future Laravel REST API integration.</p>
        <div className="info-grid">
          {studentSnapshot.map((item) => (
            <div key={item.label} className="info-item">
              <p>{item.label}</p>
              <h3>{item.value}</h3>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Students;
