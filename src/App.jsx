import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollDots from './components/ScrollDots';
import TerminalEgg from './components/TerminalEgg';
import AchievementToasts, { triggerAchievement } from './components/AchievementToasts';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useTheme } from './hooks/useTheme';
import { useVisitor } from './hooks/useVisitor';
import { useKonamiCode } from './hooks/useKonamiCode';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { visitorCount, isLoading: visitorLoading } = useVisitor();
  const isKonamiActive = useKonamiCode();
  const [themeRipple, setThemeRipple] = useState(null);

  // Initialize smooth scrolling
  useSmoothScroll();

  // Premium viewport circular ripple theme toggling
  const handleToggleTheme = (e) => {
    // Play futuristic beep chirp
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (err) {}

    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    
    setThemeRipple({ x, y, fromTheme: theme });
    
    // Flip active theme class when the ripple overlay completely covers the screen
    setTimeout(() => {
      toggleTheme();
    }, 300);

    setTimeout(() => {
      setThemeRipple(null);
    }, 700);
  };

  return (
    <>
      {/* Custom Cursor */}
      <Cursor />

      {/* Vertical Scroll spy dots */}
      <ScrollDots />

      {/* Cyber terminal easter egg */}
      <TerminalEgg />

      {/* Achievement toaster queue */}
      <AchievementToasts />

      {/* Dynamic clip-path expanding theme transition ripple */}
      <AnimatePresence>
        {themeRipple && (
          <motion.div
            initial={{ 
              clipPath: `circle(0px at ${themeRipple.x}px ${themeRipple.y}px)`
            }}
            animate={{ 
              clipPath: `circle(${Math.max(window.innerWidth, window.innerHeight) * 1.5}px at ${themeRipple.x}px ${themeRipple.y}px)`
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: themeRipple.fromTheme === 'dark' ? '#f0f4f8' : '#020408',
              zIndex: 99998,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Preloader */}
      <AnimatePresence mode="wait">
        {!isLoaded && (
          <Loader 
            onComplete={() => { 
              setIsLoaded(true); 
              // Instantly award PAGE_LOAD achievement
              setTimeout(() => triggerAchievement('PAGE_LOAD'), 600);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Main Website Structure */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}
        >
          {/* Cyberpunk Grid Overlay */}
          <div className="grid-overlay" />

          {/* Navigation Bar */}
          <Navbar theme={theme} toggleTheme={handleToggleTheme} />

          {/* Section Container */}
          <main style={{ position: 'relative', zIndex: 1 }}>
            {/* Hero Section */}
            <Hero />

            {/* About Section */}
            <About />

            {/* Skills Section */}
            <Skills />

            {/* Projects Section */}
            <Projects />

            {/* Contact Section */}
            <Contact />
          </main>

          {/* Footer with Visitor Counter */}
          <Footer visitorCount={visitorCount} isLoading={visitorLoading} />

          {/* Konami Code Easter Egg Visual */}
          <AnimatePresence>
            {isKonamiActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(2, 4, 8, 0.95)',
                  zIndex: 99999,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle, transparent 20%, #020408 80%)',
                  zIndex: 1,
                }} />
                
                <motion.h1
                  animate={{
                    scale: [1, 1.1, 0.9, 1.05, 1],
                    skewX: [0, 10, -10, 5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="glitch-text-intense"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: 'clamp(2rem, 8vw, 5rem)',
                    fontWeight: 900,
                    color: 'var(--neon-green)',
                    letterSpacing: '5px',
                    textShadow: '0 0 20px var(--neon-green)',
                    zIndex: 2,
                    textAlign: 'center',
                  }}
                >
                  GOD MODE ENGAGED
                </motion.h1>
                <motion.p
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '1rem',
                    color: 'var(--cyan)',
                    marginTop: '1.5rem',
                    letterSpacing: '3px',
                    zIndex: 2,
                  }}
                >
                  &gt;&gt; OVERRIDDEN SYSTEM FIRMWARE... ALL STACKS ONLINE
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

