import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import WeatherWidget from "../components/WeatherWidget";
import Chatbot from "../components/Chatbot";
import EnrollmentTable from "../components/EnrollmentTable";
import { enrollmentRows, statCards } from "../data/mockData";
import eduManzanoLogo from "../assets/Edu manzano.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "New Enrollments",
      data: [120, 180, 160, 210, 240, 260, 230, 280],
      borderColor: "#5f4bb6",
      backgroundColor: "rgba(95, 75, 182, 0.18)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const barData = {
  labels: ["IT", "BSBA", "BSEd", "BSTM", "BSA"],
  datasets: [
    {
      label: "Capacity",
      data: [320, 240, 280, 190, 210],
      backgroundColor: [
        "#2d2a63",
        "#6a4bc4",
        "#8a79d6",
        "#4b3a90",
        "#9b8ef0",
      ],
      borderRadius: 10,
    },
  ],
};

const doughnutData = {
  labels: ["Approved", "Pending", "For Review"],
  datasets: [
    {
      data: [68, 22, 10],
      backgroundColor: ["#2d2a63", "#6a4bc4", "#c9c1f5"],
      borderWidth: 0,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(45, 42, 99, 0.08)",
      },
      ticks: {
        stepSize: 50,
      },
    },
  },
};

function DashboardHome() {
  return (
    <div className="dashboard-grid">
      <section className="dashboard-hero">
        <img
          src={eduManzanoLogo}
          alt="Edu Manzano logo"
          className="dashboard-hero-logo"
        />
        <div className="dashboard-hero-text">
          <p className="dashboard-hero-label">Official Portal</p>
          <h2>Edu Manzano Enrollment Dashboard</h2>
          <span>Modern prototype ready for Laravel REST API integration</span>
        </div>
      </section>

      <section className="overview-grid">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="chart-grid">
        <ChartCard title="Enrollment Trend" subtitle="Semester intake overview">
          <Line data={lineData} options={chartOptions} height={160} />
        </ChartCard>
        <ChartCard title="Program Capacity" subtitle="Available seats per track">
          <Bar data={barData} options={chartOptions} height={160} />
        </ChartCard>
        <ChartCard title="Approval Breakdown" subtitle="Enrollment decisions">
          <Doughnut data={doughnutData} options={{ responsive: true }} />
        </ChartCard>
      </section>

      <section className="widget-grid">
        <WeatherWidget />
        <Chatbot />
      </section>

      <EnrollmentTable rows={enrollmentRows} />
    </div>
  );
}

export default DashboardHome;
