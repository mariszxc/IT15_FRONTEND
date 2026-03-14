import React, { useEffect, useMemo, useState } from "react";
import WeatherWidget from "./weather/WeatherWidget";
import { schoolDaysRequest } from "../services/api";

export function TopbarUtilities() {
  const [weatherStatus, setWeatherStatus] = useState("idle");
  const [temperature, setTemperature] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarRows, setCalendarRows] = useState([]);
  const [calendarTotal, setCalendarTotal] = useState(0);
  const [calendarMonthCursor, setCalendarMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hi! I’m your assistant. Ask me about dashboard features.",
    },
  ]);
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

  const weatherValue =
    weatherStatus === "done" && temperature !== null
      ? `${temperature}°C`
      : weatherStatus === "error"
      ? "Unavailable"
      : "Loading...";

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const monthTitle = calendarMonthCursor.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarMap = useMemo(() => {
    const map = new Map();

    for (const row of calendarRows) {
      if (row?.date) {
        map.set(row.date, row);
      }
    }

    return map;
  }, [calendarRows]);

  const monthCells = useMemo(() => {
    const year = calendarMonthCursor.getFullYear();
    const month = calendarMonthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay.getDay();
    const cells = [];

    for (let index = 0; index < offset; index += 1) {
      cells.push({ key: `blank-${index}`, isBlank: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const key = formatDateKey(date);
      const row = calendarMap.get(key) || null;

      cells.push({
        key,
        day,
        row,
        isBlank: false,
      });
    }

    return cells;
  }, [calendarMonthCursor, calendarMap]);

  const monthEvents = useMemo(() => {
    const year = calendarMonthCursor.getFullYear();
    const month = calendarMonthCursor.getMonth();

    return calendarRows
      .filter((row) => {
        if (!row?.event || !row?.date) {
          return false;
        }

        const date = new Date(`${row.date}T00:00:00`);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [calendarRows, calendarMonthCursor]);

  async function openAcademicCalendar() {
    setIsCalendarOpen(true);
    const today = new Date();
    setCalendarMonthCursor(new Date(today.getFullYear(), today.getMonth(), 1));

    if (calendarRows.length > 0 || calendarLoading) {
      return;
    }

    setCalendarLoading(true);
    setCalendarError("");

    try {
      const response = await schoolDaysRequest({ page: 1, per_page: 300 });
      const rows = response?.data?.data || [];
      const total = Number(response?.data?.meta?.total || rows.length || 0);
      setCalendarRows(rows);
      setCalendarTotal(total);
    } catch (error) {
      setCalendarRows([]);
      setCalendarTotal(0);
      setCalendarError(error.response?.data?.message || "Unable to load academic calendar records.");
    } finally {
      setCalendarLoading(false);
    }
  }

  const totalRecordedDays = calendarTotal || calendarRows.length;
  const holidayCount = calendarRows.filter((item) => item.is_holiday).length;
  const schoolDayCount = calendarRows.filter((item) => item.is_school_day).length;
  const eventCount = calendarRows.filter((item) => item.event && item.event.trim().length > 0).length;

  function getBotReply(message) {
    const query = message.toLowerCase();

    if (query.includes("report") || query.includes("export")) {
      return "You can export data from Reports, Students, and Enrollment using each page's Export button.";
    }

    if (query.includes("weather") || query.includes("date")) {
      return "Topbar weather is set to Tagum City and updates from the weather API.";
    }

    if (query.includes("settings") || query.includes("save")) {
      return "Go to Settings to update preferences and click Save Changes at the bottom.";
    }

    if (query.includes("hello") || query.includes("hi")) {
      return "Hello! How can I help with your dashboard today?";
    }

    return "Thanks for your message. I can help with reports, exports, settings, and dashboard navigation.";
  }

  function handleChatSubmit(event) {
    event.preventDefault();
    const value = chatInput.trim();
    if (!value) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: value,
    };

    const botMessage = {
      id: Date.now() + 1,
      role: "bot",
      text: getBotReply(value),
    };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setChatInput("");
  }

  return (
    <div className="topbar-utilities">
      <div className="topbar-actions">
        <button
          className="topbar-date topbar-date-btn"
          type="button"
          aria-label="Open academic calendar"
          onClick={openAcademicCalendar}
        >
          <span className="topbar-status-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
            </svg>
          </span>
          <span className="topbar-status-content">
            <span className="topbar-date-label">{weekday}</span>
            <span className="topbar-date-value">{formattedDate}</span>
          </span>
        </button>
        <button
          className="topbar-weather topbar-weather-live"
          type="button"
          onClick={() => setIsWeatherOpen(true)}
          aria-live="polite"
        >
          <span className="topbar-status-icon weather-live-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16a4 4 0 1 1 1.2-7.8A5 5 0 0 1 17 10h.5a3.5 3.5 0 1 1 0 7H6z" />
            </svg>
          </span>
          <span className="topbar-status-content">
            <span className="topbar-weather-location">Tagum City</span>
            <span className="topbar-weather-value weather-live-value">{weatherValue}</span>
          </span>
        </button>
      </div>
      <div className="topbar-chatbot">
        <button
          className="topbar-chatbot-btn"
          type="button"
          aria-label={isChatOpen ? "Close chatbot" : "Open chatbot"}
          title="Chatbot"
          onClick={() => setIsChatOpen((prev) => !prev)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H9l-4 3v-3a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4z" />
            <path d="M8 10h8" />
            <path d="M8 14h5" />
          </svg>
        </button>

        {isChatOpen ? (
          <div className="topbar-chatbot-panel" role="dialog" aria-label="Chatbot interface">
            <div className="topbar-chatbot-header">
              <span>Chatbot</span>
              <button
                type="button"
                className="topbar-chatbot-close"
                aria-label="Close chatbot"
                onClick={() => setIsChatOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="topbar-chatbot-messages">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`topbar-chatbot-message ${message.role === "user" ? "user" : "bot"}`}
                >
                  {message.text}
                </div>
              ))}
            </div>
            <form className="topbar-chatbot-form" onSubmit={handleChatSubmit}>
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Type a message..."
                aria-label="Type your message"
              />
              <button type="submit">Send</button>
            </form>
          </div>
        ) : null}
      </div>
      {isWeatherOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card weather-modal weather-modal-card">
            <div className="weather-modal-actions">
              <button
                type="button"
                className="ghost-btn small"
                onClick={() => setIsWeatherOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="weather-modal-body">
              <WeatherWidget />
            </div>
          </div>
        </div>
      ) : null}

      {isCalendarOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card academic-calendar-modal">
            <div className="calendar-modal-header">
              <div>
                <p className="calendar-modal-title">Academic Calendar</p>
                <span className="calendar-modal-subtitle">Recorded school days, attendance, holidays, and events</span>
              </div>
              <button
                type="button"
                className="ghost-btn small"
                onClick={() => setIsCalendarOpen(false)}
              >
                Close
              </button>
            </div>

            {calendarLoading ? (
              <p className="calendar-status-text">Loading calendar records...</p>
            ) : null}

            {!calendarLoading && calendarError ? (
              <div className="calendar-status-error" role="alert">
                <p>{calendarError}</p>
                <button type="button" className="ghost-btn small" onClick={openAcademicCalendar}>
                  Retry
                </button>
              </div>
            ) : null}

            {!calendarLoading && !calendarError ? (
              <>
                <div className="calendar-month-nav">
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() =>
                      setCalendarMonthCursor((previous) =>
                        new Date(previous.getFullYear(), previous.getMonth() - 1, 1)
                      )
                    }
                  >
                    ← Prev
                  </button>
                  <strong>{monthTitle}</strong>
                  <button
                    type="button"
                    className="ghost-btn small"
                    onClick={() =>
                      setCalendarMonthCursor((previous) =>
                        new Date(previous.getFullYear(), previous.getMonth() + 1, 1)
                      )
                    }
                  >
                    Next →
                  </button>
                </div>

                <div className="academic-calendar-summary">
                  <article className="calendar-summary-card">
                    <span>Recorded Days</span>
                    <strong>{totalRecordedDays}</strong>
                  </article>
                  <article className="calendar-summary-card">
                    <span>School Days</span>
                    <strong>{schoolDayCount}</strong>
                  </article>
                  <article className="calendar-summary-card">
                    <span>Holidays</span>
                    <strong>{holidayCount}</strong>
                  </article>
                  <article className="calendar-summary-card">
                    <span>Recorded Events</span>
                    <strong>{eventCount}</strong>
                  </article>
                </div>

                {calendarRows.length === 0 ? (
                  <p className="calendar-status-text">No recorded calendar days found yet.</p>
                ) : (
                  <div className="academic-calendar-monthly-layout">
                    <div className="academic-calendar-grid-wrap">
                      <div className="academic-calendar-weekdays">
                        {dayLabels.map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                      </div>
                      <div className="academic-calendar-grid">
                        {monthCells.map((cell) => {
                          if (cell.isBlank) {
                            return <div key={cell.key} className="calendar-day-cell blank" aria-hidden="true" />;
                          }

                          const row = cell.row;
                          const attendanceText = row?.is_school_day
                            ? `${row.attendance_count} · ${Number(row.attendance_rate).toFixed(0)}%`
                            : "No class";

                          return (
                            <div
                              key={cell.key}
                              className={`calendar-day-cell ${
                                row?.is_holiday ? "holiday" : row?.is_school_day ? "school-day" : "other"
                              }`}
                            >
                              <div className="calendar-day-top">
                                <strong>{cell.day}</strong>
                                {row?.is_holiday ? (
                                  <span className="calendar-type-badge holiday">Holiday</span>
                                ) : row?.is_school_day ? (
                                  <span className="calendar-type-badge school-day">School Day</span>
                                ) : (
                                  <span className="calendar-type-badge other">Other</span>
                                )}
                              </div>
                              <p className="calendar-day-attendance">{attendanceText}</p>
                              <p className="calendar-day-event">{row?.event || "—"}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="academic-calendar-events-panel">
                      <h4>Month Events</h4>
                      {monthEvents.length === 0 ? (
                        <p className="calendar-status-text">No scheduled events for this month.</p>
                      ) : (
                        <ul>
                          {monthEvents.map((eventItem) => (
                            <li key={`${eventItem.date}-${eventItem.event}`}>
                              <strong>{eventItem.date}</strong>
                              <span>{eventItem.event}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Topbar({ title }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
      </div>
      <TopbarUtilities />
    </header>
  );
}

export default Topbar;
