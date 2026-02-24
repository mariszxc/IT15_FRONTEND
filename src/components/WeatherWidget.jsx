import React, { useEffect, useState } from "react";

const weatherLabels = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Rain",
  71: "Light snow",
  80: "Rain showers",
  95: "Thunderstorm",
};

function WeatherWidget() {
  const [status, setStatus] = useState("idle");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      setStatus("loading");
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true&timezone=Asia%2FManila",
          { signal: controller.signal }
        );
        const data = await response.json();
        const current = data.current_weather;
        setWeather({
          temp: Math.round(current.temperature),
          wind: Math.round(current.windspeed),
          code: current.weathercode,
          time: current.time,
        });
        setStatus("done");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("error");
        }
      }
    }

    loadWeather();
    return () => controller.abort();
  }, []);

  return (
    <section className="widget-card">
      <div className="widget-header">
        <p>Manila Weather</p>
        <span>Live via Open-Meteo</span>
      </div>
      {status === "loading" && <p className="widget-muted">Loading...</p>}
      {status === "error" && (
        <p className="widget-muted">Weather service unavailable.</p>
      )}
      {status === "done" && weather && (
        <div className="weather-body">
          <div>
            <h3>{weather.temp}°C</h3>
            <p>{weatherLabels[weather.code] || "Updated"}</p>
          </div>
          <div>
            <p className="weather-meta">Wind {weather.wind} km/h</p>
            <p className="weather-meta">Updated {weather.time}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default WeatherWidget;
