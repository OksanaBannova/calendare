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
  onSearch,
  onUploadBackground
}) {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const fileInputId = "bg-upload-input";

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadBackground(currentMonth, file);
    e.target.value = "";
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

        <label className="bg-upload-button" htmlFor={fileInputId}>
          Сменить фон
        </label>
        <input
          id={fileInputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="search-block">
        <input type="date" onChange={handleSearchChange} />
      </div>
    </header>
  );
}