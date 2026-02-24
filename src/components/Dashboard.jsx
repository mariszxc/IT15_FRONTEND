import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { getDashboardSummary } from "../data/catalogData";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  const summary = getDashboardSummary();

  const overviewCards = [
    {
      title: "Total Programs",
      value: summary.totalPrograms,
      hint: "All offerings in the system",
    },
    {
      title: "Total Subjects",
      value: summary.totalSubjects,
      hint: "Combined subject catalog",
    },
    {
      title: "Active vs Inactive",
      value: `${summary.activePrograms} / ${summary.inactivePrograms}`,
      hint: "Active / Non-active programs",
    },
    {
      title: "Subjects with Pre-requisites",
      value: summary.subjectsWithPrerequisites,
      hint: "Subjects requiring prior courses",
    },
  ];

  const offeringsData = {
    labels: ["Per Semester", "Per Term", "Both"],
    datasets: [
      {
        label: "Subjects",
        data: [
          summary.subjectsPerOffering.semester,
          summary.subjectsPerOffering.term,
          summary.subjectsPerOffering.both,
        ],
        backgroundColor: ["#2d2a63", "#6a4bc4", "#9b8ef0"],
        borderRadius: 10,
      },
    ],
  };

  const statusData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [summary.activePrograms, summary.inactivePrograms],
        backgroundColor: ["#2d2a63", "#c9c1f5"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="dashboard-grid">
      <section className="overview-grid">
        {overviewCards.map((card) => (
          <article key={card.title} className="stat-card">
            <p className="stat-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p className="stat-hint">{card.hint}</p>
          </article>
        ))}
      </section>

      <section className="chart-grid">
        <article className="chart-card">
          <div className="chart-header">
            <div>
              <p className="chart-title">Subjects per Semester/Term</p>
              <span className="chart-subtitle">Distribution by offering mode</span>
            </div>
          </div>
          <div className="chart-body">
            <Bar data={offeringsData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </article>

        <article className="chart-card">
          <div className="chart-header">
            <div>
              <p className="chart-title">Program Status Mix</p>
              <span className="chart-subtitle">Active versus inactive programs</span>
            </div>
          </div>
          <div className="chart-body">
            <Doughnut data={statusData} options={{ responsive: true }} />
          </div>
        </article>
      </section>

      <section className="list-two-col">
        <article className="table-card">
          <div className="table-header">
            <div>
              <p className="chart-title">Recently Added Programs</p>
            </div>
          </div>
          <ul className="recent-list">
            {summary.recentPrograms.map((program) => (
              <li key={program.code}>
                <strong>{program.code}</strong>
                <span>{program.fullName}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="table-card">
          <div className="table-header">
            <div>
              <p className="chart-title">Recently Added Subjects</p>
            </div>
          </div>
          <ul className="recent-list">
            {summary.recentSubjects.map((subject) => (
              <li key={subject.code}>
                <strong>{subject.code}</strong>
                <span>{subject.title}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;