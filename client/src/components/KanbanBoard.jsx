import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { KanbanCard } from './KanbanCard';
import { Plus, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, openCreateTaskModal, handleUpdateTaskStatus } = useTaskContext();
  const [draggedOverColumn, setDraggedOverColumn] = useState(null);

  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'var(--status-todo)',
      icon: Circle
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: 'var(--status-in-progress)',
      icon: Clock
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'var(--status-review)',
      icon: AlertCircle
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'var(--status-completed)',
      icon: CheckCircle2
    }
  ];

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDraggedOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      handleUpdateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        alignItems: 'start'
      }}
    >
      {columns.map(col => {
        const Icon = col.icon;
        const columnTasks = tasks.filter(t => t.status === col.id);
        const isDraggedOver = draggedOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={e => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, col.id)}
            style={{
              background: isDraggedOver ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
              border: isDraggedOver ? '2px dashed var(--accent-primary)' : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              minHeight: '600px',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: col.color,
                    boxShadow: `0 0 8px ${col.color}`
                  }}
                />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {col.title}
                </h3>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => openCreateTaskModal(col.id)}
                className="btn btn-secondary btn-icon"
                style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                title={`Add task to ${col.title}`}
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {columnTasks.length === 0 ? (
                <div
                  style={{
                    height: '120px',
                    border: '1px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.8125rem'
                  }}
                >
                  <span>No tasks</span>
                </div>
              ) : (
                columnTasks.map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('text/plain', task._id)}
                  >
                    <KanbanCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
