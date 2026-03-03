import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { DairyEntriesDTO } from './types/DairyEntriesDTO';
declare const process: { env: Record<string, string | undefined> };
function DiaryEntries() {
  const [entries, setEntries] = useState<DairyEntriesDTO[]>([]);
  const [form, setForm] = useState({ title: '', content: '', mood: '', tags: '' });
  const [editingId, setEditingId] = useState<string>("");

  // Fetch entries
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/diary')
      .then(res => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch((e) => toast.error('Failed to fetch diary entries', e));
  }, []);

  // Create or update entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/diary/${editingId}`, { ...form, tags: form.tags.split(',') });
        toast.success('Diary entry updated');
      } else {
        await axios.post('/api/diary', { ...form, tags: form.tags.split(',') });
        toast.success('Diary entry added');
      }
      setForm({ title: '', content: '', mood: '', tags: '' });
      setEditingId("");
      const res = await axios.get('/api/diary');
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save diary entryff'+(err?.message ? `: ${err.message}` : ''));
    }
  };

  // Delete entry
  const handleDelete = async (id:string) => {
    try {
      await axios.delete(`/api/diary/${id}`);
      setEntries(entries.filter(e => e._id !== id));
      toast.success('Diary entry deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete diary entry' + (err?.message ? `: ${err.message}` : ''));
    }
  };

  // Edit entry
  const handleEdit = (entry:DairyEntriesDTO) => {
    setForm({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || '',
      tags: entry.tags ? entry.tags.join(',') : ''
    });
    setEditingId(entry._id);
  };

  return (
    <div>
      <h1>Diary Entries</h1>
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', maxWidth: 600 }}>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={3} />
        <input placeholder="Mood" value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })} />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Entry</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(""); setForm({ title: '', content: '', mood: '', tags: '' }); }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {entries && entries.map(entry => (
          <div key={entry._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.2rem' }}>{entry.title}</strong>
              <span style={{ color: '#888', fontWeight: 500 }}>{entry.mood}</span>
            </div>
            <p style={{ margin: '1rem 0' }}>{entry.content}</p>
            <small style={{ color: '#6366f1' }}>Tags: {entry.tags && entry.tags.join(', ')}</small>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-info" onClick={() => handleEdit(entry)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryEntries;
