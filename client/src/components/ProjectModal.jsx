import React, { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, FolderPlus } from 'lucide-react';

export const ProjectModal = () => {
  const { isProjectModalOpen, setIsProjectModalOpen, handleCreateProject } = useTaskContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  if (!isProjectModalOpen) return null;

  const colorPresets = [
    '#6366f1', // Indigo
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ef4444'  // Red
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    handleCreateProject({
      name: name.trim(),
      description: description.trim(),
      color,
      icon: 'folder'
    });

    setName('');
    setDescription('');
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsProjectModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>New Project Category</h2>
          </div>
          <button onClick={() => setIsProjectModalOpen(false)} className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design System V2"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of project scope..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Color Selection */}
          <div className="form-group">
            <label className="form-label">Accent Theme Color</label>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {colorPresets.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: c,
                    border: color === c ? '3px solid var(--text-primary)' : 'none',
                    boxShadow: color === c ? `0 0 12px ${c}` : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setIsProjectModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
