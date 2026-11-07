import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  X,
  Calendar,
  CheckSquare,
  Edit3,
  Trash2,
  AlertCircle,
  Tag,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const TaskDetailModal = () => {
  const {
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedTaskDetail,
    openEditTaskModal,
    handleDeleteTask,
    handleToggleSubtask
  } = useTaskContext();

  if (!isDetailModalOpen || !selectedTaskDetail) return null;

  const task = selectedTaskDetail;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  return (
    <div className="modal-backdrop" onClick={() => setIsDetailModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge badge-${task.priority}`}>
              {task.priority} Priority
            </span>
            <span className={`badge badge-${task.status}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setIsDetailModalOpen(false);
                openEditTaskModal(task);
              }}
              className="btn btn-secondary btn-icon"
              style={{ width: '32px', height: '32px' }}
              title="Edit Task"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className="btn btn-danger btn-icon"
              style={{ width: '32px', height: '32px' }}
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="btn btn-secondary btn-icon"
              style={{ width: '32px', height: '32px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
          {task.title}
        </h2>

        {/* Project Info */}
        {task.projectId && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: task.projectId.color || 'var(--accent-primary)' }} />
            <span>Project: <strong>{task.projectId.name}</strong></span>
          </div>
        )}

        {/* Description Section */}
        {task.description && (
          <div style={{ marginBottom: '20px', background: 'var(--bg-input)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Description
            </span>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
              {task.description}
            </p>
          </div>
        )}

        {/* Subtasks Interactive Checklist */}
        {totalSubtasks > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckSquare size={16} /> Subtasks ({completedSubtasks}/{totalSubtasks})
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click checkbox to toggle
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask._id}
                  onClick={() => handleToggleSubtask(task._id, subtask._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    background: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {}} // Handled by div click
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: subtask.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: subtask.completed ? 'line-through' : 'none'
                    }}
                  >
                    {subtask.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Tags
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-input)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Meta Row: Due Date & Assignee */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
          {/* Due Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} style={{ color: isOverdue ? '#ef4444' : 'var(--text-muted)' }} />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>DUE DATE</span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isOverdue ? '#ef4444' : 'var(--text-primary)' }}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Deadline'}
              </span>
            </div>
          </div>

          {/* Assignee */}
          {task.assignee && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={task.assignee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={task.assignee.name}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  {task.assignee.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {task.assignee.role || 'Assignee'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
