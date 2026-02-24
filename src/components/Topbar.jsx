import React from "react";
import { useNavigate } from "react-router-dom";

function Topbar({ title }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Enrollment System</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button className="ghost-btn">Export</button>
        <button className="primary-btn">New Request</button>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Topbar;
