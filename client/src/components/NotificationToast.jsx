import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast = () => {
  const { toast } = useTaskContext();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: '#10b981' }} />,
    error: <AlertCircle size={18} style={{ color: '#ef4444' }} />,
    info: <Info size={18} style={{ color: '#38bdf8' }} />
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
        fontWeight: '500',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {icons[toast.type] || icons.info}
      <span>{toast.message}</span>
    </div>
  );
};
