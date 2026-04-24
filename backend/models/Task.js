const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Max 100 chars']
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  priority: {
    type: String,
    default: 'Low',
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
    index: { expires: '7d' } // auto delete after 7 days
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);