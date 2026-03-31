// src/components/Header.jsx
import React from "react";

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
];

export default function Header({
  greeting,
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onSearch
}) {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <header className="app-header">
      <div className="greeting">{greeting}</div>

      <div className="month-nav">
        <button className="month-arrow" onClick={onPrevMonth} type="button">
          ‹
        </button>
        <div className="month-label">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <button className="month-arrow" onClick={onNextMonth} type="button">
          ›
        </button>
      </div>

      <div className="search-block">
        <input type="date" onChange={handleSearchChange} />
      </div>
    </header>
  );
}