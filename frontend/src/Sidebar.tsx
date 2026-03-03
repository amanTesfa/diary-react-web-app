import './Sidebar.css';
const links = [
  { name: 'Diary Entries', icon: '📔' },
  { name: 'Moods', icon: '😊' },
  { name: 'Reminders', icon: '⏰' },
  { name: 'Attachments', icon: '📎' }
];

function Sidebar({ theme, setTheme, active, setActive, isOpen, setIsOpen } : { theme: string; setTheme: (theme: string) => void; active: string; setActive: (active: string) => void; isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <aside className={`sidebar ${theme} ${isOpen ? 'open' : ''}`}>  
        <div className="sidebar-header">
          <h3 id="headerTitle">My Diaries</h3>
          <button className="theme-toggle" style={{    padding: "0.1rem 0rem", background:"transparent"}} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>
        <nav>
          <ul className='list-image-none' style={{listStyle:'none'}}>
            {links.map(link => (
              <li key={link.name}>
                <a href="#" className={active === link.name ? 'active' : ''} onClick={() => setActive(link.name)}>
                  <span className="icon">{link.icon}</span>
                  {isOpen ? link.name : ''}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
