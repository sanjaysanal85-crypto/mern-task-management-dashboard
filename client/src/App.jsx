import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { StatCards } from './components/StatCards';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { TaskModal } from './components/TaskModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ProjectModal } from './components/ProjectModal';
import { ActivityLogDrawer } from './components/ActivityLogDrawer';
import { NotificationToast } from './components/NotificationToast';

const DashboardContent = () => {
  const { currentView, loading, error, refreshData } = useTaskContext();

  const renderView = () => {
    switch (currentView) {
      case 'kanban':
        return <KanbanBoard />;
      case 'list':
        return <ListView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        <StatCards />

        {loading ? (
          <div
            style={{
              padding: '60px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <span>Loading task management dashboard...</span>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#ef4444',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <p style={{ fontWeight: 600, marginBottom: '12px' }}>Failed to connect to backend server ({error})</p>
            <button onClick={refreshData} className="btn btn-primary">
              Retry Connection
            </button>
          </div>
        ) : (
          renderView()
        )}
      </main>

      {/* Modals & Panels */}
      <TaskModal />
      <TaskDetailModal />
      <ProjectModal />
      <ActivityLogDrawer />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
}
