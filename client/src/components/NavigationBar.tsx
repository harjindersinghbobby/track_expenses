import  { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NavigationBar.module.css';
type Props = {
  onReload?: () => void;
  handleAnalyze?: () => void;
};
const NavigationBar = ({handleAnalyze,onReload}: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.title}>💰 Expense Tracker</div>

      <div className={styles.menuWrapper}>
        <button
          className={styles.reloadIcon}
          title="Reload Data"
          onClick={() => onReload && onReload()}
        >
          🔄
        </button>
           <button
          className={styles.aiIcon}
          title="Analyze with AI"
          onClick={() => handleAnalyze && handleAnalyze()}
        >
          🤖
        </button>
        <button onClick={toggleMenu} className={styles.menuIcon}>
          ☰
        </button>

        {menuOpen && (
          <div className={styles.dropdown} ref={menuRef}>
            <div className={styles.link} onClick={() => navigate('/')}>
              📊 Dashboard
            </div>
            <div className={styles.link} onClick={() => navigate('/reports')}>
              📈 Reports
            </div>
            <div className={styles.link} onClick={() => navigate('/settings')}>
              ⚙️ Settings
            </div>
            <button className={styles.logout} onClick={handleLogout}>
              🔓 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
