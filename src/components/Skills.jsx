import { useRef, useEffect, useState, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategories } from '../data/skills';
import CanvasErrorBoundary from './CanvasErrorBoundary';
import SkillGlobe from '../three/SkillGlobe';

// Import icons for Hex grid
import { 
  FaReact, FaJs, FaHtml5, FaCss3Alt, FaNodeJs, FaPython, 
  FaGitAlt, FaGithub, FaFigma, FaNpm, FaDocker, FaAws, FaMobileAlt, FaCode, FaCube
} from 'react-icons/fa';
import { 
  SiTailwindcss, SiSupabase, SiVercel, SiVite, 
  SiTypescript, SiGraphql, SiNextdotjs, SiFramer
} from 'react-icons/si';
import { DiPostgresql, DiMongodb, DiVisualstudio } from 'react-icons/di';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  'React': FaReact,
  'JavaScript': FaJs,
  'HTML/CSS': FaHtml5,
  'Tailwind CSS': SiTailwindcss,
  'Three.js': FaCube,
  'Framer Motion': SiFramer,
  'Node.js': FaNodeJs,
  'Express.js': FaCode,
  'Python': FaPython,
  'PostgreSQL': DiPostgresql,
  'Supabase': SiSupabase,
  'MongoDB': DiMongodb,
  'Git & GitHub': FaGitAlt,
  'VS Code': DiVisualstudio,
  'Figma': FaFigma,
  'Vercel': SiVercel,
  'npm': FaNpm,
  'Vite': SiVite,
  'TypeScript': SiTypescript,
  'Next.js': SiNextdotjs,
  'Docker': FaDocker,
  'AWS': FaAws,
  'GraphQL': SiGraphql,
  'React Native': FaMobileAlt,
};

const groupColors = {
  'Frontend': { primary: '#00FFFF', glow: 'rgba(0, 255, 255, 0.4)', text: 'var(--cyan)' },
  'Backend': { primary: '#FF00FF', glow: 'rgba(255, 0, 255, 0.4)', text: 'var(--magenta)' },
  'Tools': { primary: '#00FF99', glow: 'rgba(0, 255, 153, 0.4)', text: 'var(--neon-green)' },
  'Learning': { primary: '#FFB300', glow: 'rgba(255, 179, 0, 0.4)', text: '#FFB300' }
};

// Custom sound synthesizer for retro cyberpunk hums
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
  } catch (e) {
    // Graceful catch for user activation block
  }
};

function PCBTraceBar({ name, level, delay, inView, colorGroup }) {
  const barRef = useRef(null);
  const countRef = useRef(null);
  const info = groupColors[colorGroup] || groupColors['Frontend'];

  useEffect(() => {
    if (!inView || !barRef.current) return;

    gsap.fromTo(
      barRef.current,
      { width: '0%' },
      {
        width: `${level}%`,
        duration: 1.8,
        delay: delay,
        ease: 'power3.out',
      }
    );

    const duration = 1800;
    const startTime = Date.now() + delay * 1000;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) { requestAnimationFrame(animate); return; }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      if (countRef.current) countRef.current.textContent = Math.floor(eased * level) + '%';
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, level, delay]);

  return (
    <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.4rem',
      }}>
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: info.primary,
            display: 'inline-block',
            boxShadow: `0 0 8px ${info.primary}`
          }} />
          {name}
        </span>
        <span
          ref={countRef}
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.85rem',
            color: info.primary,
            fontWeight: 'bold',
            textShadow: `0 0 5px ${info.glow}`
          }}
        >
          0%
        </span>
      </div>
      
      {/* PCB Trace Design Grid background */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '4px',
        position: 'relative',
        overflow: 'visible',
      }}>
        {/* Glow progress path */}
        <div
          ref={barRef}
          style={{
            width: '0%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${info.primary})`,
            borderRadius: '4px',
            position: 'absolute',
            left: 0,
            top: 0,
            boxShadow: `0 0 10px ${info.glow}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {/* LED dot indicator at the end */}
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ffffff',
            border: `2px solid ${info.primary}`,
            boxShadow: `0 0 12px #fff, 0 0 20px ${info.primary}`,
            marginRight: '-5px',
            zIndex: 3,
            flexShrink: 0,
            animation: 'pulse-glow 1.5s infinite ease-in-out'
          }} />

          {/* Electric flow scan element */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            animation: 'scanline 2s infinite linear'
          }} />
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState(0);
  const [showGlobe, setShowGlobe] = useState(false);
  const [variant, setVariant] = useState('hex'); // 'hex' or 'trace'

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setShowGlobe(mq.matches);
    const handler = (e) => setShowGlobe(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const triggerBeep = (freq) => {
    playBeep(freq, 'triangle', 0.05);
  };

  // Flatten all skills for the Hexagonal Grid view
  const allSkills = skillCategories.flatMap(category => 
    category.skills.map(skill => ({
      ...skill,
      categoryName: category.name
    }))
  );

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', opacity: 0.15 }}>
        <svg width="400" height="400" viewBox="0 0 100 100">
          <path d="M10,20 L30,20 L40,40 L20,40 Z" fill="none" stroke="var(--cyan)" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="1" fill="var(--cyan)" />
          <path d="M50,10 L70,30 L60,60" fill="none" stroke="var(--magenta)" strokeWidth="0.3" />
        </svg>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '2rem',
        width: '100%'
      }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-subtitle">// Stacks & Stems</p>
          <h2 className="section-title glitch-text">
            Tech <span style={{ color: 'var(--cyan)' }}>Arsenal</span>
          </h2>
          <div style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
            borderRadius: '2px',
          }} />
        </motion.div>

        {/* VARIANT SLIDER CONTROL (HUD STYLE) */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          padding: '4px',
          borderRadius: '20px',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.05)',
          gap: '4px'
        }}>
          <button
            onClick={() => { setVariant('hex'); triggerBeep(600); }}
            style={{
              padding: '6px 16px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              color: variant === 'hex' ? '#020408' : 'var(--text-secondary)',
              background: variant === 'hex' ? 'var(--cyan)' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: variant === 'hex' ? '0 0 12px var(--cyan)' : 'none',
              fontWeight: 'bold'
            }}
          >
            HEX GRID
          </button>
          <button
            onClick={() => { setVariant('trace'); triggerBeep(850); }}
            style={{
              padding: '6px 16px',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              color: variant === 'trace' ? '#020408' : 'var(--text-secondary)',
              background: variant === 'trace' ? 'var(--cyan)' : 'transparent',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: variant === 'trace' ? '0 0 12px var(--cyan)' : 'none',
              fontWeight: 'bold'
            }}
          >
            CIRCUIT TRACES
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: showGlobe ? '1fr 1.1fr' : '1fr',
        gap: '4rem',
        alignItems: 'center',
      }}>
        {showGlobe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              border: '1px solid rgba(0, 255, 255, 0.05)',
              borderRadius: '50%',
              pointerEvents: 'none',
              animation: 'spin 120s linear infinite'
            }} />
            <CanvasErrorBoundary>
              <Suspense fallback={
                <div style={{
                  width: '100%',
                  height: '450px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Share Tech Mono', monospace",
                  color: 'var(--text-muted)',
                }}>
                  INITIALIZING HOLOGRAPHIC SCENERY...
                </div>
              }>
                <SkillGlobe />
              </Suspense>
            </CanvasErrorBoundary>
          </motion.div>
        )}

        <div>
          <AnimatePresence mode="wait">
            {variant === 'hex' ? (
              // VARIANT A: Honeycomb Hex Grid
              <motion.div
                key="hex-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  padding: '1rem',
                  background: 'rgba(2, 4, 8, 0.4)',
                  border: '1px solid rgba(0, 255, 255, 0.08)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  maxHeight: '520px',
                  overflowY: 'auto'
                }}
              >
                {allSkills.map((skill, i) => {
                  const Icon = iconMap[skill.name] || FaCode;
                  const info = groupColors[skill.categoryName] || groupColors['Frontend'];
                  
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.02, type: 'spring', stiffness: 260, damping: 20 }}
                      whileHover={{ scale: 1.12, zIndex: 10 }}
                      onMouseEnter={() => triggerBeep(400 + skill.level * 4)}
                      style={{
                        position: 'relative',
                        width: '95px',
                        height: '110px',
                        cursor: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '2px',
                      }}
                    >
                      {/* Hexagon Container using CSS polygon clip */}
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                        background: `linear-gradient(135deg, ${info.primary} 0%, rgba(2, 4, 8, 0.8) 70%)`,
                        padding: '1.5px', // Border emulation
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '100%',
                          height: '100%',
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                          background: 'rgba(10, 14, 23, 0.95)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '10px',
                          color: '#fff',
                        }}
                        className="hex-inner"
                        >
                          <motion.div
                            whileHover={{ scale: 1.25 }}
                            transition={{ duration: 0.2 }}
                            style={{ color: info.primary, marginBottom: '6px', fontSize: '1.5rem', filter: `drop-shadow(0 0 5px ${info.glow})` }}
                          >
                            <Icon />
                          </motion.div>
                          <span style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '0.65rem',
                            letterSpacing: '0.5px',
                            color: 'var(--text-primary)',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            maxWidth: '75px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {skill.name}
                          </span>
                          <span style={{
                            fontFamily: "'Share Tech Mono', monospace",
                            fontSize: '0.55rem',
                            color: info.primary,
                            marginTop: '2px',
                            fontWeight: 'bold'
                          }}>
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // VARIANT B: Circuit PCB Progress Bars
              <motion.div
                key="trace-bars"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  flexWrap: 'wrap',
                }}>
                  {skillCategories.map((cat, i) => {
                    const info = groupColors[cat.name] || groupColors['Frontend'];
                    return (
                      <motion.button
                        key={cat.name}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => { setActiveCategory(i); triggerBeep(550 + i * 80); }}
                        data-cursor="link"
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          fontSize: '0.75rem',
                          padding: '0.5rem 1rem',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          background: activeCategory === i ? `${info.primary}18` : 'transparent',
                          color: activeCategory === i ? info.primary : 'var(--text-muted)',
                          border: `1px solid ${activeCategory === i ? info.primary : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '4px',
                          cursor: 'none',
                          transition: 'all 0.3s',
                          boxShadow: activeCategory === i ? `0 0 10px ${info.glow}` : 'none'
                        }}
                      >
                        {cat.name}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {skillCategories[activeCategory].skills.map((skill, i) => (
                    <PCBTraceBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={i * 0.08}
                      inView={isInView}
                      colorGroup={skillCategories[activeCategory].name}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

