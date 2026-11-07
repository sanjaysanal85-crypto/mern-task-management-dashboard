const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    icon: {
      type: String,
      default: 'folder'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
