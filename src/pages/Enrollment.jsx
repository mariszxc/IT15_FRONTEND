import React from "react";
import { enrollmentPipeline } from "../data/mockData";

function Enrollment() {
  return (
    <div className="page-shell">
      <section className="info-card">
        <h2>Enrollment Pipeline</h2>
        <p>Stages and timelines prepared for API wiring.</p>
        <div className="pipeline">
          {enrollmentPipeline.map((stage) => (
            <div key={stage.label} className="pipeline-card">
              <h3>{stage.count}</h3>
              <p>{stage.label}</p>
              <span>{stage.note}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Enrollment;
