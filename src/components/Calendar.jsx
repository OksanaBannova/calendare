// src/components/Calendar.jsx
import React from "react";
import DayCell from "./DayCell";

const monthBackgrounds = [
  "/images/jan.jpg",
  "/images/feb.jpg",
  "/images/mar.jpg",
  "/images/apr.jpg",
  "/images/may.jpg",
  "/images/jun.jpg",
  "/images/jul.jpg",
  "/images/aug.jpg",
  "/images/sep.jpg",
  "/images/oct.jpg",
  "/images/nov.jpg",
  "/images/dec.jpg"
];

export default function Calendar({
  year,
  month,
  days,
  today,
  openedDate,
  onOpenNotebook,
  onUpdateSummary,
  customBackgrounds
}) {
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = (firstDay.getDay() + 6) % 7; // понедельник = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const defaultBackground = monthBackgrounds[month];
  const customBg = customBackgrounds?.[month];
  const background = customBg || defaultBackground;
  const cells = [];
  for (let i = 0; i < firstWeekDay; i++) {
    cells.push(<div key={`empty-${i}`} className="day-cell empty" />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateKey = date.toISOString().slice(0, 10);
    const isToday = date.toDateString() === today.toDateString();
    const dayData = days[dateKey];

    cells.push(
      <DayCell
        key={dateKey}
        date={date}
        dateKey={dateKey}
        isToday={isToday}
        dayData={dayData}
        isOpen={openedDate === dateKey}
        onClick={() => onOpenNotebook(dateKey)}
        onUpdateSummary={onUpdateSummary}
      />
    );
  }

    return (
    <div className="app-root">
      {/* ... */}
      {state.user && (
        <>
          <Header
            greeting={greeting}
            currentYear={currentYear}
            currentMonth={currentMonth}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onSearch={handleSearch}
            onUploadBackground={handleUploadBackground}
          />

          <Calendar
            year={currentYear}
            month={currentMonth}
            days={state.days}
            today={today}
            openedDate={openedDate}
            onOpenNotebook={handleOpenNotebook}
            onUpdateSummary={updateSummaryForDate}
            customBackgrounds={state.customBackgrounds}
          />
          {/* ... */}
        </>
      )}
    </div>
  );
}