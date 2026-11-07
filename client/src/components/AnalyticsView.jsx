import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Activity, BarChart2, PieChart, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

export const AnalyticsView = () => {
  const { stats, activities } = useTaskContext();

  if (!stats) return null;

  const total = stats.totalTasks || 1; // prevent divide by zero

  const statusBars = [
    { label: 'To Do', count: stats.statusBreakdown?.todo || 0, color: 'var(--status-todo)' },
    { label: 'In Progress', count: stats.statusBreakdown?.in_progress || 0, color: 'var(--status-in-progress)' },
    { label: 'In Review', count: stats.statusBreakdown?.review || 0, color: 'var(--status-review)' },
    { label: 'Completed', count: stats.statusBreakdown?.completed || 0, color: 'var(--status-completed)' }
  ];

  const priorityBars = [
    { label: 'Urgent', count: stats.priorityBreakdown?.urgent || 0, color: 'var(--priority-urgent)' },
    { label: 'High', count: stats.priorityBreakdown?.high || 0, color: 'var(--priority-high)' },
    { label: 'Medium', count: stats.priorityBreakdown?.medium || 0, color: 'var(--priority-medium)' },
    { label: 'Low', count: stats.priorityBreakdown?.low || 0, color: 'var(--priority-low)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Row: Distribution Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Status Distribution */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Status Distribution</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {statusBars.map(item => {
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <BarChart2 size={18} style={{ color: 'var(--priority-high)' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Priority Breakdown</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {priorityBars.map(item => {
              const percentage = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{item.label} Priority</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity Audit Stream */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={18} style={{ color: '#10b981' }} />
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Recent System Activity Logs</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          {activities.length === 0 ? (
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No activities logged yet.</span>
          ) : (
            activities.map(act => (
              <div
                key={act._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{act.action}</span>
                  {act.taskTitle && (
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>"{act.taskTitle}"</span>
                  )}
                  {act.details && (
                    <span style={{ color: 'var(--text-muted)' }}>- {act.details}</span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(act.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
