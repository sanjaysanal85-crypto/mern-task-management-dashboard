import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const CalendarView = () => {
  const { tasks, openTaskDetailModal } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayMonth = () => {
    setCurrentDate(new Date());
  };

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Fill previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false
    });
  }

  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      date: new Date(year, month, d),
      isCurrentMonth: true
    });
  }

  // Fill next month leading days to complete 35 or 42 grid cells
  const remaining = 35 - calendarDays.length;
  for (let i = 1; i <= (remaining >= 0 ? remaining : remaining + 7); i++) {
    calendarDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper to match task to calendar date
  const getTasksForDate = (date) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return (
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
      {/* Calendar Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={todayMonth}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          >
            Today
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={prevMonth} className="btn btn-secondary btn-icon">
            <ChevronLeft size={18} />
          </button>
          <button onClick={nextMonth} className="btn btn-secondary btn-icon">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px', textAlign: 'center' }}>
        {dayNames.map(day => (
          <div key={day} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {day}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {calendarDays.map((cell, idx) => {
          const dayTasks = getTasksForDate(cell.date);
          const activeToday = isToday(cell.date);

          return (
            <div
              key={idx}
              style={{
                minHeight: '100px',
                background: cell.isCurrentMonth ? 'var(--bg-secondary)' : 'rgba(0,0,0,0.15)',
                border: activeToday ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                opacity: cell.isCurrentMonth ? 1 : 0.45
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: activeToday ? 800 : 600,
                    color: activeToday ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: activeToday ? 'var(--accent-glow)' : 'transparent',
                    padding: activeToday ? '2px 6px' : 0,
                    borderRadius: '4px'
                  }}
                >
                  {cell.date.getDate()}
                </span>
                {dayTasks.length > 0 && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {dayTasks.length} tasks
                  </span>
                )}
              </div>

              {/* Task Items in Cell */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', maxHeight: '75px' }}>
                {dayTasks.map(t => (
                  <div
                    key={t._id}
                    onClick={() => openTaskDetailModal(t)}
                    style={{
                      padding: '3px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      background: 'var(--bg-input)',
                      borderLeft: `3px solid var(--priority-${t.priority})`,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={t.title}
                  >
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
