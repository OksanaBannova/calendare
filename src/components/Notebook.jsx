// src/components/Notebook.jsx
import React, { useState } from "react";

export default function Notebook({
  dateKey,
  day,
  onClose,
  onAddTask,
  onToggleTask
}) {
  const [input, setInput] = useState("");
  const tasks = day?.tasks || [];

  const handleAdd = (e) => {
    e.preventDefault();
    onAddTask(dateKey, input);
    setInput("");
  };

  return (
    <div className="notebook-overlay" onClick={onClose}>
      <div
        className="notebook"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="notebook-ring" />
        <div className="notebook-header">
          <span>Задачи на {dateKey}</span>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="notebook-lines">
          {Array.from({ length: Math.max(15, tasks.length) }).map(
            (_, idx) => {
              const task = tasks[idx];
              return (
                <div key={idx} className="notebook-line">
                  <span className="line-number">
                    {idx < 15 ? idx + 1 : ""}
                  </span>
                  {task ? (
                    <>
                      <button
                        type="button"
                        className={`checkbox ${
                          task.done ? "checked" : ""
                        }`}
                        onClick={() => onToggleTask(dateKey, task.id)}
                      >
                        {task.done ? "✔" : ""}
                      </button>
                      <span
                        className={`task-text ${
                          task.done ? "done" : ""
                        }`}
                      >
                        {task.text}
                      </span>
                    </>
                  ) : null}
                </div>
              );
            }
          )}
        </div>

        <form className="notebook-input" onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Новая задача..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Добавить</button>
        </form>
      </div>
    </div>
  );
}