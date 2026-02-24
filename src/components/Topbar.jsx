import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Topbar({ title }) {
  const navigate = useNavigate();
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [temperature, setTemperature] = useState(null);
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const weekday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadTopbarWeather() {
      setWeatherStatus("loading");
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=7.4478&longitude=125.8078&current_weather=true&timezone=Asia%2FManila",
          { signal: controller.signal }
        );
        const data = await response.json();
        const current = data.current_weather;
        setTemperature(Math.round(current.temperature));
        setWeatherStatus("done");
      } catch (error) {
        if (error.name !== "AbortError") {
          setWeatherStatus("error");
        }
      }
    }

    loadTopbarWeather();
    return () => controller.abort();
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const weatherValue =
    weatherStatus === "done" && temperature !== null
      ? `${temperature}°C`
      : weatherStatus === "error"
      ? "Unavailable"
      : "Loading...";

  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">Enrollment System</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <span className="topbar-date" aria-label="Current date">
          <span className="topbar-date-label">{weekday}</span>
          <span className="topbar-date-value">{formattedDate}</span>
        </span>
        <span className="topbar-weather" aria-live="polite">
          <span className="topbar-weather-location">Davao del Norte</span>
          <span className="topbar-weather-value">{weatherValue}</span>
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Topbar;
