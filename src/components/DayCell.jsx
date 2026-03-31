// src/components/DayCell.jsx
import React from "react";

export default function DayCell({
  date,
  dateKey,
  isToday,
  dayData,
  isOpen,
  onClick
}) {
  const hasTasks = dayData && dayData.tasks && dayData.tasks.length > 0;
  const doneCount = hasTasks
    ? dayData.tasks.filter((t) => t.done).length
    : 0;

  const percent =
    hasTasks && dayData.summaryEmoji
      ? Math.round((doneCount / dayData.tasks.length) * 100)
      : null;

  // если задачи есть, но ещё нет summaryEmoji — показываем "!"
  const indicator =
    hasTasks && !dayData?.summaryEmoji ? "!" : dayData?.summaryEmoji;

  const cellStyle = {};
  if (dayData?.summaryColor) {
    cellStyle.backgroundColor = dayData.summaryColor;
  }

  return (
    <button
      className={`day-cell ${isToday ? "today" : ""} ${
        isOpen ? "open" : ""
      }`}
      style={cellStyle}
      onClick={onClick}
      type="button"
    >
      <span className="day-number">{date.getDate()}</span>
      {indicator && (
        <span
          className={
            indicator === "!"
              ? "indicator exclamation"
              : "indicator emoji"
          }
        >
          {indicator}
        </span>
      )}
      {percent !== null && (
        <span className="percent-label">{percent}%</span>
      )}
    </button>
  );
}