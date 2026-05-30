import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import ParticleField from '../three/ParticleField';
import { useMagnetic } from '../hooks/useMagnetic';

const roles = [
  'Full Stack Developer',
  'React Developer',
  'BCA Student',
  'Problem Solver',
];

export default function Hero() {
  const nameRef = useRef(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [roleText, setRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const letterRefs = useRef([]);
  const btnProjectsRef = useMagnetic(0.3);
  const btnContactRef = useMagnetic(0.3);

  // GSAP letter-by-letter entrance
  useEffect(() => {
    if (letterRefs.current.length > 0) {
      gsap.fromTo(
        letterRefs.current.filter(Boolean),
        { opacity: 0, y: 50, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );
    }
  }, []);

  // Magnetic cursor effect for letters
  useEffect(() => {
    const handleMouseMove = (e) => {
      letterRefs.current.forEach((letter) => {
        if (!letter) return;
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 8;
          gsap.to(letter, {
            x: (dx / distance) * force,
            y: (dy / distance) * force,
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          gsap.to(letter, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect for roles
  useEffect(() => {
    const role = roles[currentRole];
    let timeout;

    if (!isDeleting) {
      if (roleText.length < role.length) {
        timeout = setTimeout(() => {
          setRoleText(role.slice(0, roleText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (roleText.length > 0) {
        timeout = setTimeout(() => {
          setRoleText(role.slice(0, roleText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [roleText, isDeleting, currentRole]);

  const nameChars = 'SANISH BHANDARI'.split('');

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <ParticleField />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-primary) 70%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: '0 1rem',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            background: 'rgba(0, 255, 153, 0.05)',
            border: '1px solid rgba(0, 255, 153, 0.25)',
            marginBottom: '1.5rem',
            boxShadow: '0 0 15px rgba(0, 255, 153, 0.05)',
          }}
        >
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--neon-green)',
            animation: 'hero-pulse-dot 1.5s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            color: 'var(--neon-green)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}>
            AVAILABLE FOR HIRE
          </span>
        </motion.div>

        <h1
          ref={nameRef}
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(2rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0',
          }}
          className="glitch-text"
        >
          {nameChars.map((char, i) => (
            <span
              key={i}
              ref={(el) => (letterRefs.current[i] = el)}
              style={{
                display: 'inline-block',
                color: 'var(--text-primary)',
                willChange: 'transform',
                padding: char === ' ' ? '0 0.3em' : '0 0.02em',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 'clamp(0.9rem, 2.5vw, 1.3rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            minHeight: '2em',
          }}
        >
          <span style={{ color: 'var(--magenta)' }}>{'> '}</span>
          {roleText}
          <span style={{
            display: 'inline-block',
            width: '2px',
            height: '1.2em',
            backgroundColor: 'var(--cyan)',
            marginLeft: '3px',
            verticalAlign: 'middle',
            animation: 'blink 0.8s infinite',
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* View My Work: Solid Neon Cyan Button */}
          <a
            ref={btnProjectsRef}
            href="#projects"
            onClick={(e) => handleNavClick(e, '#projects')}
            data-cursor="link"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--bg-primary)',
              background: 'var(--cyan)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 255, 255, 0.6)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>View My Work</span>
          </a>

          {/* Download CV: Ghost Outline Magenta Button */}
          <a
            ref={btnContactRef}
            href="/resume.docx"
            download="Sanish_Bhandari_Resume.docx"
            data-cursor="link"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.875rem',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--magenta)',
              background: 'transparent',
              border: '1px solid var(--magenta)',
              borderRadius: '4px',
              cursor: 'none',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 0, 255, 0.05)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.25)';
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>Download CV</span>
          </a>
        </motion.div>

        {/* Mouse scroll indicator with animated bouncing arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            zIndex: 2,
          }}
        >
          {/* Mouse Outline */}
          <div style={{
            width: '22px',
            height: '36px',
            borderRadius: '11px',
            border: '2px solid rgba(0, 255, 255, 0.35)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(0, 255, 255, 0.1)',
          }}>
            {/* Scrolling Wheel Dot */}
            <motion.div
              animate={{
                y: [2, 14, 2],
                opacity: [1, 0.1, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: '4px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: 'var(--cyan)',
                position: 'absolute',
                top: '5px',
                boxShadow: '0 0 6px var(--cyan)',
              }}
            />
          </div>
          
          {/* Animated Bouncing Arrow */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              color: 'var(--cyan)',
              fontSize: '0.95rem',
              display: 'flex',
              justifyContent: 'center',
              textShadow: '0 0 8px var(--cyan)',
              fontWeight: 'bold',
            }}
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes hero-pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(0, 255, 153, 0.7); }
          50% { transform: scale(1.25); opacity: 0.5; box-shadow: 0 0 0 8px rgba(0, 255, 153, 0); }
        }
      `}</style>
    </section>
  );
}
