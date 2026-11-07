const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'review', 'completed'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: Date,
      default: null
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    subtasks: [SubtaskSchema],
    assignee: {
      name: { type: String, default: 'Unassigned' },
      avatar: { type: String, default: '' },
      role: { type: String, default: 'Developer' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
