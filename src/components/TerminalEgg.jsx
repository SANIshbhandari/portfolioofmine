import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerAchievement } from './AchievementToasts';
import { projects } from '../data/projects';
import { allSkillNames } from '../data/skills';

export default function TerminalEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([
    'SANISH OS v1.0 — INITIALIZING CORE BOOT SECTORS...',
    'SYSTEM ONLINE. Type "help" for a list of available command channels.',
    ''
  ]);
  const [inputVal, setInputVal] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      triggerAchievement('HACKER');
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmdText) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    const newHistory = [...history, `> ${cmdText}`];

    if (!cleanCmd) {
      setHistory([...newHistory, '']);
      return;
    }

    switch (cleanCmd) {
      case 'help':
        setHistory([
          ...newHistory,
          'Available Commands:',
          '  whoami       - Prints profile details & active location coordinate.',
          '  skills       - Outputs tech stack with diagnostic ASCII visualizers.',
          '  projects     - Lists repository builds with direct click links.',
          '  contact      - Prints email comms port & secure social handles.',
          '  clear        - Clears local shell terminal buffer.',
          '  sudo hire-me - Initiates executive recruitment sequence.',
          '  exit         - Closes terminal shell.',
          ''
        ]);
        break;

      case 'whoami':
        setHistory([
          ...newHistory,
          'IDENTIFIER: Sanish Bhandari',
          'ROLE: Full Stack Developer / Creative Coder',
          'STATUS: BCA 5th Semester @ Kalika Campus, Butwal',
          'COORDINATES: Palpa Rampur, Nepal',
          'STATUS BAR: Searching for opportunities to construct next-level web software.',
          ''
        ]);
        break;

      case 'skills':
        const skillBars = [
          'React       [████████████████░░░] 85%',
          'JavaScript  [████████████████░░░] 80%',
          'Tailwind    [██████████████░░░░░] 75%',
          'Node.js     [████████████░░░░░░░] 65%',
          'Python      [████████████░░░░░░░] 60%',
          'Git/GitHub  [████████████████░░░] 80%',
          'Supabase    [████████████░░░░░░░] 60%',
          'Figma       [██████████░░░░░░░░░] 55%',
        ];
        setHistory([
          ...newHistory,
          'SYSTEM LOG: SCANNING TECH ARSENAL MATRIX...',
          ...skillBars,
          ''
        ]);
        break;

      case 'projects':
        const projLines = projects.map(p => `  • ${p.title} - ${p.description.slice(0, 50)}...`);
        setHistory([
          ...newHistory,
          'CENTRAL REPOSITORY RECORDS:',
          ...projLines,
          'Use the web cards in the Projects section to open direct links.',
          ''
        ]);
        break;

      case 'contact':
        setHistory([
          ...newHistory,
          'COMMS PORT ENVELOPE: sanishbhandari237@gmail.com',
          'NET_ID (GitHub): https://github.com/SANIshbhandari',
          'NET_ID (LinkedIn): https://www.linkedin.com/in/sanish-bhandari-b0a828296/',
          ''
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        setIsOpen(false);
        break;

      case 'sudo hire-me':
        triggerAchievement('RECIPROCAL');
        setConfettiActive(true);
        setTimeout(() => setConfettiActive(false), 5000);
        setHistory([
          ...newHistory,
          '>> INITIATING OVERRIDE: EXECUTIVE PRIVILEGES DELEGATED.',
          '>> STATUS: SENDING RECRUITMENT OFFER TO CENTRAL NET...',
          '>> SUCCESS: ACHIEVEMENT UNLOCKED! YOU HAVE BEEN RECRUITED.',
          '🏆 GAME OVER. THANK YOU FOR INITIATING TRANSMISSION.',
          ''
        ]);
        break;

      default:
        setHistory([
          ...newHistory,
          `command not recognized: "${cleanCmd}". Type "help" for instructions.`,
          ''
        ]);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCommand(inputVal);
    setInputVal('');
  };

  return (
    <>
      {/* Floating terminal trigger button bottom-left */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: '0 0 15px var(--cyan)' }}
        whileTap={{ scale: 0.9 }}
        data-cursor="link"
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          background: 'rgba(2, 4, 8, 0.8)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cyan)',
          fontSize: '1.2rem',
          zIndex: 9999,
          cursor: 'none',
          backdropFilter: 'blur(5px)',
          fontFamily: "'Share Tech Mono', monospace",
        }}
        aria-label="Open Terminal Shell"
      >
        &gt;_
      </motion.button>

      {/* Terminal Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(2, 4, 8, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              backdropFilter: 'blur(8px)',
              padding: '1rem',
            }}
          >
            {/* Confetti canvas animation inside the modal */}
            {confettiActive && <ConfettiOverlay />}

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '700px',
                height: '420px',
                background: '#0a0a0a',
                border: '2px solid var(--cyan)',
                borderRadius: '8px',
                boxShadow: '0 0 40px rgba(0, 255, 255, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Scanline CRT Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0, 255, 99, 0.03) 50%, transparent 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
                zIndex: 10,
              }} />

              {/* Terminal Title Bar */}
              <div style={{
                height: '35px',
                background: '#111',
                borderBottom: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                userSelect: 'none',
              }}>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.75rem',
                  color: 'var(--cyan)',
                  letterSpacing: '1px',
                }}>
                  🤖 COMMAND_SHELL://sanish_os_core
                </span>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff5f56',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                  }}
                  title="Close Terminal"
                >
                  ✕
                </button>
              </div>

              {/* Terminal Logs View */}
              <div
                onClick={() => { if (inputRef.current) inputRef.current.focus(); }}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  overflowY: 'auto',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.85rem',
                  color: 'var(--neon-green)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  textShadow: '0 0 2px rgba(0, 255, 153, 0.3)',
                  scrollbarWidth: 'thin',
                }}
              >
                {history.map((line, idx) => (
                  <div key={idx} style={{ whiteSpace: 'pre-wrap', minHeight: '1.2em' }}>
                    {line}
                  </div>
                ))}
                <div ref={terminalEndRef} />

                {/* Shell Input Row */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ marginRight: '0.5rem', color: 'var(--cyan)' }}>$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--cyan)',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.85rem',
                      caretColor: 'var(--cyan)',
                    }}
                    autoFocus
                  />
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Custom internal CSS particle overlay for sudo hire-me celebratory state
function ConfettiOverlay() {
  const particles = useMemo(() => {
    const list = [];
    const colors = ['#00FFFF', '#FF00FF', '#00FF99', '#FFFF00', '#FF3366'];
    for (let i = 0; i < 80; i++) {
      list.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 8 + 4,
        color: colors[i % colors.length],
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        xShift: (Math.random() - 0.5) * 40,
      });
    }
    return list;
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 2,
      overflow: 'hidden',
    }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '-5%', x: `${p.x}%`, rotate: 0 }}
          animate={{
            y: '105%',
            x: `${p.x + p.xShift}%`,
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: p.id % 3 === 0 ? '50%' : '3px',
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
