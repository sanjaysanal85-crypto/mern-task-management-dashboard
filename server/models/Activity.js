const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    taskTitle: {
      type: String,
      default: ''
    },
    details: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      enum: ['create', 'update', 'status', 'delete', 'subtask'],
      default: 'update'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
