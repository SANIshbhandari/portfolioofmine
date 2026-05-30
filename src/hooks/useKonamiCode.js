import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export function useKonamiCode() {
  const [activated, setActivated] = useState(false);
  
  useEffect(() => {
    let index = 0;
    
    const handler = (e) => {
      if (e.code === KONAMI_CODE[index]) {
        index++;
        if (index === KONAMI_CODE.length) {
          setActivated(true);
          index = 0;
          setTimeout(() => setActivated(false), 5000);
        }
      } else {
        index = 0;
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  
  return activated;
}
