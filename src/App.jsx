import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Notebook from "./components/Notebook";
import "./styles.css";
import { loadCalendarState, saveCalendarState } from "./api/calendarApi";

const STORAGE_KEY = "wall-calendar-app";
const THEME_KEY = "wall-calendar-theme";

const initialState = {
  user: null,
  days: {},
  customBackgrounds: {} // ключ: месяц (0–11), значение: dataURL
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  } catch {
    return "light";
  }
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Доброе утро";
  if (hour >= 12 && hour < 18) return "Добрый день";
  if (hour >= 18 && hour < 23) return "Добрый вечер";
  return "Доброй ночи";
};

export default function App() {
  const [state, setState] = useState(() => {
    const persisted = loadState();
    if (persisted) return { ...initialState, ...persisted };
    return initialState;
  });
  // простейший userId — комбинация имени и даты рождения
const userId =
  state.user && state.user.name && state.user.birthday
    ? `${state.user.name}_${state.user.birthday}`
    : null;

  const [theme, setTheme] = useState(getInitialTheme);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0–11
  const [openedDate, setOpenedDate] = useState(null); // 'YYYY-MM-DD' или null
  const [searchDate, setSearchDate] = useState("");

  // сохраняем состояние задач/фонов
  useEffect(() => {
    saveState(state);
  }, [state]);

  // применяем тему
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // слушаем смену темы системы
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
    } else if (mq.addListener) {
      mq.addListener(handleChange);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleChange);
      } else if (mq.removeListener) {
        mq.removeListener(handleChange);
      }
    };
  }, []);

  const handleSetUser = (user) => {
    setState((prev) => ({ ...prev, user }));
  };

  const updateDayTasks = (dateKey, updater) => {
    setState((prev) => {
      const existing = prev.days[dateKey] || { date: dateKey, tasks: [] };
      const updated = updater(existing);
      return {
        ...prev,
        days: {
          ...prev.days,
          [dateKey]: updated
        }
      };
    });
  };

  const toggleTaskDone = (dateKey, taskId) => {
    updateDayTasks(dateKey, (day) => ({
      ...day,
      tasks: day.tasks.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
    }));
  };

  const addTask = (dateKey, text) => {
    if (!text.trim()) return;
    updateDayTasks(dateKey, (day) => ({
      ...day,
      tasks: [
        ...day.tasks,
        {
          id: Date.now().toString() + Math.random().toString(16),
          text: text.trim(),
          done: false
        }
      ]
    }));
  };

  const updateSummaryForDate = (dateKey) => {
    setState((prev) => {
      const day = prev.days[dateKey];
      if (!day || day.tasks.length === 0) return prev;

      const total = day.tasks.length;
      const done = day.tasks.filter((t) => t.done).length;
      const percent = (done / total) * 100;

      let summaryEmoji = "☹️";
      let summaryColor = "red";

      if (percent === 100) {
        summaryEmoji = "😁";
        summaryColor = "green";
      } else if (percent >= 50 && percent <= 70) {
        summaryEmoji = "😊";
        summaryColor = "lightgreen";
      } else if (percent >= 30 && percent <= 49) {
        summaryEmoji = "😒";
        summaryColor = "yellow";
      } else {
        summaryEmoji = "☹️";
        summaryColor = "red";
      }

      return {
        ...prev,
        days: {
          ...prev.days,
          [dateKey]: {
            ...day,
            summaryEmoji,
            summaryColor
          }
        }
      };
    });
  };

  const handleOpenNotebook = (dateKey) => {
    setOpenedDate((prev) => (prev === dateKey ? null : dateKey));
  };

  const handleSearch = (value) => {
    setSearchDate(value);
    if (value) {
      const [y, m] = value.split("-");
      const year = Number(y);
      const month = Number(m) - 1;
      if (!Number.isNaN(year) && !Number.isNaN(month)) {
        setCurrentYear(year);
        setCurrentMonth(month);
        setOpenedDate(value);
      }
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  const handleUploadBackground = (monthIndex, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setState((prev) => ({
        ...prev,
        customBackgrounds: {
          ...prev.customBackgrounds,
          [monthIndex]: dataUrl
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const greeting = state.user ? `${getGreeting()}, ${state.user.name}` : null;

  return (
    <div className="app-root">
      {!state.user && (
        <div className="onboarding-overlay">
          <UserForm onSubmit={handleSetUser} />
        </div>
      )}

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

          {openedDate && (
            <Notebook
              dateKey={openedDate}
              day={state.days[openedDate]}
              onClose={() => setOpenedDate(null)}
              onAddTask={addTask}
              onToggleTask={toggleTaskDone}
            />
          )}
        </>
      )}
    </div>
  );
}

function UserForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !birthday) return;
    onSubmit({ name: name.trim(), birthday });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>Добро пожаловать!</h2>

      <label>
        Имя:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Дата рождения:
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
      </label>

      <button type="submit">Начать</button>
    </form>
  );
}