const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

const sampleProjects = [
  { name: 'Frontend Refactor', color: '#8b5cf6', icon: 'layout', description: 'Migrate legacy UI to modern React component hierarchy with Tailwind CSS' },
  { name: 'Mobile App V2', color: '#ec4899', icon: 'smartphone', description: 'Cross-platform app for iOS & Android with dark mode' },
  { name: 'Cloud Infrastructure', color: '#3b82f6', icon: 'server', description: 'Dockerize services, set up CI/CD pipelines, and configure Kubernetes clusters' },
  { name: 'Growth & Analytics', color: '#10b981', icon: 'trending-up', description: 'Implement product telemetry, user conversion funnels, and marketing dashboards' }
];

const seedDatabase = async () => {
  try {
    const existingTaskCount = await Task.countDocuments();
    if (existingTaskCount > 0) {
      console.log('🌱 Database already contains data. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Seeding initial database with sample projects and tasks...');

    await Project.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    const createdProjects = await Project.insertMany(sampleProjects);
    const p1 = createdProjects[0]._id;
    const p2 = createdProjects[1]._id;
    const p3 = createdProjects[2]._id;
    const p4 = createdProjects[3]._id;

    const today = new Date();
    const addDays = (days) => {
      const d = new Date();
      d.setDate(today.getDate() + days);
      return d;
    };

    const sampleTasks = [
      {
        title: 'Design Glassmorphism Dashboard UI/UX',
        description: 'Create high-fidelity mockups for dark & light mode dashboard using glassmorphism aesthetics and custom glowing tokens.',
        status: 'completed',
        priority: 'high',
        dueDate: addDays(-2),
        projectId: p1,
        tags: ['Design', 'Figma', 'UI/UX'],
        assignee: { name: 'Alex Rivera', role: 'Lead UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Create component wireframes', completed: true },
          { text: 'Define HSL color palette tokens', completed: true },
          { text: 'Design dark/light theme toggle specs', completed: true }
        ]
      },
      {
        title: 'Implement REST API Endpoints with Mongoose',
        description: 'Develop Express controllers and Mongoose schemas for Tasks, Projects, and Analytics audit logs.',
        status: 'in_progress',
        priority: 'urgent',
        dueDate: addDays(1),
        projectId: p3,
        tags: ['Backend', 'Node.js', 'MongoDB'],
        assignee: { name: 'Sarah Chen', role: 'Senior Backend Engineer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Task CRUD Endpoints', completed: true },
          { text: 'In-Memory MongoDB fallback handler', completed: true },
          { text: 'Dashboard Analytics Aggregation', completed: false }
        ]
      },
      {
        title: 'Drag & Drop Kanban Board Component',
        description: 'Integrate interactive drag and drop column movements with instant visual state updating and toast notifications.',
        status: 'in_progress',
        priority: 'high',
        dueDate: addDays(3),
        projectId: p1,
        tags: ['React', 'Kanban', 'Frontend'],
        assignee: { name: 'Marcus Vance', role: 'Frontend Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Kanban Column layout', completed: true },
          { text: 'Status update API trigger', completed: true },
          { text: 'Drag-and-drop state sync', completed: false }
        ]
      },
      {
        title: 'Configure Docker & CI/CD Pipelines',
        description: 'Setup GitHub Actions workflow for automated testing, linting, and container build deployments.',
        status: 'review',
        priority: 'medium',
        dueDate: addDays(4),
        projectId: p3,
        tags: ['DevOps', 'Docker', 'CI/CD'],
        assignee: { name: 'David Kim', role: 'DevOps Lead', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Write Multi-stage Dockerfile', completed: true },
          { text: 'Set up staging workflow script', completed: true }
        ]
      },
      {
        title: 'Product Analytics & Conversion Funnels',
        description: 'Integrate custom event logging to track task completion velocity, daily active usage, and feature adoption.',
        status: 'todo',
        priority: 'medium',
        dueDate: addDays(7),
        projectId: p4,
        tags: ['Analytics', 'Telemetry'],
        assignee: { name: 'Elena Rostova', role: 'Data Analyst', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Define key performance metrics', completed: false },
          { text: 'Connect backend logging middleware', completed: false }
        ]
      },
      {
        title: 'Mobile App Push Notification System',
        description: 'Implement real-time push alerts for deadline reminders, task assignments, and status updates.',
        status: 'todo',
        priority: 'low',
        dueDate: addDays(10),
        projectId: p2,
        tags: ['Mobile', 'Push Alerts', 'iOS'],
        assignee: { name: 'Lucas Scott', role: 'Mobile Developer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
        subtasks: [
          { text: 'Configure Firebase Cloud Messaging', completed: false },
          { text: 'Add notification preferences UI', completed: false }
        ]
      }
    ];

    await Task.insertMany(sampleTasks);

    await Activity.insertMany([
      { action: 'Created project', taskTitle: 'Frontend Refactor', details: 'Added new project category', type: 'create' },
      { action: 'Completed task', taskTitle: 'Design Glassmorphism Dashboard UI/UX', details: 'All 3 subtasks verified', type: 'status' },
      { action: 'Updated status', taskTitle: 'Implement REST API Endpoints with Mongoose', details: 'Moved to In Progress', type: 'status' }
    ]);

    console.log('✅ Seed completed successfully!');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
};

module.exports = seedDatabase;
