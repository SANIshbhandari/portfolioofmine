import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaReact, FaNodeJs, FaPython } from 'react-icons/fa';
import { timeline } from '../data/timeline';
import profileImg from '../assets/sanish.jpg';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 6, label: 'Projects', suffix: '+' },
  { value: 15, label: 'Technologies', suffix: '+' },
  { value: 5, label: 'Semesters', suffix: 'th' },
];

function AnimatedCounter({ value, suffix, inView }) {
  const countRef = useRef(null);

  useEffect(() => {
    if (!inView || !countRef.current) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * value);
      if (countRef.current) countRef.current.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, suffix]);

  return <span ref={countRef}>0{suffix}</span>;
}

const CircuitBoard = () => (
  <svg
    style={{
      position: 'absolute',
      inset: '-30px',
      width: 'calc(100% + 60px)',
      height: 'calc(100% + 60px)',
      opacity: 0.22,
      pointerEvents: 'none',
      zIndex: 0,
      filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))',
    }}
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <path
      d="M 10 10 L 35 10 L 45 20 L 45 60 M 45 35 L 70 35 L 80 45 L 80 85 M 80 65 L 95 65"
      fill="none"
      stroke="var(--cyan)"
      strokeWidth="0.5"
      strokeDasharray="100"
      strokeDashoffset="0"
      style={{ animation: 'about-circuit-draw 8s linear infinite' }}
    />
    <circle cx="10" cy="10" r="1" fill="var(--cyan)" />
    <circle cx="45" cy="60" r="1" fill="var(--cyan)" />
    <circle cx="80" cy="85" r="1" fill="var(--cyan)" />
    <circle cx="95" cy="65" r="1" fill="var(--cyan)" />
    
    <path
      d="M 90 90 L 65 90 L 55 80 L 55 40 M 55 65 L 30 65 L 20 55 L 20 15 M 20 35 L 5 35"
      fill="none"
      stroke="var(--magenta)"
      strokeWidth="0.5"
      strokeDasharray="100"
      strokeDashoffset="0"
      style={{ animation: 'about-circuit-draw 8s linear infinite reverse' }}
    />
    <circle cx="90" cy="90" r="1" fill="var(--magenta)" />
    <circle cx="55" cy="40" r="1" fill="var(--magenta)" />
    <circle cx="20" cy="15" r="1" fill="var(--magenta)" />
    <circle cx="5" cy="35" r="1" fill="var(--magenta)" />
  </svg>
);

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const timelineRef = useRef(null);

  // Word-by-word scroll reveal for bio
  useEffect(() => {
    if (!textRef.current) return;

    const words = textRef.current.querySelectorAll('.about-word');
    gsap.fromTo(
      words,
      { opacity: 0.1, y: 5 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.02,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          end: 'bottom 65%',
          scrub: 0.5,
        },
      }
    );
  }, []);

  // Timeline height drawing on scroll
  useEffect(() => {
    if (!timelineRef.current) return;

    const line = timelineRef.current.querySelector('.timeline-line-fill');
    if (line) {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 1.2,
          },
        }
      );
    }
  }, []);

  const bioText = `I'm Sanish Bhandari, a passionate BCA student at Kalika Campus, Butwal, currently in my 5th semester. I'm from Palpa Rampur, Nepal, and I'm on a journey to become a full-stack developer. I love building modern web applications with clean code and stunning interfaces. When I'm not coding, I'm exploring new technologies and pushing my creative boundaries.`;

  return (
    <section id="about" className="section" ref={sectionRef} style={{ padding: '6rem 2rem', overflow: 'hidden' }}>
      <div className="about-split-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '4rem',
        alignItems: 'start',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* LEFT COLUMN: Sticky Layered Depth Photo */}
        <div style={{
          position: 'sticky',
          top: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }} className="about-photo-column">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '300px',
              aspectRatio: '4/5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Background Layer: Glowing Circuit Board Pattern */}
            <CircuitBoard />

            {/* Midground Layer: Photo with Neon Cyan Border Frame */}
            <div className="neon-border" style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              width: '100%',
              height: '100%',
              background: 'var(--bg-card)',
              zIndex: 1,
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.25)',
              border: '2px solid var(--cyan)',
            }}>
              <img
                src={profileImg}
                alt="Sanish Bhandari"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(20%) contrast(110%) brightness(95%)',
                  transition: 'all 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%) contrast(115%) brightness(105%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(20%) contrast(110%) brightness(95%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* Scanline overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(rgba(0, 255, 255, 0.06) 50%, transparent 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none',
              }} />
              
              {/* sweep lines */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}>
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
                  animation: 'about-scanline-sweep 3s linear infinite',
                }} />
              </div>
            </div>

            {/* Foreground Layer: Slowly Orbiting Tech Skill Icons */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '-25px',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              {/* React Icon */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  top: '-15px',
                  left: 'calc(50% - 18px)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(2, 4, 8, 0.9)',
                  border: '1px solid var(--cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan)',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
                }}
              >
                <FaReact size={18} />
              </motion.div>

              {/* Node.js Icon */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '12%',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(2, 4, 8, 0.9)',
                  border: '1px solid var(--neon-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neon-green)',
                  boxShadow: '0 0 15px rgba(0, 255, 153, 0.5)',
                }}
              >
                <FaNodeJs size={18} />
              </motion.div>

              {/* Python Icon */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '12%',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(2, 4, 8, 0.9)',
                  border: '1px solid var(--magenta)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--magenta)',
                  boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
                }}
              >
                <FaPython size={18} />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Bio Text + Stats Grid + Scroll-Drawn Timeline */}
        <div style={{ fontFamily: 'var(--font-body)' }}>
          {/* Header Title */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-subtitle">// GET TO KNOW ME</p>
            <h2 className="section-title glitch-text" style={{ fontFamily: 'var(--font-display)' }}>
              About <span style={{ color: 'var(--cyan)' }}>Me</span>
            </h2>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
              marginBottom: '2rem',
              borderRadius: '2px',
            }} />
          </motion.div>

          {/* Word-by-Word Scroll Reveal Bio */}
          <p ref={textRef} style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            fontWeight: 500,
          }}>
            {bioText.split(' ').map((word, i) => (
              <span
                key={i}
                className="about-word"
                style={{ display: 'inline-block', marginRight: '0.3em', opacity: 0.1 }}
              >
                {word}
              </span>
            ))}
          </p>

          {/* Quick Location Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              padding: '0.8rem 1.2rem',
              borderLeft: '3px solid var(--cyan)',
              background: 'rgba(0,255,255,0.02)',
              marginBottom: '2.5rem',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}>
              📍 Location: Palpa Rampur, Nepal
            </p>
          </motion.div>

          {/* Mini-Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '3.5rem',
          }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass"
                style={{
                  padding: '1rem',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--cyan)',
                  marginBottom: '0.2rem',
                }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={isInView} />
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-subtitle">// MY JOURNEY</p>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'var(--text-primary)',
            }}>
              Education <span style={{ color: 'var(--magenta)' }}>Timeline</span>
            </h3>
          </motion.div>

          {/* Stretchy Drawn Timeline */}
          <div
            ref={timelineRef}
            style={{
              position: 'relative',
              paddingLeft: '2rem',
            }}
          >
            {/* The vertical timeline bar */}
            <div style={{
              position: 'absolute',
              left: '6px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'rgba(0, 255, 255, 0.1)',
            }}>
              <div
                className="timeline-line-fill"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, var(--cyan), var(--magenta))',
                  transformOrigin: 'top',
                  scaleY: 0,
                }}
              />
            </div>

            {/* Timeline nodes */}
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                style={{
                  position: 'relative',
                  paddingLeft: '1.5rem',
                  paddingBottom: i === timeline.length - 1 ? 0 : '2.5rem',
                }}
              >
                {/* Glowing Node Dot */}
                <div style={{
                  position: 'absolute',
                  left: '-14px',
                  top: '6px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--cyan)',
                  boxShadow: '0 0 8px var(--cyan)',
                  zIndex: 1,
                }} />

                <div className="glass" style={{
                  padding: '1.2rem',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--cyan)',
                  background: 'rgba(2, 4, 8, 0.6)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.4rem',
                  }}>
                    <h4 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {item.title}
                    </h4>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--cyan)',
                      border: '1px solid rgba(0, 255, 255, 0.25)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '3px',
                    }}>
                      {item.year}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--magenta)',
                    fontWeight: 600,
                    marginBottom: '0.4rem',
                  }}>
                    {item.institution}
                  </p>

                  <p style={{
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: 'var(--text-secondary)',
                  }}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes about-scanline-sweep {
          0% { top: -2%; }
          100% { top: 102%; }
        }
        @keyframes about-circuit-draw {
          to { stroke-dashoffset: 200; }
        }
        
        /* Mobile adjustment for split layout */
        @media (max-width: 992px) {
          .about-split-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .about-photo-column {
            position: relative !important;
            top: 0 !important;
            min-height: 350px !important;
          }
        }
      `}</style>
    </section>
  );
}
