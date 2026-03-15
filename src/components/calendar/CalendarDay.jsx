import React from "react";

function CalendarDay({ cell, holiday, isToday, onSelect }) {
  if (cell.isBlank) {
    return <div className="calendar-day-cell blank" aria-hidden="true" />;
  }

  const date = new Date(`${cell.key}T00:00:00`);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isSchoolDay = !isWeekend && !holiday;
  const label = holiday
    ? `${holiday.name} (${holiday.type === "regular" ? "Regular Holiday" : "Special Non-Working Holiday"})`
    : isSchoolDay
    ? "Regular School Day"
    : "Weekend (No Class)";

  return (
    <div
      className={`calendar-day-cell ${holiday ? "holiday" : isSchoolDay ? "school-day" : "other"} ${
        isToday ? "today" : ""
      }`}
      onMouseEnter={() => onSelect(holiday || null)}
      onClick={() => onSelect(holiday || null)}
      title={holiday ? `${holiday.name}: ${holiday.description}` : label}
      role={holiday ? "button" : undefined}
      tabIndex={holiday ? 0 : undefined}
      onKeyDown={(event) => {
        if (!holiday) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(holiday);
        }
      }}
    >
      <div className="calendar-day-top">
        <strong>{cell.day}</strong>
        {holiday ? (
          <span className="calendar-type-badge holiday">Holiday</span>
        ) : isSchoolDay ? (
          <span className="calendar-type-badge school-day">School Day</span>
        ) : (
          <span className="calendar-type-badge other">Weekend</span>
        )}
      </div>

      {holiday ? (
        <p className="calendar-day-event holiday-name">{holiday.name}</p>
      ) : isSchoolDay ? (
        <p className="calendar-day-attendance">Regular school day</p>
      ) : (
        <p className="calendar-day-attendance">No class</p>
      )}
    </div>
  );
}

export default CalendarDay;
