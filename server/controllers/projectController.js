const Project = require('../models/Project');
const Task = require('../models/Task');

// Get all projects with associated task count
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ name: 1 });
    
    // Attach task count to each project
    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        return {
          ...project.toObject(),
          taskCount
        };
      })
    );

    res.json(projectsWithCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Unassign tasks from deleted project
    await Task.updateMany({ projectId: req.params.id }, { $set: { projectId: null } });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
