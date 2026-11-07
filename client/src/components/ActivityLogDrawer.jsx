import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { X, Activity, Trash2, Clock, CheckCircle2, PlusCircle, RefreshCw } from 'lucide-react';

export const ActivityLogDrawer = () => {
  const { isActivityDrawerOpen, setIsActivityDrawerOpen, activities, clearActivities } = useTaskContext();

  if (!isActivityDrawerOpen) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return <PlusCircle size={16} style={{ color: '#10b981' }} />;
      case 'status':
        return <CheckCircle2 size={16} style={{ color: '#6366f1' }} />;
      case 'delete':
        return <Trash2 size={16} style={{ color: '#ef4444' }} />;
      default:
        return <RefreshCw size={16} style={{ color: '#38bdf8' }} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsActivityDrawerOpen(false)}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          maxWidth: '90vw',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 110,
          animation: 'fadeIn 0.2s ease'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>System Activity Stream</h2>
          </div>
          <button onClick={() => setIsActivityDrawerOpen(false)} className="btn btn-secondary btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* List of audit records */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No system activity recorded yet.
            </div>
          ) : (
            activities.map(act => (
              <div
                key={act._id}
                style={{
                  padding: '12px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '12px',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ marginTop: '2px' }}>{getActivityIcon(act.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {act.action}
                  </div>
                  {act.taskTitle && (
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 500, marginBottom: '2px' }}>
                      "{act.taskTitle}"
                    </div>
                  )}
                  {act.details && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {act.details}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {new Date(act.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
