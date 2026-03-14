import React, { useMemo, useState, useEffect } from "react";
import { dashboardMetricsRequest } from "../services/api";
import eduManzanoSystemLogo from "../assets/EDUMANZANOSYSTEM.png";
import { TopbarUtilities } from "./Topbar";
import EnrollmentChart from "./dashboard/EnrollmentChart";
import CourseDistributionChart from "./dashboard/CourseDistributionChart";
import AttendanceChart from "./dashboard/AttendanceChart";
import LoadingSpinner from "./common/LoadingSpinner";

const EMPTY_METRICS = {
  totals: {
    students: 0,
    courses: 0,
    enrollments: 0,
  },
  enrollmentTrends: [],
  courseDistribution: [],
  attendancePatterns: [],
};

function normalizeDashboardMetrics(payload) {
  if (!payload || typeof payload !== "object") {
    return EMPTY_METRICS;
  }

  const summary = payload.summary || {};
  const monthlyEnrollment = payload.monthly_enrollment || payload.enrollmentTrends || [];
  const courseDistributionRaw = payload.course_distribution || payload.courseDistribution || [];
  const attendancePatternsRaw = payload.attendance_patterns || payload.attendancePatterns || [];

  const courseDistribution = courseDistributionRaw.map((item) => ({
    name: item.name,
    total: Number(item.total_students ?? item.total ?? 0),
  }));

  const enrollments = courseDistribution.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const attendancePatterns = attendancePatternsRaw.map((item) => ({
    school_day: item.school_day || item.month || "",
    rate: Number(item.rate ?? item.average_attendance_rate ?? 0),
  }));

  return {
    totals: {
      students: Number(summary.students ?? payload.totals?.students ?? 0),
      courses: Number(summary.courses ?? payload.totals?.courses ?? courseDistribution.length ?? 0),
      enrollments: Number(enrollments || payload.totals?.enrollments || 0),
    },
    enrollmentTrends: monthlyEnrollment.map((item) => ({
      month: item.month,
      total: Number(item.total ?? 0),
    })),
    courseDistribution,
    attendancePatterns,
  };
}

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [metricsStatus, setMetricsStatus] = useState("loading");
  const [metricsError, setMetricsError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDashboardMetrics() {
      setMetricsStatus("loading");
      setMetricsError("");

      try {
        const response = await dashboardMetricsRequest();
        if (!isActive) {
          return;
        }

        setMetrics(normalizeDashboardMetrics(response.data));
        setMetricsStatus("done");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setMetrics(EMPTY_METRICS);
        setMetricsStatus("error");
        setMetricsError(error.response?.data?.message || "Unable to load dashboard metrics.");
      }
    }

    loadDashboardMetrics();

    return () => {
      isActive = false;
    };
  }, []);

  const activeMetrics = metrics || EMPTY_METRICS;

  const overviewCards = [
    {
      title: "Total Students",
      value: metricsStatus === "loading" ? "-" : activeMetrics.totals?.students ?? "-",
    },
    {
      title: "Total Courses",
      value: metricsStatus === "loading" ? "-" : activeMetrics.totals?.courses ?? "-",
    },
    {
      title: "Total Enrollments",
      value: metricsStatus === "loading" ? "-" : activeMetrics.totals?.enrollments ?? "-",
    },
    {
      title: "Attendance Data Points",
      value: metricsStatus === "loading" ? "-" : activeMetrics.attendancePatterns?.length ?? "-",
    },
  ];

  const offeringsData = useMemo(
    () =>
      (activeMetrics.enrollmentTrends || []).map((item) => ({
        month: item.month,
        total: Number(item.total),
      })),
    [activeMetrics]
  );

  const statusData = useMemo(
    () =>
      (activeMetrics.courseDistribution || []).map((item) => ({
        name: item.name,
        total: Number(item.total),
      })),
    [activeMetrics]
  );

  const attendanceData = useMemo(
    () =>
      (activeMetrics.attendancePatterns || []).map((item) => ({
        school_day: item.school_day,
        rate: Number(item.rate),
      })),
    [activeMetrics]
  );

  return (
    <div className="dashboard-grid">
      <section className="dashboard-hero" aria-label="Portal overview banner">
        <img
          src={eduManzanoSystemLogo}
          alt="Edu Manzano portal logo"
          className="dashboard-hero-logo"
        />
        <div className="dashboard-hero-text">
          <p className="dashboard-hero-label">Official Portal</p>
          <h2>Edu Manzano Enrollment Dashboard</h2>
        </div>
        <div className="dashboard-hero-tools">
          <TopbarUtilities />
        </div>
      </section>

      <section className="overview-grid">
        {overviewCards.map((card) => (
          <article key={card.title} className="stat-card">
            <p className="stat-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p className="stat-hint">{card.hint}</p>
          </article>
        ))}
      </section>

      {metricsStatus !== "loading" && (
        <section className="chart-grid">
          <EnrollmentChart data={offeringsData} />
          <CourseDistributionChart data={statusData} />
          <AttendanceChart data={attendanceData} />
        </section>
      )}

      {metricsStatus === "loading" && <LoadingSpinner skeleton />}
      {metricsStatus === "error" && <div className="dashboard-feedback error">{metricsError}</div>}

      {metricsStatus !== "loading" && (
        <section className="list-two-col">
          <article className="table-card">
            <div className="table-header">
              <div>
                <p className="chart-title">Course Enrollment Summary</p>
              </div>
            </div>
            <ul className="recent-list">
              {statusData.map((course) => (
                <li key={course.name}>
                  <strong>{course.name}</strong>
                  <span>{course.total} students enrolled</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}
    </div>
  );
}

export default Dashboard;