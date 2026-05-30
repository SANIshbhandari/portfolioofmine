import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ACHIEVEMENTS = {
  PAGE_LOAD: { title: 'FIRST BLOOD', desc: 'Welcome to the portfolio', icon: '🏆' },
  LORE_SEEKER: { title: 'LORE SEEKER', desc: 'Read the backstory', icon: '📚' },
  SKILL_TREE: { title: 'SKILL TREE', desc: 'Checked the loadout', icon: '🧬' },
  RECON: { title: 'RECON', desc: 'Scoped the builds', icon: '📡' },
  FAN_FAVORITE: { title: 'FAN FAVORITE', desc: 'Dropped a project like', icon: '💖' },
  HEADHUNTER: { title: 'HEADHUNTER', desc: 'Initiated comms', icon: '🛰️' },
  MESSAGE_SENT: { title: 'MESSAGE SENT', desc: 'Signal transmitted', icon: '✉️' },
  HACKER: { title: 'HACKER', desc: 'Found the hidden terminal', icon: '👾' },
  CHEAT_CODE: { title: 'CHEAT CODE', desc: 'You know too much', icon: '🔓' },
  RECIPROCAL: { title: 'RECRUITED', desc: 'Sudo hire transmission', icon: '🤝' },
};

/**
 * Dispatches an event to unlock an achievement.
 * @param {string} key - Key matching an achievement in ACHIEVEMENTS
 */
export function triggerAchievement(key) {
  if (typeof window !== 'undefined' && ACHIEVEMENTS[key]) {
    window.dispatchEvent(new CustomEvent('unlock-achievement', { detail: key }));
  }
}

export default function AchievementToasts() {
  const [activeToast, setActiveToast] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const handleUnlock = (e) => {
      const key = e.detail;
      const achievement = ACHIEVEMENTS[key];
      if (!achievement) return;

      // Check if unlocked in current session to prevent spamming
      const unlockedList = JSON.parse(sessionStorage.getItem('unlocked-achievements') || '[]');
      if (unlockedList.includes(key)) return;

      // Mark as unlocked
      unlockedList.push(key);
      sessionStorage.setItem('unlocked-achievements', JSON.stringify(unlockedList));

      // Push to queue
      setQueue((prev) => [...prev, { ...achievement, key }]);
    };

    window.addEventListener('unlock-achievement', handleUnlock);
    return () => window.removeEventListener('unlock-achievement', handleUnlock);
  }, []);

  // Process queue
  useEffect(() => {
    if (activeToast || queue.length === 0) return;

    // Shift first item from queue
    const nextToast = queue[0];
    setActiveToast(nextToast);
    setQueue((prev) => prev.slice(1));

    // Play chime sound synthesized dynamically
    playAchievementSound();

    // Auto-dismiss after 3.5 seconds
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [queue, activeToast]);

  // Synthesize an achievement unlock chime using Web Audio API
  const playAchievementSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      // Xbox-style double chime (short high notes)
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
      
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6 octave double-up

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('AudioContext blocked or uninitialized');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 999999,
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.5rem',
              background: '#0a0e17',
              border: '1px solid #ffbd2e',
              borderLeft: '4px solid #ffbd2e',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(255, 189, 46, 0.25), 0 10px 30px rgba(0, 0, 0, 0.4)',
              width: '320px',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient scanline overlay inside card */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255, 189, 46, 0.04) 50%, transparent 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
            }} />

            {/* Icon */}
            <div style={{
              fontSize: '2rem',
              textShadow: '0 0 10px rgba(255, 189, 46, 0.5)',
            }}>
              {activeToast.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.65rem',
                color: '#ffbd2e',
                letterSpacing: '2px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                lineHeight: 1.2,
              }}>
                ACHIEVEMENT UNLOCKED
              </span>
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#e6edf3',
                marginTop: '0.15rem',
                letterSpacing: '1px',
              }}>
                {activeToast.title}
              </span>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.8rem',
                color: '#8b949e',
                marginTop: '0.1rem',
                fontWeight: 500,
              }}>
                {activeToast.desc}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
