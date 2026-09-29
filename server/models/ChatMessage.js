const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // For fast lookup by user
  },
  sender: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: 'Guest User'
  },
  source: {
    type: String,
    enum: ['chat', 'email', 'contact_form'],
    default: 'chat'
  },
  hiddenFromUser: {
    type: Boolean,
    default: false
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for querying user's conversation
chatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);