import { useEffect, useRef } from 'react';
import { useCursor } from '../hooks/useCursor';

export default function Cursor() {
  const { position, cursorType, isClicking, isVisible } = useCursor();
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);

  // Initialize the trailing points (8 dots in the chain)
  useEffect(() => {
    pointsRef.current = Array(8).fill(null).map(() => ({ x: position.x, y: position.y }));
  }, []);

  // Update canvas size on load and window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!outerRef.current || !innerRef.current) return;
    
    const outer = outerRef.current;
    const inner = innerRef.current;

    // Smooth follow logic for the outer ring
    let outerX = position.x;
    let outerY = position.y;
    let currentOuterX = outerX;
    let currentOuterY = outerY;

    let animationFrameId;

    const animate = () => {
      // 1. Interpolated Outer ring positioning
      currentOuterX += (position.x - currentOuterX) * 0.15;
      currentOuterY += (position.y - currentOuterY) * 0.15;
      
      const widthOffset = cursorType === 'link' ? 30 : cursorType === 'image' ? 25 : 20;
      const heightOffset = cursorType === 'link' ? 30 : cursorType === 'image' ? 25 : 20;
      
      outer.style.transform = `translate(${currentOuterX - widthOffset}px, ${currentOuterY - heightOffset}px)`;
      inner.style.transform = `translate(${position.x - 4}px, ${position.y - 4}px)`;
      
      // 2. Lag interpolation chain for the 8 Canvas trail dots
      const canvas = canvasRef.current;
      if (canvas && isVisible) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Head point sits exactly on the cursor
        pointsRef.current[0] = { x: position.x, y: position.y };
        
        // Each successive dot chases the predecessor
        for (let i = 1; i < 8; i++) {
          const pt = pointsRef.current[i];
          const prevPt = pointsRef.current[i - 1];
          if (pt && prevPt) {
            pt.x += (prevPt.x - pt.x) * 0.35;
            pt.y += (prevPt.y - pt.y) * 0.35;
          }
        }
        
        // Draw trailing dots with progressive radius & opacity reduction
        pointsRef.current.forEach((pt, idx) => {
          if (idx === 0) return; // skip head dot
          const ratio = (8 - idx) / 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4 * ratio, 0, Math.PI * 2);
          
          if (cursorType === 'link') {
            ctx.fillStyle = `rgba(255, 0, 255, ${0.7 * ratio})`; // magenta
          } else if (cursorType === 'image') {
            ctx.fillStyle = `rgba(0, 255, 153, ${0.7 * ratio})`; // neon green
          } else {
            ctx.fillStyle = `rgba(0, 255, 255, ${0.7 * ratio})`; // cyan
          }
          
          ctx.shadowBlur = 6;
          ctx.shadowColor = cursorType === 'link' ? '#FF00FF' : cursorType === 'image' ? '#00FF99' : '#00FFFF';
          ctx.fill();
        });
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, cursorType, isVisible]);

  // Dynamic Morphing sizes & shapes based on active element
  const getOuterStyles = () => {
    const base = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '2px solid var(--cyan)',
      pointerEvents: 'none',
      zIndex: 9999,
      transition: 'width 0.25s, height 0.25s, border-color 0.25s, border-radius 0.25s, opacity 0.25s, box-shadow 0.25s',
      opacity: isVisible ? 1 : 0,
      mixBlendMode: 'difference',
    };

    if (cursorType === 'link') {
      return { 
        ...base, 
        width: '60px', 
        height: '60px', 
        borderColor: 'var(--magenta)',
        boxShadow: '0 0 10px rgba(255,0,255,0.3)'
      };
    }
    if (cursorType === 'image') {
      return { 
        ...base, 
        width: '50px', 
        height: '50px', 
        borderRadius: '8px', // Card rounded-square morph shape
        borderColor: 'var(--neon-green)',
        boxShadow: '0 0 12px rgba(0,255,153,0.4)'
      };
    }
    if (isClicking) {
      return { 
        ...base, 
        width: '30px', 
        height: '30px', 
        borderColor: 'var(--magenta)' 
      };
    }
    return base;
  };

  const getInnerStyles = () => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--cyan)',
    pointerEvents: 'none',
    zIndex: 10000,
    transition: 'background-color 0.25s, width 0.25s, height 0.25s, opacity 0.25s',
    opacity: isVisible ? 1 : 0,
    ...(cursorType === 'link' && { backgroundColor: 'var(--magenta)', width: '12px', height: '12px' }),
    ...(cursorType === 'image' && { backgroundColor: 'var(--neon-green)', width: '10px', height: '10px' }),
  });

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
  if (isMobile) return null;

  return (
    <>
      <canvas 
        ref={canvasRef} 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 9996 
        }} 
      />
      <div ref={outerRef} className="custom-cursor" style={getOuterStyles()} />
      <div ref={innerRef} className="custom-cursor" style={getInnerStyles()} />
    </>
  );
}

