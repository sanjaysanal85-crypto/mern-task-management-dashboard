import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { CheckCircle2, Clock, AlertTriangle, Layers } from 'lucide-react';

export const StatCards = () => {
  const { stats } = useTaskContext();

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks || 0,
      subtext: `${stats.projectsCount || 0} Projects active`,
      icon: Layers,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.15)'
    },
    {
      title: 'In Progress',
      value: stats.statusBreakdown?.in_progress || 0,
      subtext: `${stats.statusBreakdown?.review || 0} in review`,
      icon: Clock,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)'
    },
    {
      title: 'Completed',
      value: stats.statusBreakdown?.completed || 0,
      subtext: `${stats.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)'
    },
    {
      title: 'Overdue Tasks',
      value: stats.overdueCount || 0,
      subtext: stats.overdueCount > 0 ? 'Requires attention' : 'All deadlines met',
      icon: AlertTriangle,
      color: stats.overdueCount > 0 ? '#ef4444' : '#6b7280',
      bgGlow: stats.overdueCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(107, 114, 128, 0.1)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-panel glass-panel-hover"
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {card.title}
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
                {card.value}
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {card.subtext}
              </span>
            </div>

            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: card.bgGlow,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
