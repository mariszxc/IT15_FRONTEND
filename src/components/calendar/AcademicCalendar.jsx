import React, { useMemo, useState } from "react";
import CalendarDay from "./CalendarDay";
import { getPhilippineHolidays } from "../../data/HolidayList";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function AcademicCalendar() {
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const currentYear = monthCursor.getFullYear();
  const holidayList = useMemo(() => getPhilippineHolidays(currentYear), [currentYear]);

  const holidayMap = useMemo(() => {
    const map = new Map();

    holidayList.forEach((holiday) => {
      map.set(holiday.date, holiday);
    });

    return map;
  }, [holidayList]);

  const monthTitle = monthCursor.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const monthCells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay.getDay();
    const cells = [];

    for (let index = 0; index < offset; index += 1) {
      cells.push({ key: `blank-${index}`, isBlank: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      cells.push({
        key: formatDateKey(date),
        day,
        isBlank: false,
      });
    }

    return cells;
  }, [monthCursor]);

  const monthHolidays = useMemo(() => {
    const month = monthCursor.getMonth();

    return holidayList.filter((holiday) => {
      const holidayDate = new Date(`${holiday.date}T00:00:00`);
      return holidayDate.getMonth() === month;
    });
  }, [holidayList, monthCursor]);

  const todayKey = formatDateKey(new Date());

  return (
    <>
      <div className="calendar-modal-header">
        <div className="calendar-modal-heading-wrap">
          <p className="calendar-modal-title">Academic Calendar</p>
        </div>
      </div>

      <div className="calendar-month-nav">
        <button
          type="button"
          className="ghost-btn small"
          onClick={() =>
            setMonthCursor((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1))
          }
        >
          ← Prev
        </button>
        <strong>{monthTitle}</strong>
        <button
          type="button"
          className="ghost-btn small"
          onClick={() =>
            setMonthCursor((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1))
          }
        >
          Next →
        </button>
      </div>

      <div className="academic-calendar-summary">
        <article className="calendar-summary-card">
          <span>Year</span>
          <strong>{currentYear}</strong>
        </article>
        <article className="calendar-summary-card">
          <span>Regular Holidays</span>
          <strong>{holidayList.filter((holiday) => holiday.type === "regular").length}</strong>
        </article>
        <article className="calendar-summary-card">
          <span>Special Non-Working</span>
          <strong>{holidayList.filter((holiday) => holiday.type === "special-non-working").length}</strong>
        </article>
        <article className="calendar-summary-card">
          <span>Holidays for this Month</span>
          <strong>{monthHolidays.length}</strong>
        </article>
      </div>

      <div className="academic-calendar-monthly-layout">
        <div className="academic-calendar-grid-wrap">
          <div className="academic-calendar-weekdays">
            {DAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="academic-calendar-grid">
            {monthCells.map((cell) => (
              <CalendarDay
                key={cell.key}
                cell={cell}
                holiday={!cell.isBlank ? holidayMap.get(cell.key) : null}
                isToday={!cell.isBlank && cell.key === todayKey}
                onSelect={setSelectedHoliday}
              />
            ))}
          </div>
        </div>

        <div className="academic-calendar-events-panel">
          <h4>Holiday Details</h4>
          {selectedHoliday ? (
            <div className="selected-holiday-panel" role="status" aria-live="polite">
              <strong>{selectedHoliday.name}</strong>
              <span>{selectedHoliday.dateLabel}</span>
              <p>{selectedHoliday.description}</p>
              <small>
                {selectedHoliday.type === "regular" ? "Regular Holiday" : "Special Non-Working Holiday"}
              </small>
            </div>
          ) : (
            <p></p>
          )}

          {monthHolidays.length === 0 ? (
            <p className="calendar-status-text">No holidays in this month.</p>
          ) : (
            <ul>
              {monthHolidays.map((holiday) => (
                <li key={`${holiday.date}-${holiday.name}`}>
                  <strong>{holiday.dateLabel}</strong>
                  <span>{holiday.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default AcademicCalendar;
