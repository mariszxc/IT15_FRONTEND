import React from "react";
import { NavLink } from "react-router-dom";
import eduManzanoLogo from "../assets/Edu manzano.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Students", path: "/dashboard/students" },
  { label: "Courses", path: "/dashboard/courses" },
  { label: "Enrollment", path: "/dashboard/enrollment" },
  { label: "Reports", path: "/dashboard/reports" },
  { label: "Settings", path: "/dashboard/settings" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <img
            src={eduManzanoLogo}
            alt="Edu Manzano logo"
            className="brand-logo"
          />
        </div>
        <div>
          <p className="brand-title">Edu Manzano</p>
          <p className="brand-subtitle">Enrollment System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end={item.path === "/dashboard"}
          >
            <span className="link-dot"></span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>SY 2025-2026</p>
        <span>Prototype build</span>
      </div>
    </aside>
  );
}

export default Sidebar;
