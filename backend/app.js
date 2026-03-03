import express from 'express';
import mongoose from 'mongoose';
import connectDB from './lib/conn.js';
import DiaryEntry from './models/DiaryEntry.js';
import Mood from './models/Mood.js';
import Reminder from './models/Reminder.js';
import Attachment from './models/Attachment.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
// Attachment CRUD routes
// Create
app.post('/api/attachments', async (req, res) => {
  try {
    const attachment = new Attachment(req.body);
    await attachment.save();
    res.status(201).json(attachment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read all
app.get('/api/attachments', async (req, res) => {
  try {
    const attachments = await Attachment.find();
    res.json(attachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Read one
app.get('/api/attachments/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    res.json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update
app.put('/api/attachments/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    res.json(attachment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete
app.delete('/api/attachments/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findByIdAndDelete(req.params.id);
    if (!attachment) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use(express.json());

// Connect to MongoDB
connectDB();

// DiaryEntry CRUD routes
// Create
app.post('/api/diary', async (req, res) => {
  try {
    const entry = new DiaryEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read all
app.get('/api/diary', async (req, res) => {
  try {
    const entries = await DiaryEntry.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Read one
app.get('/api/diary/:id', async (req, res) => {
  try {
    const entry = await DiaryEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update
app.put('/api/diary/:id', async (req, res) => {
  try {
    const entry = await DiaryEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete
app.delete('/api/diary/:id', async (req, res) => {
  try {
    const entry = await DiaryEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mood CRUD routes
// Create
app.post('/api/moods', async (req, res) => {
  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.status(201).json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read all
app.get('/api/moods', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Read one
app.get('/api/moods/:id', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) return res.status(404).json({ error: 'Not found' });
    res.json(mood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update
app.put('/api/moods/:id', async (req, res) => {
  try {
    const mood = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mood) return res.status(404).json({ error: 'Not found' });
    res.json(mood);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete
app.delete('/api/moods/:id', async (req, res) => {
  try {
    const mood = await Mood.findByIdAndDelete(req.params.id);
    if (!mood) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reminder CRUD routes
// Create
app.post('/api/reminders', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read all
app.get('/api/reminders', async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Read one
app.get('/api/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update
app.put('/api/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    res.json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Delete
app.delete('/api/reminders/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});