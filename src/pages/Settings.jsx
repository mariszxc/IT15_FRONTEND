import React, { useEffect, useState } from "react";
import { logUserActivity } from "../utils/activityLog";

function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("dashboard_theme_mode") || "light";
    const dark = savedMode === "dark";
    setIsDarkMode(dark);
    document.documentElement.setAttribute("data-theme", savedMode);
  }, []);

  const handleToggleMode = () => {
    const nextDarkMode = !isDarkMode;
    const nextMode = nextDarkMode ? "dark" : "light";

    setIsDarkMode(nextDarkMode);
    localStorage.setItem("dashboard_theme_mode", nextMode);
    document.documentElement.setAttribute("data-theme", nextMode);

    logUserActivity({
      action: "Update",
      entity: "Settings",
      description: `Switched dashboard theme to ${nextMode} mode.`,
      metadata: { theme: nextMode },
    });
  };

  return (
    <div className="page-shell settings-theme-shell">
      <div className="settings-theme-panel">
        <div>
          <h2>Theme Mode</h2>
          <p className="chart-subtitle">Use the slide switch to toggle between Light and Dark mode.</p>
        </div>
        <label className="theme-toggle" aria-label="Toggle dark mode">
          <input type="checkbox" checked={isDarkMode} onChange={handleToggleMode} />
          <span className="theme-toggle-slider" />
          <span className="theme-toggle-label">{isDarkMode ? "Dark" : "Light"}</span>
        </label>
      </div>
    </div>
  );
}

export default Settings;
