import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { projects } from '../data/projects';
import { getLikes, incrementLike } from '../lib/supabase';

// High quality beep for UI interaction
const playBeep = (freq = 900, duration = 0.05) => {
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

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [foilPosition, setFoilPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    getLikes(project.slug).then(setLikes);
    const wasLiked = localStorage.getItem(`liked-${project.slug}`);
    if (wasLiked) setLiked(true);
  }, [project.slug]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liked) return;
    setLiked(true);
    setLikes(prev => prev + 1);
    localStorage.setItem(`liked-${project.slug}`, 'true');
    playBeep(1100, 0.15);
    try {
      const newCount = await incrementLike(project.slug);
      setLikes(newCount);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Capped 3D tilt at exactly ±8 degrees
    const rotateX = Math.max(-8, Math.min(8, (centerY - y) / 8));
    const rotateY = Math.max(-8, Math.min(8, (x - centerX) / 8));

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Dynamic X/Y coordinates for holographic rainbow alignment
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    setFoilPosition({ x: pctX, y: pctY });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setIsHovered(false);
  };

  const statusColors = {
    'Completed': 'var(--neon-green)',
    'In Progress': 'var(--cyan)',
    'Planned': 'var(--magenta)',
  };

  const isComingSoon = project.status === 'Planned';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => { setIsHovered(true); playBeep(700, 0.05); }}
        onMouseLeave={handleMouseLeave}
        className="project-card"
        data-cursor="image"
        style={{
          background: 'var(--bg-card)',
          border: project.featured 
            ? `1px solid ${isHovered ? 'var(--cyan)' : 'var(--magenta)'}`
            : `1px solid ${isHovered ? 'var(--cyan)' : 'var(--border-color)'}`,
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.1s ease-out',
          boxShadow: isHovered 
            ? `0 0 30px ${project.featured ? 'rgba(255,0,255,0.15)' : 'rgba(0,255,255,0.15)'}, 0 20px 40px rgba(0,0,0,0.4)` 
            : '0 4px 20px rgba(0,0,0,0.2)',
          willChange: 'transform',
        }}
      >
        {/* Holographic foil rainbow grid overlay */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${foilPosition.x}% ${foilPosition.y}%, rgba(255, 0, 128, 0.15) 0%, rgba(0, 255, 255, 0.15) 30%, rgba(0, 255, 153, 0.15) 60%, transparent 90%)`,
            mixBlendMode: 'color-dodge',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        )}

        {/* Diagonal striped coming soon cover banner */}
        {isComingSoon && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '-35px',
            background: 'linear-gradient(45deg, var(--magenta), #bf00bf)',
            color: '#fff',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem',
            fontWeight: 'bold',
            padding: '4px 35px',
            transform: 'rotate(-45deg)',
            boxShadow: '0 2px 10px rgba(255, 0, 255, 0.3)',
            letterSpacing: '1px',
            zIndex: 5,
            textTransform: 'uppercase',
          }}>
            COMING SOON
          </div>
        )}

        {/* FEATURED badge overlay */}
        {project.featured && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'var(--magenta)',
            color: '#fff',
            boxShadow: '0 0 10px rgba(255, 0, 255, 0.4)',
            letterSpacing: '1px',
            zIndex: 5,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#fff',
              display: 'inline-block',
              animation: 'pulse-glow 1s infinite'
            }} />
            FEATURED
          </div>
        )}

        <div style={{
          width: '100%',
          height: '180px',
          background: `linear-gradient(135deg, ${statusColors[project.status]}12, var(--bg-secondary))`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: project.featured ? 'rgba(255,0,255,0.08)' : 'rgba(0,255,255,0.08)',
            letterSpacing: '4px',
          }}>
            {project.title.split(' ').map(w => w[0]).join('')}
          </span>

          {isHovered && (
            <div style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
                animation: 'scanline-fast 1.5s linear infinite',
              }} />
            </div>
          )}

          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem',
            padding: '0.25rem 0.6rem',
            borderRadius: '3px',
            background: `${statusColors[project.status]}15`,
            color: statusColors[project.status],
            border: `1px solid ${statusColors[project.status]}40`,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {project.status}
          </span>
        </div>

        <div style={{ padding: '1.5rem', position: 'relative', zIndex: 3 }}>
          <h3 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}>
            {project.title}
          </h3>

          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {project.description}
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '1.25rem',
          }}>
            {project.techStack.map(tech => (
              <span
                key={tech}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: 'rgba(0,255,255,0.05)',
                  color: 'var(--cyan)',
                  border: '1px solid rgba(0,255,255,0.15)',
                  letterSpacing: '1px',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1rem',
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  data-cursor="link"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <FaGithub />
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  data-cursor="link"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-green)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <FaExternalLinkAlt />
                </motion.a>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              data-cursor="link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                cursor: 'none',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.8rem',
                color: liked ? 'var(--magenta)' : 'var(--text-muted)',
                transition: 'color 0.3s',
              }}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span>{likes}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline-fast { 0% { top: -2px; } 100% { top: 100%; } }
      `}</style>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const allTechs = ['All', ...new Set(projects.flatMap(p => p.techStack))];
  const filtered = filter === 'All' ? projects : projects.filter(p => p.techStack.includes(filter));

  return (
    <section id="projects" className="section">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-subtitle">// WHAT I'VE LAUNCHED</p>
        <h2 className="section-title glitch-text">
          My <span style={{ color: 'var(--cyan)' }}>Projects</span>
        </h2>
        <div style={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
          marginBottom: '2rem',
          borderRadius: '2px',
        }} />
      </motion.div>

      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '3rem',
        flexWrap: 'wrap',
      }}>
        {allTechs.map(tech => (
          <motion.button
            key={tech}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setFilter(tech); playBeep(800, 0.04); }}
            data-cursor="link"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.75rem',
              padding: '0.4rem 0.8rem',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              background: filter === tech ? 'rgba(0,255,255,0.1)' : 'transparent',
              color: filter === tech ? 'var(--cyan)' : 'var(--text-muted)',
              border: `1px solid ${filter === tech ? 'var(--cyan)' : 'var(--border-color)'}`,
              borderRadius: '4px',
              cursor: 'none',
              transition: 'all 0.3s',
            }}
          >
            {tech}
          </motion.button>
        ))}
      </div>

      <motion.div
        layout
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

