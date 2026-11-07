import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Views
  const [currentView, setCurrentView] = useState('kanban'); // kanban, list, calendar, analytics
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  // Theme Mode
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('task_pulse_theme') || 'dark';
  });

  // Modals & Panels State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultStatusForNewTask, setDefaultStatusForNewTask] = useState('todo');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('task_pulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch Stats & Projects & Activities
  const fetchAuxiliaryData = async () => {
    try {
      const [projectsData, activitiesData, statsData] = await Promise.all([
        api.getProjects(),
        api.getActivities(),
        api.getStats()
      ]);
      setProjects(projectsData);
      setActivities(activitiesData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load auxiliary data:', err);
    }
  };

  // Fetch Tasks with active filters
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        search: searchQuery,
        status: selectedStatus,
        priority: selectedPriority,
        projectId: selectedProject,
        sortBy: sortBy
      };
      const tasksData = await api.getTasks(params);
      setTasks(tasksData);
      await fetchAuxiliaryData();
    } catch (err) {
      setError(err.message);
      showToast('Error loading tasks from server', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedPriority, selectedProject, sortBy]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Task Actions
  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await api.createTask(taskData);
      showToast(`Task "${newTask.title}" created successfully!`, 'success');
      setIsTaskModalOpen(false);
      loadTasks();
    } catch (err) {
      showToast('Failed to create task: ' + err.message, 'error');
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updated = await api.updateTask(id, taskData);
      showToast(`Task "${updated.title}" updated!`, 'success');
      setIsTaskModalOpen(false);
      if (selectedTaskDetail && selectedTaskDetail._id === id) {
        setSelectedTaskDetail(updated);
      }
      loadTasks();
    } catch (err) {
      showToast('Failed to update task: ' + err.message, 'error');
    }
  };

  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      setTasks(prev =>
        prev.map(t => (t._id === id ? { ...t, status: newStatus } : t))
      );
      const updated = await api.updateTaskStatus(id, newStatus);
      if (selectedTaskDetail && selectedTaskDetail._id === id) {
        setSelectedTaskDetail(updated);
      }
      showToast(`Task status updated to ${newStatus.replace('_', ' ')}`, 'info');
      fetchAuxiliaryData();
    } catch (err) {
      showToast('Failed to update status', 'error');
      loadTasks();
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    try {
      const updated = await api.toggleSubtask(taskId, subtaskId);
      setTasks(prev => prev.map(t => (t._id === taskId ? updated : t)));
      if (selectedTaskDetail && selectedTaskDetail._id === taskId) {
        setSelectedTaskDetail(updated);
      }
      fetchAuxiliaryData();
    } catch (err) {
      showToast('Failed to update subtask', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      showToast('Task deleted successfully', 'info');
      if (selectedTaskDetail && selectedTaskDetail._id === id) {
        setIsDetailModalOpen(false);
        setSelectedTaskDetail(null);
      }
      loadTasks();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
  };

  // Project Actions
  const handleCreateProject = async (projectData) => {
    try {
      const newProj = await api.createProject(projectData);
      showToast(`Project "${newProj.name}" created!`, 'success');
      setIsProjectModalOpen(false);
      fetchAuxiliaryData();
    } catch (err) {
      showToast('Failed to create project: ' + err.message, 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await api.deleteProject(id);
      showToast('Project deleted', 'info');
      if (selectedProject === id) setSelectedProject('all');
      loadTasks();
    } catch (err) {
      showToast('Failed to delete project', 'error');
    }
  };

  // Reset/Seed Database
  const handleResetDatabase = async () => {
    try {
      await api.seedDatabase();
      showToast('Database reset and re-seeded with demo data!', 'success');
      loadTasks();
    } catch (err) {
      showToast('Failed to seed database', 'error');
    }
  };

  // Modal Control Helpers
  const openCreateTaskModal = (initialStatus = 'todo') => {
    setTaskToEdit(null);
    setDefaultStatusForNewTask(initialStatus);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const openTaskDetailModal = (task) => {
    setSelectedTaskDetail(task);
    setIsDetailModalOpen(true);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        projects,
        activities,
        stats,
        loading,
        error,
        currentView,
        setCurrentView,
        selectedProject,
        setSelectedProject,
        selectedPriority,
        setSelectedPriority,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        theme,
        toggleTheme,
        isTaskModalOpen,
        setIsTaskModalOpen,
        taskToEdit,
        defaultStatusForNewTask,
        isDetailModalOpen,
        setIsDetailModalOpen,
        selectedTaskDetail,
        isProjectModalOpen,
        setIsProjectModalOpen,
        isActivityDrawerOpen,
        setIsActivityDrawerOpen,
        toast,
        showToast,
        openCreateTaskModal,
        openEditTaskModal,
        openTaskDetailModal,
        handleCreateTask,
        handleUpdateTask,
        handleUpdateTaskStatus,
        handleToggleSubtask,
        handleDeleteTask,
        handleCreateProject,
        handleDeleteProject,
        handleResetDatabase,
        refreshData: loadTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
