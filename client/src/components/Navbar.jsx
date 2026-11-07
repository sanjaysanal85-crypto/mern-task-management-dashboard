import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Kanban,
  List,
  Calendar,
  BarChart3,
  Search,
  Plus,
  Moon,
  Sun,
  Activity,
  Zap,
  RotateCcw
} from 'lucide-react';

export const Navbar = () => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    openCreateTaskModal,
    setIsActivityDrawerOpen,
    activities,
    handleResetDatabase
  } = useTaskContext();

  const views = [
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'list', label: 'List View', icon: List },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        background: 'var(--bg-glass)',
        backdropFilter: 'var(--glass-backdrop)',
        WebkitBackdropFilter: 'var(--glass-backdrop)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Zap size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', lineHeight: '1.1', background: 'linear-gradient(90deg, #fff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TaskPulse
          </h1>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em' }}>
            MERN DASHBOARD
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}
      >
        {views.map(view => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: 'none',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.35)' : 'none'
              }}
            >
              <Icon size={16} />
              <span className="view-tab-label">{view.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Search, New Task, Activity & Theme */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '36px',
              fontSize: '0.8125rem',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => openCreateTaskModal('todo')}
          className="btn btn-primary"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>

        {/* Activity Drawer Trigger */}
        <button
          onClick={() => setIsActivityDrawerOpen(true)}
          className="btn btn-secondary btn-icon"
          title="Activity Log"
          style={{ position: 'relative' }}
        >
          <Activity size={18} />
          {activities.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '16px',
                height: '16px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}
            >
              {activities.length > 99 ? '99+' : activities.length}
            </span>
          )}
        </button>

        {/* Reset / Seed Button */}
        <button
          onClick={handleResetDatabase}
          className="btn btn-secondary btn-icon"
          title="Reset Demo Data"
        >
          <RotateCcw size={16} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: '#f59e0b' }} /> : <Moon size={18} style={{ color: '#6366f1' }} />}
        </button>
      </div>
    </header>
  );
};
