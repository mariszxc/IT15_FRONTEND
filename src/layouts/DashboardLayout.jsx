import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

const pageTitles = {
  "/dashboard": "Enrollment Overview",
  "/dashboard/students": "Students",
  "/dashboard/courses": "Courses",
  "/dashboard/enrollment": "Enrollment",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

function DashboardLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Enrollment Overview";

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboard-main">
        <Topbar title={title} />
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
