const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' }
});

module.exports = mongoose.model('Reminder', ReminderSchema);