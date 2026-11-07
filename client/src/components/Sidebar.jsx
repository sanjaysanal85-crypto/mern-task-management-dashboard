import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Folder,
  Plus,
  Layers,
  Filter,
  CheckCircle2,
  Trash2,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    selectedPriority,
    setSelectedPriority,
    setIsProjectModalOpen,
    handleDeleteProject,
    stats,
    tasks
  } = useTaskContext();

  const priorities = [
    { id: 'all', label: 'All Priorities', color: 'var(--text-muted)' },
    { id: 'urgent', label: 'Urgent', color: 'var(--priority-urgent)' },
    { id: 'high', label: 'High', color: 'var(--priority-high)' },
    { id: 'medium', label: 'Medium', color: 'var(--priority-medium)' },
    { id: 'low', label: 'Low', color: 'var(--priority-low)' }
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
        bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
        zIndex: 40
      }}
    >
      {/* Projects Section */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 8px'
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Projects & Workspaces
          </span>
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="btn btn-secondary btn-icon"
            style={{ width: '24px', height: '24px', borderRadius: '6px' }}
            title="Create Project"
          >
            <Plus size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* All Projects Option */}
          <button
            onClick={() => setSelectedProject('all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: selectedProject === 'all' ? 'var(--bg-card-hover)' : 'transparent',
              color: selectedProject === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: selectedProject === 'all' ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={16} />
              <span>All Projects</span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '10px',
                background: 'var(--bg-input)',
                color: 'var(--text-muted)'
              }}
            >
              {tasks.length}
            </span>
          </button>

          {/* Project Items */}
          {projects.map(proj => {
            const isSelected = selectedProject === proj._id;
            return (
              <div
                key={proj._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                  padding: '2px 4px'
                }}
              >
                <button
                  onClick={() => setSelectedProject(proj._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    padding: '6px 8px',
                    border: 'none',
                    background: 'transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 600 : 400,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: proj.color || 'var(--accent-primary)',
                      boxShadow: isSelected ? `0 0 8px ${proj.color}` : 'none'
                    }}
                  />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {proj.name}
                  </span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: 'var(--bg-input)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {proj.taskCount || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete project "${proj.name}"?`)) {
                        handleDeleteProject(proj._id);
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      opacity: 0.6
                    }}
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priorities Filter Section */}
      <div>
        <div style={{ padding: '0 8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Priority Filter
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {priorities.map(p => {
            const isSelected = selectedPriority === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPriority(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                  color: isSelected ? p.color : 'var(--text-secondary)',
                  fontWeight: isSelected ? 600 : 400,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: p.color
                  }}
                />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Summary Widget at Bottom */}
      {stats && (
        <div
          className="glass-panel"
          style={{
            marginTop: 'auto',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(180deg, var(--bg-card), rgba(99,102,241,0.08))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Overall Progress
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
              {stats.completionRate}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: 'var(--bg-input)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                width: `${stats.completionRate}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #10b981)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{stats.statusBreakdown?.completed || 0} completed</span>
            <span>{stats.totalTasks || 0} total</span>
          </div>
        </div>
      )}
    </aside>
  );
};
