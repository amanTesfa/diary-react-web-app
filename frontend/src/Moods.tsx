import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { MoodsDTO } from './types/MoodsDTO';
import axios from 'axios';
declare const process: { env: Record<string, string | undefined> };
function Moods() {
  const [moods, setMoods] = useState<MoodsDTO[]>([]);
  const [form, setForm] = useState({ name: '', emoji: '', color: '' });
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/moods')
      .then(res => setMoods(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to fetch moods'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(process.env.REACT_APP_API_URL + `/api/moods/${editingId}`, form);
        toast.success('Mood updated');
      } else {
        await axios.post(process.env.REACT_APP_API_URL + '/api/moods', form);
        toast.success('Mood added');
      }
      setForm({ name: '', emoji: '', color: '' });
      setEditingId("");
      const res = await axios.get(process.env.REACT_APP_API_URL + '/api/moods');
      setMoods(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save mood');
    }
  };

  const handleDelete = async (id:string) => {
    try {
      setMoods(moods.filter(m => m._id !== id));
      toast.success('Mood deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete mood');
    }
  };

  const handleEdit = (mood:MoodsDTO) => {
    setForm({ name: mood.name, emoji: mood.emoji || '', color: mood.color || '' });
    setEditingId(mood._id);
  };

  return (
    <div>
      <h1>Moods</h1>
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', maxWidth: 500 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Emoji" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
        <input placeholder="Color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Mood</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(""); setForm({ name: '', emoji: '', color: '' }); }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {moods.map(mood => (
          <div key={mood._id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
              <strong style={{ fontSize: '1.1rem' }}>{mood.name}</strong>
              <span style={{ color: mood.color, marginLeft: 'auto' }}>{mood.color}</span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-info" onClick={() => handleEdit(mood)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(mood._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Moods;
