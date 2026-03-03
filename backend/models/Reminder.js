import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' }
});

const Reminder = mongoose.model('Reminders', ReminderSchema);
export default Reminder;