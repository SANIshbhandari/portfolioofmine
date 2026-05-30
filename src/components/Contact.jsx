import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPaperPlane, FaUser } from 'react-icons/fa';
import { submitMessage } from '../lib/supabase';

// Sound effect synthesizer for Contact interactions
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

// Canvas-based particle explosion component for successful transmission
function SuccessParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    const particles = [];
    const colors = ['#00FFFF', '#FF00FF', '#00FF99', '#ffffff'];
    
    // Generate 120 high energy neon particles
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.38, // near the checkmark
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // slight upward bias
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: Math.random() * 0.012 + 0.006
      });
    }
    
    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let alive = false;
      particles.forEach(p => {
        if (p.alpha > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // slight gravity
          p.vx *= 0.98; // air resistance
          p.alpha -= p.decay;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
      });
      
      if (alive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);
  const formRef = useRef(null);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    playBeep(450, 'sawtooth', 0.1);

    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('ALL DATA FIELDS MUST BE POPULATED.');
      triggerShake();
      playBeep(150, 'sawtooth', 0.35);
      return;
    }

    if (!validateEmail(email)) {
      setStatus('error');
      setErrorMessage('INVALID ENCRYPTION TYPE (EMAIL FORMAT INVALID).');
      triggerShake();
      playBeep(150, 'sawtooth', 0.35);
      return;
    }

    try {
      const res = await submitMessage({ name, email, message });
      if (res.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        playBeep(880, 'sine', 0.2);
        setTimeout(() => playBeep(1320, 'sine', 0.25), 150);
      } else {
        throw new Error('Signal lost during transmission');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage('TRANSMISSION FAILURE. DATABASE CONNECTION REFUSED.');
      triggerShake();
      playBeep(150, 'sawtooth', 0.35);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="section" style={{ minHeight: '90vh', padding: '6rem 2rem', position: 'relative' }}>
      
      {/* 1. HUD Vertical Edge Accent Line with Rotated Title */}
      <div style={{
        position: 'absolute',
        left: '30px',
        top: '100px',
        bottom: '100px',
        width: '1px',
        background: 'linear-gradient(180deg, transparent, var(--magenta) 30%, var(--cyan) 70%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0.8
      }} className="hidden lg:flex">
        <div style={{
          transform: 'rotate(-90deg)',
          fontFamily: "'Share Tech Mono', monospace",
          color: 'var(--magenta)',
          fontSize: '0.75rem',
          letterSpacing: '5px',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          background: 'var(--bg-primary)',
          padding: '0 20px',
          textShadow: '0 0 8px rgba(255, 0, 255, 0.4)',
        }}>
          SYS_LINK: CONNECTION_ESTABLISHMENT_PROTOCOL
        </div>
      </div>

      {/* 2. Secondary rotated decorative badge */}
      <div style={{
        position: 'absolute',
        right: '30px',
        top: '150px',
        bottom: '150px',
        width: '1px',
        background: 'linear-gradient(180deg, transparent, var(--cyan) 50%, transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: 0.6
      }} className="hidden xl:flex">
        <div style={{
          transform: 'rotate(90deg)',
          fontFamily: "'Share Tech Mono', monospace",
          color: 'var(--cyan)',
          fontSize: '0.65rem',
          letterSpacing: '4px',
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          background: 'var(--bg-primary)',
          padding: '0 15px',
          textShadow: '0 0 8px rgba(0, 255, 255, 0.4)',
        }}>
          LATENCY_PORT: SECURE_COMMS_STABLE
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ paddingLeft: 'clamp(0rem, 3vw, 2rem)' }}
      >
        <p className="section-subtitle">// GET IN TOUCH</p>
        <h2 className="section-title glitch-text">
          Establish <span style={{ color: 'var(--cyan)' }}>Connection</span>
        </h2>
        <div style={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
          marginBottom: '3rem',
          borderRadius: '2px',
        }} />
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 5
      }}>
        {/* Terminal Info Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass neon-border"
          style={{
            padding: '2.2rem',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderLeft: '4px solid var(--magenta)',
            background: 'rgba(2, 4, 8, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderBottom: '1px solid rgba(255, 0, 255, 0.2)',
              paddingBottom: '1rem',
              marginBottom: '1.8rem',
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginLeft: '1rem',
              }}>COMMS_PORT_SECURE.EXE</span>
            </div>

            <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.9rem', lineHeight: 1.8 }}>
              <p style={{ color: 'var(--cyan)' }}>&gt; INITIALIZING COMMS LINK...</p>
              <p style={{ color: 'var(--text-secondary)' }}>&gt; IDENTIFIER: Sanish Bhandari</p>
              <p style={{ color: 'var(--text-secondary)' }}>&gt; ROLE: Aspiring Full Stack Developer</p>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                <FaMapMarkerAlt style={{ color: 'var(--magenta)' }} />
                <span>Palpa Rampur, Nepal</span>
              </p>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                <FaEnvelope style={{ color: 'var(--cyan)' }} />
                <a href="mailto:sanishbhandari237@gmail.com" data-cursor="link" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
                  sanishbhandari237@gmail.com
                </a>
              </p>
              <p style={{ color: 'var(--neon-green)', marginTop: '1rem' }}>&gt; READY TO RECEIVE TRANSMISSIONS.</p>
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <p style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '0.8rem',
              letterSpacing: '2px',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              textTransform: 'uppercase',
            }}>Connect via Cybernet</p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.a
                href="https://github.com/SANIshbhandari"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3, boxShadow: '0 0 15px var(--cyan)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playBeep(700, 'sine', 0.05)}
                data-cursor="link"
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(0, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cyan)',
                  fontSize: '1.25rem',
                  transition: 'border 0.3s, color 0.3s',
                }}
              >
                <FaGithub />
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/sanish-bhandari-b0a828296/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -3, boxShadow: '0 0 15px var(--magenta)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => playBeep(700, 'sine', 0.05)}
                data-cursor="link"
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(255, 0, 255, 0.05)',
                  border: '1px solid rgba(255, 0, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--magenta)',
                  fontSize: '1.25rem',
                  transition: 'border 0.3s, color 0.3s',
                }}
              >
                <FaLinkedin />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          style={{ position: 'relative' }}
        >
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass"
            style={{
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'rgba(2, 4, 8, 0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '3px',
              background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
            }} />

            {/* Input Name */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                className="form-input"
                onFocus={(e) => { e.target.style.borderColor = 'var(--cyan)'; playBeep(650, 'sine', 0.03); }}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <span style={{
                position: 'absolute',
                left: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(0, 255, 255, 0.5)',
                pointerEvents: 'none',
              }}>
                <FaUser />
              </span>
              <label style={{
                position: 'absolute',
                left: '2.5rem',
                top: formData.name ? '-0.7rem' : '50%',
                transform: 'translateY(-50%) scale(1)',
                transformOrigin: 'left',
                color: formData.name ? 'var(--cyan)' : 'var(--text-muted)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: formData.name ? '0.75rem' : '0.85rem',
                letterSpacing: '1px',
                padding: '0 0.4rem',
                background: formData.name ? 'var(--bg-primary)' : 'transparent',
                transition: 'all 0.2s ease-out',
                pointerEvents: 'none',
              }}>
                USER_NAME
              </label>
            </div>

            {/* Input Email */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                className="form-input"
                onFocus={(e) => { e.target.style.borderColor = 'var(--cyan)'; playBeep(650, 'sine', 0.03); }}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <span style={{
                position: 'absolute',
                left: '0.8rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(0, 255, 255, 0.5)',
                pointerEvents: 'none',
              }}>
                <FaEnvelope />
              </span>
              <label style={{
                position: 'absolute',
                left: '2.5rem',
                top: formData.email ? '-0.7rem' : '50%',
                transform: 'translateY(-50%) scale(1)',
                transformOrigin: 'left',
                color: formData.email ? 'var(--cyan)' : 'var(--text-muted)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: formData.email ? '0.75rem' : '0.85rem',
                letterSpacing: '1px',
                padding: '0 0.4rem',
                background: formData.email ? 'var(--bg-primary)' : 'transparent',
                transition: 'all 0.2s ease-out',
                pointerEvents: 'none',
              }}>
                COMMS_ENVELOPE (EMAIL)
              </label>
            </div>

            {/* Input Message */}
            <div style={{ position: 'relative', marginBottom: '2rem' }}>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                  resize: 'none',
                }}
                className="form-input"
                onFocus={(e) => { e.target.style.borderColor = 'var(--magenta)'; playBeep(650, 'sine', 0.03); }}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <label style={{
                position: 'absolute',
                left: '1rem',
                top: formData.message ? '-0.7rem' : '1.5rem',
                transform: 'translateY(-50%) scale(1)',
                transformOrigin: 'left',
                color: formData.message ? 'var(--magenta)' : 'var(--text-muted)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: formData.message ? '0.75rem' : '0.85rem',
                letterSpacing: '1px',
                padding: '0 0.4rem',
                background: formData.message ? 'var(--bg-primary)' : 'transparent',
                transition: 'all 0.2s ease-out',
                pointerEvents: 'none',
              }}>
                TRANSMISSION_PAYLOAD (MESSAGE)
              </label>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    color: '#ff5f56',
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.8rem',
                    marginBottom: '1rem',
                    background: 'rgba(255, 95, 86, 0.08)',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '4px',
                    borderLeft: '3px solid #ff5f56',
                  }}
                >
                  &gt;&gt; ERROR: {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Overlay with interactive canvas blast */}
            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(2, 4, 8, 0.98)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  {/* CANVAS PARTICLE EXPLOSION INSTANCE */}
                  <SuccessParticles />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.15 }}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(0, 255, 153, 0.15)',
                      border: '2px solid var(--neon-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--neon-green)',
                      fontSize: '1.6rem',
                      marginBottom: '1.5rem',
                      boxShadow: '0 0 25px rgba(0, 255, 153, 0.4)',
                      position: 'relative',
                      zIndex: 3
                    }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="glitch-text" style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '1.30rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    position: 'relative',
                    zIndex: 3
                  }}>TRANSMISSION COMPLETED</h3>
                  <p style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    maxWidth: '300px',
                    marginBottom: '1.8rem',
                    lineHeight: 1.6,
                    position: 'relative',
                    zIndex: 3
                  }}>
                    YOUR DATA PACKET HAS BEEN SUCCESSFULLY UPLOADED TO THE CENTRAL NETWORK CORE.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setStatus('idle'); playBeep(600, 'sine', 0.05); }}
                    data-cursor="link"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--cyan)',
                      color: 'var(--cyan)',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.8rem',
                      padding: '0.6rem 1.4rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: 'none',
                      position: 'relative',
                      zIndex: 3
                    }}
                  >
                    Establish New Stream
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: status === 'sending' ? 1 : 1.02, boxShadow: status === 'sending' ? 'none' : '0 0 20px rgba(0, 255, 255, 0.3)' }}
              whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
              data-cursor="link"
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(90deg, var(--cyan), var(--magenta))',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'none',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? (
                <>
                  <div className="form-spinner" />
                  <span>TRANSMITTING DATA...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>BROADCAST SIGNAL</span>
                </>
              )
              }
            </motion.button>
          </form>
        </motion.div>
      </div>

      <style>{`
        .form-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: form-spin 0.8s linear infinite;
        }

        @keyframes form-spin {
          to { transform: rotate(360deg); }
        }

        /* Floating label styles override when active/focus */
        .form-input:focus ~ label {
          top: -0.7rem !important;
          font-size: 0.75rem !important;
          background: var(--bg-primary) !important;
        }

        .form-input:focus ~ span {
          color: var(--cyan) !important;
        }
      `}</style>
    </section>
  );
}

