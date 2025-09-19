import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="task-list-container">
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Create your first task to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h2>Tasks ({tasks.length})</h2>
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <div className="task-badges">
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(task.status) }}
                >
                  {task.status.replace('-', ' ')}
                </span>
                <span 
                  className="priority-badge" 
                  style={{ color: getPriorityColor(task.priority) }}
                >
                  {task.priority} priority
                </span>
              </div>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <small>Created: {formatDate(task.created_at)}</small>
              {task.updated_at !== task.created_at && (
                <small>Updated: {formatDate(task.updated_at)}</small>
              )}
            </div>
            
            <div className="task-actions">
              <div className="status-dropdown">
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={() => onEdit(task)} 
                  className="edit-btn"
                  title="Edit task"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDelete(task.id)} 
                  className="delete-btn"
                  title="Delete task"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;