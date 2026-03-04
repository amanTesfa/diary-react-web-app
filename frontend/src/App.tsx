


import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import DiaryEntries from './DiaryEntries';
import Moods from './Moods';
import Reminders from './Reminders';
import Attachments from './Attachments';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [active, setActive] = useState('Diary Entries');
  const [isOpen, setIsOpen] = useState(window.innerWidth > 700);

  React.useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app-container ${theme}`} style={{ display: 'flex', minHeight: '100vh' }}>
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
      <Sidebar theme={theme} setTheme={setTheme} active={active} setActive={setActive} isOpen={isOpen} setIsOpen={setIsOpen} />
      <main style={{ marginLeft: isOpen ? 220 : 60, flex: 1 }}>
        {active === 'Diary Entries' && <DiaryEntries />}
        {active === 'Moods' && <Moods />}
        {active === 'Reminders' && <Reminders />}
        {active === 'Attachments' && <Attachments />}
      </main>
    </div>
  );
}

export default App;
