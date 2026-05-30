import { useState, useEffect } from 'react';
import { getVisitorCount, incrementVisitor } from '../lib/supabase';

export function useVisitor() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        const hasVisited = sessionStorage.getItem('portfolio-visited');
        if (!hasVisited) {
          const count = await incrementVisitor();
          setVisitorCount(count);
          sessionStorage.setItem('portfolio-visited', 'true');
        } else {
          const count = await getVisitorCount();
          setVisitorCount(count);
        }
      } catch (err) {
        console.error('Visitor tracking error:', err);
        setVisitorCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    trackVisit();
  }, []);

  return { visitorCount, isLoading };
}
