import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Custom hook to apply a premium magnetic pull effect to any HTML element.
 * Snaps to cursor when close and springs back elastically when released.
 * @param {number} strength - Pull strength modifier (0.1 to 0.5 is ideal)
 * @returns {React.RefObject} - The reference to attach to the element
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate cursor vector from element center
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      // Get physical distance
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Dynamic pull radius based on element size
      const pullRadius = Math.max(rect.width, rect.height) * 1.25;

      if (distance < pullRadius) {
        // Apply magnetic drift towards cursor
        gsap.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // Return smoothly with spring elasticity
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }
    };

    const handleMouseLeave = () => {
      // Immediate elastic snapback on fast cursor exit
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.35)',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
