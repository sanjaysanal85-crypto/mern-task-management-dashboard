import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Calendar,
  CheckSquare,
  MoreVertical,
  Edit3,
  Trash2,
  AlertCircle,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const KanbanCard = ({ task }) => {
  const {
    openEditTaskModal,
    openTaskDetailModal,
    handleDeleteTask,
    handleUpdateTaskStatus
  } = useTaskContext();

  const [showMenu, setShowMenu] = useState(false);

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const statuses = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'In Review' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div
      className="glass-panel glass-panel-hover"
      onClick={() => openTaskDetailModal(task)}
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Header: Project Badge & Priority & Options Menu */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.projectId && (
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: task.projectId.color || 'var(--accent-primary)',
                background: 'var(--bg-input)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: task.projectId.color || 'var(--accent-primary)' }} />
              {task.projectId.name}
            </span>
          )}
          <span className={`badge badge-${task.priority}`}>
            {task.priority}
          </span>
        </div>

        {/* Options Menu Trigger */}
        <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                zIndex: 20,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glow)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                minWidth: '150px',
                padding: '4px 0',
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <button
                onClick={() => { setShowMenu(false); openEditTaskModal(task); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Edit3 size={14} /> Edit Task
              </button>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

              <div style={{ padding: '4px 12px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                MOVE TO STATUS:
              </div>

              {statuses.filter(s => s.id !== task.status).map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setShowMenu(false);
                    handleUpdateTaskStatus(task._id, s.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '6px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  <span>{s.label}</span>
                  <ArrowRight size={12} />
                </button>
              ))}

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

              <button
                onClick={() => { setShowMenu(false); handleDeleteTask(task._id); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  background: 'transparent',
                  color: '#ef4444',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task Title & Description */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          {task.title}
        </h3>
        {task.description && (
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Subtasks Checklist Progress */}
      {totalSubtasks > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckSquare size={13} /> Subtasks
            </span>
            <span>{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                height: '100%',
                background: completedSubtasks === totalSubtasks ? '#10b981' : '#6366f1',
                borderRadius: '2px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* Footer: Due Date & Assignee Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
        {/* Due Date */}
        {formattedDate ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: isOverdue ? '#ef4444' : 'var(--text-muted)',
              background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              padding: isOverdue ? '2px 6px' : 0,
              borderRadius: '4px'
            }}
          >
            {isOverdue ? <AlertCircle size={13} /> : <Calendar size={13} />}
            <span>{formattedDate}</span>
          </div>
        ) : (
          <span />
        )}

        {/* Assignee Avatar */}
        {task.assignee && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={`${task.assignee.name} (${task.assignee.role || 'Member'})`}>
            {task.assignee.avatar ? (
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {task.assignee.name.charAt(0)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
