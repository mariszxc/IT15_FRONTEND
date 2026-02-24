import React from "react";
import { courseCatalog } from "../data/mockData";

function Courses() {
  return (
    <div className="page-shell">
      <section className="table-card">
        <div className="table-header">
          <div>
            <p className="chart-title">Course Catalog</p>
            <span className="chart-subtitle">Active offerings (mock data)</span>
          </div>
          <button className="ghost-btn small">Add Course</button>
        </div>
        <div className="table-body">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Program</th>
                <th>Units</th>
                <th>Slots</th>
              </tr>
            </thead>
            <tbody>
              {courseCatalog.map((course) => (
                <tr key={course.code}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.units}</td>
                  <td>{course.slots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Courses;
