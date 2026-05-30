import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';

export default function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const musicToggleRef = useMagnetic(0.35);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainRef = useRef(null);

  // Create ambient drone sound using Web Audio API
  const startAudio = () => {
    if (audioContextRef.current) return;
    
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = ctx;
    
    const gain = ctx.createGain();
    gain.gain.value = 0.03; // Very quiet
    gainRef.current = gain;
    
    // Simple ambient pad
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 110; // Low A
    
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 165; // E
    
    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 220; // A octave
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    [osc1, osc2, osc3].forEach(osc => {
      osc.connect(filter);
      osc.start();
    });
    
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    oscillatorRef.current = [osc1, osc2, osc3];
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const toggle = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <button
      ref={musicToggleRef}
      onClick={toggle}
      data-cursor="link"
      aria-label="Toggle ambient music"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid var(--border-color)',
        background: 'transparent',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        transition: 'border-color 0.3s',
      }}
    >
      {[1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={isPlaying ? {
            height: ['4px', `${8 + i * 3}px`, '4px'],
          } : { height: '4px' }}
          transition={isPlaying ? {
            duration: 0.5 + i * 0.1,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
          style={{
            width: '2px',
            height: '4px',
            background: isPlaying ? 'var(--cyan)' : 'var(--text-muted)',
            borderRadius: '1px',
            transition: 'background 0.3s',
          }}
        />
      ))}
    </button>
  );
}
