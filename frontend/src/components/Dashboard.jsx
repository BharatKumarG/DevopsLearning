import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tasksAPI, statsAPI, healthAPI } from '../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import Stats from './Stats';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [health, setHealth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [tasksResult, statsResult, healthResult] = await Promise.all([
        tasksAPI.getTasks(),
        statsAPI.getStats(),
        healthAPI.checkHealth()
      ]);
      
      setTasks(tasksResult.tasks || []);
      setStats(statsResult);
      setHealth(healthResult);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      await loadDashboardData(); // Refresh data
      setShowTaskForm(false);
    } catch {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      await tasksAPI.updateTask(id, taskData);
      await loadDashboardData(); // Refresh data
      setEditingTask(null);
    } catch {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        await loadDashboardData(); // Refresh data
      } catch {
        setError('Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>DevOps Task Manager</h1>
          <div className="user-info">
            <span>Welcome, {user?.username}!</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        <div className="sidebar">
          <Stats stats={stats} health={health} />
          
          <div className="actions">
            <button 
              onClick={() => setShowTaskForm(true)} 
              className="create-task-btn"
              disabled={showTaskForm}
            >
              + Create New Task
            </button>
            
            <div className="filters">
              <h3>Filter Tasks</h3>
              <div className="filter-buttons">
                {['all', 'pending', 'in-progress', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`filter-btn ${filter === status ? 'active' : ''}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          {showTaskForm && (
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowTaskForm(false)}
            />
          )}

          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
              onCancel={() => setEditingTask(null)}
            />
          )}

          <TaskList
            tasks={filteredTasks}
            onEdit={setEditingTask}
            onDelete={handleDeleteTask}
            onStatusChange={(id, status) => handleUpdateTask(id, { status })}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;