import React, { useEffect, useState } from 'react';
declare const process: { env: Record<string, string | undefined> };
import axios from 'axios';
import toast from 'react-hot-toast';
import type { RemainderDTO } from './types/RemainderDTO';

function Reminders() {
  const [reminders, setReminders] = useState<RemainderDTO[]>([]);
  const [form, setForm] = useState<RemainderDTO | null>({ time: '', frequency: 'daily', isEnabled: true, userId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/reminders')
      .then(res => setReminders(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to fetch reminders'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(process.env.REACT_APP_API_URL + `/api/reminders/${editingId}`, form);
        toast.success('Reminder updated');
      } else {
        await axios.post(process.env.REACT_APP_API_URL + '/api/reminders', form);
        toast.success('Reminder added');
      }
      setForm({ time: '', frequency: 'daily', isEnabled: true, userId: '' } as RemainderDTO);
      setEditingId("");
      const res = await axios.get(process.env.REACT_APP_API_URL + '/api/reminders');
      setReminders(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save reminder');
    }
  };

  const handleDelete = async (id:string|null|undefined) => {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/api/reminders/${id}`);
      setReminders(reminders.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete reminder');
    }
  };

  const handleEdit = (reminder:RemainderDTO) => {
    setForm({
      time: reminder.time,
      frequency: reminder.frequency,
      isEnabled: reminder.isEnabled,
      userId: reminder.userId
    });
    setEditingId(reminder._id || null);
  };

  return (
    <div>
      <h1>Reminders</h1>
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', maxWidth: 500 }}>
        <input placeholder="Time" value={form?.time} onChange={e => setForm({ ...form, time: e.target.value } as RemainderDTO)} required />
        <select value={form?.frequency} onChange={e => setForm({ ...form, frequency: e.target.value } as RemainderDTO)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <label style={{ marginBottom: '1rem' }}>
          <input type="checkbox" checked={form?.isEnabled} onChange={e => setForm({ ...form, isEnabled: e.target.checked } as RemainderDTO)} style={{ marginRight: '0.5rem' }} /> Enabled
        </label>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Reminder</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ time: '', frequency: 'daily', isEnabled: true, userId: '' } as RemainderDTO); }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {reminders.map(reminder => (
          <div key={reminder._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem' }}>{reminder.time}</strong>
              <span style={{ color: '#6366f1', fontWeight: 500 }}>{reminder.frequency}</span>
              <span style={{ color: reminder.isEnabled ? '#22c55e' : '#dc3545', fontWeight: 500 }}>{reminder.isEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-info" onClick={() => handleEdit(reminder)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(reminder._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reminders;
