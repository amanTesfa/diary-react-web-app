import mongoose from 'mongoose';
const DiaryEntrySchema = new mongoose.Schema({
title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  tags: [{ type: String }],
  isFavorite: { type: Boolean, default: false },
  isPrivate: { type: Boolean, default: false },
}, { timestamps: true });

const DiaryEntry = mongoose.model('DiaryEntries', DiaryEntrySchema);
export default DiaryEntry;