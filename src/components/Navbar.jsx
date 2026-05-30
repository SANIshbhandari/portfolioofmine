import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import MusicToggle from './MusicToggle';

const navLinks = [
  { label: 'Home', href: '#home', icon: FaHome },
  { label: 'About', href: '#about', icon: FaUser },
  { label: 'Skills', href: '#skills', icon: FaCode },
  { label: 'Projects', href: '#projects', icon: FaBriefcase },
  { label: 'Contact', href: '#contact', icon: FaEnvelope },
];

const playBeep = (freq = 800, duration = 0.05) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
};

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      
      // Auto spy vertical scrolling targets
      const sections = navLinks.map(l => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 160) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    playBeep(900, 0.04);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* TOP NAVBAR (DESKTOP/MOBILE UNIVERSAL) */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '0 clamp(1rem, 4vw, 3rem)',
          height: scrolled ? '60px' : '75px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: scrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* LOGO TRANSITION MORPHING */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: scrolled ? '1.2rem' : '1.4rem',
            fontWeight: 900,
            color: scrolled ? 'var(--cyan)' : '#ffffff',
            textDecoration: 'none',
            textShadow: scrolled ? '0 0 10px rgba(0,255,255,0.4)' : 'none',
            letterSpacing: scrolled ? '2px' : '1px',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          data-cursor="link"
        >
          <span style={{
            background: scrolled ? 'transparent' : 'linear-gradient(90deg, var(--cyan), var(--magenta))',
            WebkitBackgroundClip: scrolled ? 'none' : 'text',
            WebkitTextFillColor: scrolled ? 'initial' : 'transparent',
            transition: 'all 0.4s',
          }}>
            {scrolled ? 'SANI_SH' : 'SB'}
          </span>
          {scrolled && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                fontSize: '0.6rem',
                fontFamily: "'Share Tech Mono', monospace",
                color: 'var(--neon-green)',
                background: 'rgba(0, 255, 153, 0.1)',
                border: '1px solid rgba(0, 255, 153, 0.3)',
                padding: '1px 5px',
                borderRadius: '3px',
                letterSpacing: '1px',
                fontWeight: 'bold',
              }}
            >
              LIVE
            </motion.span>
          )}
        </a>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2.5rem',
        }}>
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '1.8rem',
            margin: 0,
            padding: 0,
          }} className="nav-links-desktop">
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-cursor="link"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.8rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: activeSection === link.href.replace('#', '') ? 'var(--cyan)' : 'var(--text-secondary)',
                    transition: 'color 0.3s',
                    position: 'relative',
                    paddingBottom: '4px',
                  }}
                >
                  {link.label}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'var(--cyan)',
                        boxShadow: '0 0 8px var(--cyan)',
                        borderRadius: '1px',
                      }}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <MusicToggle />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </motion.nav>

      {/* MOBILE BOTTOM TABS DOCK DOCK */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '66px',
        background: 'rgba(2, 4, 8, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0, 255, 255, 0.15)',
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -5px 25px rgba(0,0,0,0.6)'
      }} className="mobile-bottom-tabs">
        {navLinks.map(link => {
          const LinkIcon = link.icon;
          const isActive = activeSection === link.href.replace('#', '');
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                width: '60px',
                height: '100%',
                position: 'relative'
              }}
            >
              <div style={{
                color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                fontSize: '1.2rem',
                marginBottom: '3px',
                filter: isActive ? 'drop-shadow(0 0 5px var(--cyan))' : 'none',
                transition: 'all 0.3s'
              }}>
                <LinkIcon />
              </div>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                transition: 'all 0.3s'
              }}>
                {link.label}
              </span>

              {/* Glowing active notch */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  width: '30px',
                  height: '2px',
                  background: 'var(--cyan)',
                  boxShadow: '0 0 10px var(--cyan), 0 0 20px var(--cyan)'
                }} />
              )}
            </a>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { 
            display: none !important; 
          }
          .mobile-bottom-tabs { 
            display: flex !important; 
          }
        }
      `}</style>
    </>
  );
}

