const Task = require('../models/Task');
const Activity = require('../models/Activity');

// Helper to log activities
const logActivity = async (action, taskTitle, details, type) => {
  try {
    await Activity.create({ action, taskTitle, details, type });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

// Get all tasks (supports search, status filter, priority filter, project filter)
exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, projectId, sortBy } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (projectId && projectId !== 'all') {
      query.projectId = projectId;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      sortOption = { priority: -1 };
    } else if (sortBy === 'title') {
      sortOption = { title: 1 };
    }

    const tasks = await Task.find(query).populate('projectId').sort(sortOption);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    await savedTask.populate('projectId');

    await logActivity('Created task', savedTask.title, `Assigned priority: ${savedTask.priority}`, 'create');

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    const statusChanged = req.body.status && req.body.status !== existingTask.status;
    
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('projectId');

    if (statusChanged) {
      await logActivity(
        'Changed status',
        updatedTask.title,
        `From ${existingTask.status.replace('_', ' ')} to ${updatedTask.status.replace('_', ' ')}`,
        'status'
      );
    } else {
      await logActivity('Updated task details', updatedTask.title, 'Task metadata modified', 'update');
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update task status only (for Kanban drag & drop / quick action)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });

    const prevStatus = existingTask.status;
    existingTask.status = status;
    const updatedTask = await existingTask.save();
    await updatedTask.populate('projectId');

    await logActivity(
      'Updated status',
      updatedTask.title,
      `Moved from "${prevStatus.replace('_', ' ')}" to "${status.replace('_', ' ')}"`,
      'status'
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Toggle subtask completion status
exports.toggleSubtask = async (req, res) => {
  try {
    const { subtaskId } = req.params;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ error: 'Subtask not found' });

    subtask.completed = !subtask.completed;
    await task.save();
    await task.populate('projectId');

    await logActivity(
      subtask.completed ? 'Completed subtask' : 'Reopened subtask',
      task.title,
      `"${subtask.text}"`,
      'subtask'
    );

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await Task.findByIdAndDelete(req.params.id);
    await logActivity('Deleted task', task.title, `Removed from list`, 'delete');

    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
