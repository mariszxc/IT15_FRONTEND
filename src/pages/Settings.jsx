import React from "react";

function Settings() {
  return (
    <div className="page-shell">
      <section className="info-card">
        <h2>Settings</h2>
        <p>Configure enrollment rules, notifications, and integrations.</p>
        <div className="settings-grid">
          <div className="settings-item">
            <p>Academic year</p>
            <h3>2025 - 2026</h3>
            <span>Default intake schedule</span>
          </div>
          <div className="settings-item">
            <p>Notifications</p>
            <h3>Enabled</h3>
            <span>Email and SMS alerts</span>
          </div>
          <div className="settings-item">
            <p>API status</p>
            <h3>Ready</h3>
            <span>Awaiting Laravel endpoint</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;
