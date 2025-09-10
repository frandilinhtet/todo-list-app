// models/Todo.js
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date, // New field for due date
    default: null,
  },
  priority: {
    type: Number, // New field for priority (e.g., 1-5)
    default: 1,
  },
  category: {
    type: String, // New field for category
    default: 'General',
  },
});

module.exports = mongoose.model('Todo', TodoSchema);