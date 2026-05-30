import { useState, useEffect } from 'react';
import { triggerAchievement } from './AchievementToasts';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About', achievement: 'LORE_SEEKER' },
  { id: 'skills', label: 'Skills', achievement: 'SKILL_TREE' },
  { id: 'projects', label: 'Projects', achievement: 'RECON' },
  { id: 'contact', label: 'Contact', achievement: 'HEADHUNTER' },
];

export default function ScrollDots() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            if (activeSection !== section.id) {
              setActiveSection(section.id);
              // Unlock corresponding achievement on scroll spy entry
              if (section.achievement) {
                triggerAchievement(section.achievement);
              }
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const handleDotClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="scroll-dots-container"
      style={{
        position: 'fixed',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '0.8rem 0.5rem',
        background: 'rgba(2, 4, 8, 0.65)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        backdropFilter: 'blur(5px)',
      }}
    >
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => handleDotClick(sec.id)}
            data-cursor="link"
            title={`Scroll to ${sec.label}`}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '12px',
              height: '12px',
              cursor: 'none',
            }}
          >
            <div
              style={{
                width: isActive ? '8px' : '4px',
                height: isActive ? '8px' : '4px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                boxShadow: isActive ? '0 0 10px var(--cyan), 0 0 20px var(--cyan)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </button>
        );
      })}

      <style>{`
        /* Hide scroll dots on mobile devices */
        @media (max-width: 768px) {
          .scroll-dots-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
