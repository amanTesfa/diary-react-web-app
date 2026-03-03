import mongoose from 'mongoose';
const MoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emoji: { type: String },
  color: { type: String }
});
const Mood = mongoose.model('Moods', MoodSchema);
export default Mood;