import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { DairyEntriesDTO } from './types/DairyEntriesDTO';
import type { AttachmentDTO } from './types/AttachmentDTO';
import type { MoodsDTO } from './types/MoodsDTO';

function Reminders() {
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [entries, setEntries] = useState<DairyEntriesDTO[]>([]);
  const [attachments, setAttachments] = useState<AttachmentDTO[]>([]);
  const [moods, setMoods] = useState<MoodsDTO[]>([]);

  const fetchAll = async (date: string) => {
    try {
      const diaryUrl = date
        ? `${import.meta.env.VITE_API_URL}/api/diary?date=${date}`
        : `${import.meta.env.VITE_API_URL}/api/diary?all=true`;
      const [dRes, aRes, mRes] = await Promise.all([
        axios.get(diaryUrl),
        axios.get(import.meta.env.VITE_API_URL + `/api/attachments`),
        axios.get(import.meta.env.VITE_API_URL + `/api/moods`)
      ]);
      setEntries(Array.isArray(dRes.data) ? dRes.data : []);
      setAttachments(Array.isArray(aRes.data) ? aRes.data : []);
      setMoods(Array.isArray(mRes.data) ? mRes.data : []);
    } catch (err: any) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchAll(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const moodEmoji = (name: string) => {
    const m = moods.find(x => x.name === name);
    return m?.emoji || '';
  };

  return (
    <div>
      <h2>Diaries by Date</h2>
      <hr />
      <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={{ fontSize: '1.5rem', padding: '0.3rem' }}
        />
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSelectedDate('')}
          style={{ height: '2.3rem' }}
        >
          Clear
        </button>
      </div>
      {entries.map(ent => (
        <div key={ent._id} className="card" style={{ marginBottom: '1rem' }}>
          <h2>
            {ent.title} {moodEmoji(ent.mood || '')}
          </h2>
          <p>{ent.content}</p>
          {ent.tags && ent.tags.length ? (
            <small>Tags: {ent.tags.join(', ')}</small>
          ) : null}
          <small style={{ display: 'block', marginTop: '0.5rem' }}>Created: {ent.createdAt ? new Date(ent.createdAt).toLocaleString() : 'N/A'}</small>
          <div style={{ marginTop: '0.5rem' }}>
            {attachments
              .filter(a => a.diaryEntryId === ent._id)
              .map(att => (
                <div key={att._id}>
                  <a href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                    {att.filename}
                  </a>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reminders;
