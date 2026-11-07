const API_BASE = '/api';

export const api = {
  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks?${query}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async getTaskById(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update task status');
    return res.json();
  },

  async toggleSubtask(taskId, subtaskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH'
    });
    if (!res.ok) throw new Error('Failed to toggle subtask');
    return res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(projectData) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData)
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete project');
    return res.json();
  },

  // Activities
  async getActivities() {
    const res = await fetch(`${API_BASE}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async clearActivities() {
    const res = await fetch(`${API_BASE}/activities`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear activities');
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Seed
  async seedDatabase() {
    const res = await fetch(`${API_BASE}/seed`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to seed database');
    return res.json();
  }
};
