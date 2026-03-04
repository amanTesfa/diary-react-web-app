import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { DairyEntriesDTO } from './types/DairyEntriesDTO';
import type { MoodsDTO } from './types/MoodsDTO';
function DiaryEntries() {
  const [entries, setEntries] = useState<DairyEntriesDTO[]>([]);
  const [moods, setMoods] = useState<MoodsDTO[]>([]);
  const [form, setForm] = useState({ title: '', content: '', mood: '', tags: '' });
  const [editingId, setEditingId] = useState<string>("");
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // style injection for modal animation
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch entries (only today's by default)
  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/api/diary?today=true')
      .then(res => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch((e) => toast.error('Failed to fetch diary entries', e));

    // get moods for select
    axios.get(import.meta.env.VITE_API_URL + '/api/moods')
      .then(res => setMoods(Array.isArray(res.data) ? res.data : []))
      .catch((e) => toast.error('Failed to fetch moods', e));
  }, []);

  // Create or update entry
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.content.trim()) {
      toast.error('Content cannot be empty');
      return;
    }
    try {
      if (editingId) {
        await axios.put(import.meta.env.VITE_API_URL +`/api/diary/${editingId}`, { ...form, tags: form.tags.split(',') });
        toast.success('Diary entry updated');
      } else {
        console.log("Form data is:", { ...form, tags: form.tags.split(',') });
        await axios.post(import.meta.env.VITE_API_URL +'/api/diary', { ...form, tags: form.tags.split(',') });
        toast.success('Diary entry added');
      }
      // clear and close modal
      setForm({ title: '', content: '', mood: '', tags: '' });
      setEditingId("");
      setShowModal(false);
      const res = await axios.get(import.meta.env.VITE_API_URL +'/api/diary?today=true');
      setEntries(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save diary entry'+(err?.message ? `: ${err.message}` : ''));
    }
  };
  const handleDeleteClick = (id:string) => {
    setEntryToDelete(id);
  };

  const openNewEntry = () => {
    setForm({ title: '', content: '', mood: '', tags: '' });
    setEditingId("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId("");
    setForm({ title: '', content: '', mood: '', tags: '' });
  };
  // Delete entry
  const doDelete = async (id:string) => {
    try {
      await axios.delete(import.meta.env.VITE_API_URL +`/api/diary/${id}`);
      setEntries(entries.filter(e => e._id !== id));
      toast.success('Diary entry deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete diary entry' + (err?.message ? `: ${err.message}` : ''));
    } finally {
      setEntryToDelete(null);
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
    setShowModal(true);
  };

  return (
    <div>
      <h2>Diary Entries</h2>
      <hr />
          {/* confirmation modal */}
      {entryToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 4, maxWidth: 300 }}>
            <p>Are you sure you want to delete this diary entry?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setEntryToDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => doDelete(entryToDelete)}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
      {/* main form moved into modal - button triggers modal */}
      <button className="btn btn-primary" onClick={openNewEntry} style={{ marginBottom: '1rem' }}>
        Add today's diary
      </button>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'white', padding: '2rem', borderRadius: 8,
            maxWidth: 800, width: '95%', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            position: 'relative'
          }}>
            <button
              onClick={closeModal}
              style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ width: '5rem', marginRight: '1rem' }}>Title:</label>
                <input style={{width:'50%'}} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}  />
              </div>
             
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ width: '5rem', marginRight: '1rem' }}>Mood:</label>
                <select
                style={{width:'50%'}}
                    value={form.mood}
                    onChange={e => setForm({ ...form, mood: e.target.value })}
                  >
                    <option value="">(none)</option>
                    {moods.map(m => (
                      <option key={m._id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ width: '5rem', marginRight: '1rem' }}>Tags:</label>
                <input style={{width:'50%'}} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="comma separated" />
              </div>
               <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <label style={{ width: '5rem', marginRight: '1rem', paddingTop: '0.5rem' }}>Content: <span className='text-danger'>*</span></label>
                <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}  rows={3} style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Entry</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
           
              <button className="btn  btn-info" onClick={() => handleEdit(entry)}>Edit</button>
              <button className="btn  btn-danger" onClick={() => handleDeleteClick(entry._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiaryEntries;
