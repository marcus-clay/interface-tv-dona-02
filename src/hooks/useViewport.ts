import { useState, useEffect } from 'react';

export function useViewport() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024 && width < 1440,
    isTV: width >= 1440,
  };
}

// Hook simple pour détecter le scroll (pour le header sticky)
export function useScrollPosition() {
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    const updatePosition = () => setScroll(window.scrollY);
    window.addEventListener("scroll", updatePosition);
    return () => window.removeEventListener("scroll", updatePosition);
  }, []);
  return scroll;
}