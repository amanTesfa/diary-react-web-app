import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { AttachmentDTO } from './types/AttachmentDTO';
declare const process: { env: Record<string, string | undefined> };
function Attachments() {
  const [attachments, setAttachments] = useState<AttachmentDTO[]>([]);
  const [form, setForm] = useState({ diaryEntryId: '', userId: '', filename: '', fileType: '', fileUrl: '' });
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/attachments')
      .then(res => setAttachments(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error('Failed to fetch attachments'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/attachments/${editingId}`, form);
        toast.success('Attachment updated');
      } else {
        await axios.post('/api/attachments', form);
        toast.success('Attachment added');
      }
      setForm({ diaryEntryId: '', userId: '', filename: '', fileType: '', fileUrl: '' });
      setEditingId("");
      const res = await axios.get('/api/attachments');
      setAttachments(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save attachment');
    }
  };

  const handleDelete = async (id:string) => {
    try {
      await axios.delete(`/api/attachments/${id}`);
      setAttachments(attachments.filter(a => a._id !== id));
      toast.success('Attachment deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to delete attachment');
    }
  };

  const handleEdit = (attachment:AttachmentDTO) => {
    setForm({
      diaryEntryId: attachment.diaryEntryId,
      userId: attachment.userId,
      filename: attachment.filename,
      fileType: attachment.fileType || '',
      fileUrl: attachment.fileUrl
    });
    setEditingId(attachment._id);
  };

  return (
    <div>
      <h1>Attachments</h1>
      <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', maxWidth: 600 }}>
        <input placeholder="Diary Entry ID" value={form.diaryEntryId} onChange={e => setForm({ ...form, diaryEntryId: e.target.value })} required />
        <input placeholder="User ID" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} required />
        <input placeholder="Filename" value={form.filename} onChange={e => setForm({ ...form, filename: e.target.value })} required />
        <input placeholder="File Type" value={form.fileType} onChange={e => setForm({ ...form, fileType: e.target.value })} />
        <input placeholder="File URL" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} required />
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'} Attachment</button>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(""); setForm({ diaryEntryId: '', userId: '', filename: '', fileType: '', fileUrl: '' }); }}>Cancel</button>}
        </div>
      </form>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {attachments.map(attachment => (
          <div key={attachment._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '1.1rem' }}>{attachment.filename}</strong>
              <span style={{ color: '#888', fontWeight: 500 }}>{attachment.fileType}</span>
            </div>
            <p style={{ margin: '1rem 0' }}>URL: <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">{attachment.fileUrl}</a></p>
            <small style={{ color: '#6366f1' }}>DiaryEntryId: {attachment.diaryEntryId} | UserId: {attachment.userId}</small>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-sm btn-info" onClick={() => handleEdit(attachment)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(attachment._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Attachments;
