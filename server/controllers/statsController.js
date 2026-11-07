const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const todoCount = await Task.countDocuments({ status: 'todo' });
    const inProgressCount = await Task.countDocuments({ status: 'in_progress' });
    const reviewCount = await Task.countDocuments({ status: 'review' });
    const completedCount = await Task.countDocuments({ status: 'completed' });

    const lowPriorityCount = await Task.countDocuments({ priority: 'low' });
    const mediumPriorityCount = await Task.countDocuments({ priority: 'medium' });
    const highPriorityCount = await Task.countDocuments({ priority: 'high' });
    const urgentPriorityCount = await Task.countDocuments({ priority: 'urgent' });

    const now = new Date();
    const overdueCount = await Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: 'completed' }
    });

    const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    const projectsCount = await Project.countDocuments();

    res.json({
      totalTasks,
      statusBreakdown: {
        todo: todoCount,
        in_progress: inProgressCount,
        review: reviewCount,
        completed: completedCount
      },
      priorityBreakdown: {
        low: lowPriorityCount,
        medium: mediumPriorityCount,
        high: highPriorityCount,
        urgent: urgentPriorityCount
      },
      overdueCount,
      completionRate,
      projectsCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
