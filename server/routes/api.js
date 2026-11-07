const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const projectController = require('../controllers/projectController');
const activityController = require('../controllers/activityController');
const statsController = require('../controllers/statsController');
const seedDatabase = require('../utils/seedData');

// Task Routes
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTaskById);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.patch('/tasks/:id/status', taskController.updateTaskStatus);
router.patch('/tasks/:id/subtasks/:subtaskId', taskController.toggleSubtask);
router.delete('/tasks/:id', taskController.deleteTask);

// Project Routes
router.get('/projects', projectController.getProjects);
router.post('/projects', projectController.createProject);
router.delete('/projects/:id', projectController.deleteProject);

// Activity Log Routes
router.get('/activities', activityController.getActivities);
router.delete('/activities', activityController.clearActivities);

// Dashboard Stats Route
router.get('/stats', statsController.getDashboardStats);

// Manual Seed Endpoint
router.post('/seed', async (req, res) => {
  try {
    await seedDatabase();
    res.json({ message: 'Database reset and seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
