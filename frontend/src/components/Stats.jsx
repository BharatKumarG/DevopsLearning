import React from 'react';
import './Stats.css';

const Stats = ({ stats, health }) => {
  const getHealthStatus = () => {
    if (!health.status) return { color: '#6b7280', text: 'Unknown' };
    if (health.status === 'OK') return { color: '#10b981', text: 'Healthy' };
    return { color: '#ef4444', text: 'Unhealthy' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="stats-container">
      <h3>Dashboard Overview</h3>
      
      {/* System Health */}
      <div className="stat-card health-card">
        <div className="stat-header">
          <span>System Health</span>
          <span 
            className="health-indicator"
            style={{ color: healthStatus.color }}
          >
            ●
          </span>
        </div>
        <div className="health-details">
          <div>Status: {healthStatus.text}</div>
          {health.version && <div>Version: {health.version}</div>}
          {health.environment && <div>Env: {health.environment}</div>}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="stat-card">
        <div className="stat-header">
          <span>Task Statistics</span>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{stats.total_tasks || 0}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number completed">{stats.completed_tasks || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number in-progress">{stats.in_progress_tasks || 0}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-number pending">{stats.pending_tasks || 0}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="stat-card">
        <div className="stat-header">
          <span>Priority Breakdown</span>
        </div>
        <div className="priority-stats">
          <div className="priority-item">
            <span className="priority-indicator high">●</span>
            <span>High Priority: {stats.high_priority_tasks || 0}</span>
          </div>
          <div className="priority-item">
            <span className="priority-indicator medium">●</span>
            <span>Medium Priority: {(stats.total_tasks || 0) - (stats.high_priority_tasks || 0)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.total_tasks > 0 && (
        <div className="stat-card">
          <div className="stat-header">
            <span>Overall Progress</span>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ 
                width: `${((stats.completed_tasks || 0) / stats.total_tasks) * 100}%` 
              }}
            />
            <span className="progress-text">
              {Math.round(((stats.completed_tasks || 0) / stats.total_tasks) * 100)}% Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;