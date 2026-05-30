import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Retro-gaming beep synthesis
const playBeep = (freq = 800, type = 'sine', duration = 0.08) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
};

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [glitchText, setGlitchText] = useState('INITIALIZING...');
  const [isExiting, setIsExiting] = useState(false);
  const fullName = 'SANISH BHANDARI';
  const intervalRef = useRef(null);

  // Type out name with dynamic typing sound
  useEffect(() => {
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= fullName.length) {
        setDisplayText(fullName.slice(0, charIndex));
        charIndex++;
        if (charIndex % 2 === 0) playBeep(1200, 'square', 0.02);
      } else {
        clearInterval(typeInterval);
      }
    }, 100);
    return () => clearInterval(typeInterval);
  }, []);

  // Scrambling glitch counts and stages
  useEffect(() => {
    const stages = [
      'BOOTING COGNITIVE NETWORK...',
      'DECRYPTING SECURITY KEYFIELDS...',
      'INJECTING RENDER CORES...',
      'ESTABLISHING DATABASE STREAM...',
      'SYSTEM ONLINE. ENGAGING PORTAL...'
    ];
    
    const stageIndex = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
    const activeStage = stages[stageIndex];
    
    // Scramble glitching
    if (progress < 100 && Math.random() > 0.65) {
      const cypher = '#$%&@010101[!]?+=-*';
      const scrambled = activeStage.split('').map(char => {
        if (char === ' ') return ' ';
        return Math.random() > 0.7 ? cypher[Math.floor(Math.random() * cypher.length)] : char;
      }).join('');
      setGlitchText(scrambled);
    } else {
      setGlitchText(activeStage);
    }
  }, [progress]);

  // Progress counter with dynamic sweep chirp
  useEffect(() => {
    const duration = 2800;
    const startTime = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);
      
      if (p % 15 === 0 && p < 100) {
        playBeep(400 + p * 6, 'sine', 0.04);
      }

      if (p >= 100) {
        clearInterval(intervalRef.current);
        playBeep(1000, 'sawtooth', 0.15);
        setTimeout(() => {
          setIsExiting(true);
          // Sync with the 850ms exit transition
          setTimeout(() => onComplete(), 850);
        }, 500);
      }
    }, 25);

    return () => clearInterval(intervalRef.current);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {/* TOP SLICE PANEL */}
        <motion.div
          initial={{ y: 0 }}
          animate={isExiting ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50vh',
            background: '#020408',
            borderBottom: '2px solid var(--cyan)',
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)',
            zIndex: 2,
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}
        >
          {/* Top Half Cyber Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            height: '100vh'
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)'
          }} />
        </motion.div>

        {/* BOTTOM SLICE PANEL */}
        <motion.div
          initial={{ y: 0 }}
          animate={isExiting ? { y: '100%' } : { y: 0 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50vh',
            background: '#020408',
            borderTop: '2px solid var(--magenta)',
            boxShadow: '0 0 15px rgba(255, 0, 255, 0.3)',
            zIndex: 2,
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}
        >
          {/* Bottom Half Cyber Grid */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            height: '100vh',
            marginTop: '-50vh'
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--magenta), transparent)'
          }} />
        </motion.div>

        {/* HUD LOADING CONTENTS */}
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={isExiting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            overflow: 'hidden',
            pointerEvents: 'auto'
          }}
        >
          {/* Scanline Sweep animation overlay */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)',
              animation: 'scanline 2s linear infinite',
            }} />
          </div>

          {/* Name Glitch Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#e6edf3',
              letterSpacing: '0.3em',
              marginBottom: '2rem',
              position: 'relative',
              zIndex: 4,
              animation: progress > 50 ? 'glitch 2s infinite' : 'none',
              textShadow: progress > 50 ? '2px 0 var(--magenta), -2px 0 var(--cyan)' : 'none'
            }}
          >
            {displayText}
            <span style={{
              display: 'inline-block',
              width: '3px',
              height: '1em',
              backgroundColor: 'var(--cyan)',
              marginLeft: '4px',
              animation: 'blink 0.8s infinite',
              verticalAlign: 'middle',
            }} />
          </motion.h1>

          {/* Stretched HUD progress bar */}
          <div style={{
            width: 'min(320px, 80vw)',
            height: '4px',
            background: 'rgba(0,255,255,0.08)',
            border: '1px solid rgba(0, 255, 255, 0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 4,
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
                boxShadow: '0 0 15px rgba(0,255,255,0.6), 0 0 25px rgba(255,0,255,0.4)',
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Scrambling progress state texts */}
          <motion.p
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              color: 'var(--cyan)',
              marginTop: '1.25rem',
              letterSpacing: '0.25em',
              position: 'relative',
              zIndex: 4,
              textShadow: progress > 80 ? '2px 0 var(--magenta), -2px 0 var(--cyan)' : 'none',
              textTransform: 'uppercase',
            }}
          >
            {glitchText} [ {progress}% ]
          </motion.p>

          {/* Technical corners */}
          {[{ top: '30px', left: '30px', borderTop: '2px solid rgba(0,255,255,0.25)', borderLeft: '2px solid rgba(0,255,255,0.25)' },
            { top: '30px', right: '30px', borderTop: '2px solid rgba(0,255,255,0.25)', borderRight: '2px solid rgba(0,255,255,0.25)' },
            { bottom: '30px', left: '30px', borderBottom: '2px solid rgba(0,255,255,0.25)', borderLeft: '2px solid rgba(0,255,255,0.25)' },
            { bottom: '30px', right: '30px', borderBottom: '2px solid rgba(0,255,255,0.25)', borderRight: '2px solid rgba(0,255,255,0.25)' }
          ].map((style, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: '25px',
              height: '25px',
              ...style,
              pointerEvents: 'none'
            }} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes glitch {
          0% { text-shadow: 2px 0 var(--magenta), -2px 0 var(--cyan); }
          20% { text-shadow: -2px 2px var(--magenta), 2px -2px var(--cyan); }
          40% { text-shadow: 2px -2px var(--magenta), -2px 2px var(--cyan); }
          60% { text-shadow: -1px 2px var(--magenta), 1px -2px var(--cyan); }
          80% { text-shadow: 2px 1px var(--magenta), -2px -1px var(--cyan); }
          100% { text-shadow: 2px 0 var(--magenta), -2px 0 var(--cyan); }
        }
      `}</style>
    </AnimatePresence>
  );
}

