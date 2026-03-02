const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String },
  color: { type: String }
});

module.exports = mongoose.model('Mood', MoodSchema);