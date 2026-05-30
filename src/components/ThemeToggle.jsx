import { motion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';

export default function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark';
  const toggleRef = useMagnetic(0.35);

  return (
    <button
      ref={toggleRef}
      onClick={toggleTheme}
      data-cursor="link"
      aria-label="Toggle theme"
      style={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        background: 'transparent',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'border-color 0.3s',
      }}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', fontSize: '1.1rem' }}
      >
        🌙
      </motion.div>
      <motion.div
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'absolute', fontSize: '1.1rem' }}
      >
        ☀️
      </motion.div>
    </button>
  );
}
