import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function VisitorCounter({ count, isLoading }) {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    if (isLoading || count === 0) return;
    
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayCount(Math.floor(eased * count));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [count, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        letterSpacing: '1px',
      }}
    >
      <span style={{ color: 'var(--neon-green)', fontSize: '0.5rem' }}>●</span>
      <span>
        {isLoading ? '...' : displayCount.toLocaleString()}
      </span>
      <span>VISITORS</span>
    </motion.div>
  );
}
