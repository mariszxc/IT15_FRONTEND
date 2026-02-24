import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

const pageTitles = {
  "/dashboard": "Dashboard Module",
  "/dashboard/programs": "Program Offerings Module",
  "/dashboard/subjects": "Subject Offerings Module",
};

function DashboardLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard Module";

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
