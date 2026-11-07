import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import {
  Calendar,
  CheckSquare,
  Edit3,
  Trash2,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';

export const ListView = () => {
  const {
    tasks,
    sortBy,
    setSortBy,
    openEditTaskModal,
    openTaskDetailModal,
    handleDeleteTask,
    handleUpdateTaskStatus
  } = useTaskContext();

  const handleSortChange = (field) => {
    setSortBy(prev => (prev === field ? 'createdAt' : field));
  };

  const statuses = [
    { id: 'todo', label: 'To Do' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'review', label: 'In Review' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <button
                onClick={() => handleSortChange('title')}
                style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Task Title <ArrowUpDown size={14} />
              </button>
            </th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Project</th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <button
                onClick={() => handleSortChange('priority')}
                style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Priority <ArrowUpDown size={14} />
              </button>
            </th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>Subtasks</th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <button
                onClick={() => handleSortChange('dueDate')}
                style={{ background: 'none', border: 'none', color: 'inherit', fontWeight: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Due Date <ArrowUpDown size={14} />
              </button>
            </th>
            <th style={{ padding: '16px', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No tasks match your filter criteria.
              </td>
            </tr>
          ) : (
            tasks.map(task => {
              const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
              const totalSubtasks = task.subtasks?.length || 0;
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== 'completed';

              return (
                <tr
                  key={task._id}
                  onClick={() => openTaskDetailModal(task)}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-card-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Title & Description */}
                  <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Project */}
                  <td style={{ padding: '14px 16px' }}>
                    {task.projectId ? (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: task.projectId.color || 'var(--accent-primary)',
                          background: 'var(--bg-input)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: task.projectId.color || 'var(--accent-primary)' }} />
                        {task.projectId.name}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>General</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td style={{ padding: '14px 16px' }} onClick={e => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={e => handleUpdateTaskStatus(task._id, e.target.value)}
                      className="form-select"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 600,
                        width: 'auto'
                      }}
                    >
                      {statuses.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Subtasks */}
                  <td style={{ padding: '14px 16px' }}>
                    {totalSubtasks > 0 ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {completedSubtasks}/{totalSubtasks} ({Math.round((completedSubtasks / totalSubtasks) * 100)}%)
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: '14px 16px' }}>
                    {task.dueDate ? (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: isOverdue ? '#ef4444' : 'var(--text-secondary)',
                          fontWeight: isOverdue ? 600 : 400,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isOverdue && <AlertCircle size={12} />}
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No date</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => openEditTaskModal(task)}
                        className="btn btn-secondary btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Edit Task"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn btn-danger btn-icon"
                        style={{ width: '28px', height: '28px' }}
                        title="Delete Task"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
