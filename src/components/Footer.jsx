import { motion } from 'framer-motion';
import { FaGithub, FaLinkedinIn, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import VisitorCounter from './VisitorCounter';

const socials = [
  { icon: FaGithub, href: 'https://github.com/SANIshbhandari', label: 'GitHub' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/in/sanish-bhandari-b0a828296/', label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:sanishbhandari237@gmail.com', label: 'Email' },
];

export default function Footer({ visitorCount, isLoading }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '3rem clamp(1rem, 5vw, 6rem)',
      position: 'relative',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        {/* Left */}
        <div>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}>
            Built with <span style={{ color: 'var(--magenta)' }}>♥</span> by{' '}
            <span style={{ color: 'var(--cyan)' }}>Sanish Bhandari</span>
          </p>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
          }}>
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        {/* Center - Visitor */}
        <VisitorCounter count={visitorCount} isLoading={isLoading} />

        {/* Right - Socials + Back to top */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              data-cursor="link"
              aria-label={label}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--cyan)';
                e.currentTarget.style.borderColor = 'var(--cyan)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,255,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon size={16} />
            </motion.a>
          ))}

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            data-cursor="link"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--cyan)',
              background: 'transparent',
              color: 'var(--cyan)',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
            }}
          >
            <FaArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
