import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, Plus, Trash2, CheckSquare } from 'lucide-react';

export const TaskModal = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    taskToEdit,
    defaultStatusForNewTask,
    projects,
    handleCreateTask,
    handleUpdateTask
  } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [assigneeName, setAssigneeName] = useState('Alex Rivera');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setProjectId(taskToEdit.projectId?._id || taskToEdit.projectId || '');
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '');
      setTagsInput(taskToEdit.tags ? taskToEdit.tags.join(', ') : '');
      setAssigneeName(taskToEdit.assignee?.name || 'Alex Rivera');
      setSubtasks(taskToEdit.subtasks ? [...taskToEdit.subtasks] : []);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatusForNewTask || 'todo');
      setPriority('medium');
      setProjectId(projects.length > 0 ? projects[0]._id : '');
      setDueDate('');
      setTagsInput('');
      setAssigneeName('Alex Rivera');
      setSubtasks([]);
    }
  }, [taskToEdit, defaultStatusForNewTask, projects, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { text: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      projectId: projectId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      tags: tagsArray,
      assignee: {
        name: assigneeName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'Member'
      },
      subtasks
    };

    if (taskToEdit) {
      handleUpdateTask(taskToEdit._id, taskPayload);
    } else {
      handleCreateTask(taskPayload);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsTaskModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {taskToEdit ? 'Edit Task Details' : 'Create New Task'}
          </h2>
          <button
            onClick={() => setIsTaskModalOpen(false)}
            className="btn btn-secondary btn-icon"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement OAuth Authentication"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              placeholder="Add key objectives, guidelines, or links..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Row: Status & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="form-select">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="form-select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Row: Project & Due Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Project</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)} className="form-select">
                <option value="">General (No Project)</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Frontend, React, UI"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Subtasks Checklist Builder */}
          <div className="form-group">
            <label className="form-label">Subtasks Checklist</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <input
                type="text"
                placeholder="Add subtask item..."
                value={newSubtaskText}
                onChange={e => setNewSubtaskText(e.target.value)}
                className="form-input"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn btn-secondary"
                style={{ padding: '0 12px' }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {/* Existing Subtasks */}
            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {subtasks.map((st, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{st.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
