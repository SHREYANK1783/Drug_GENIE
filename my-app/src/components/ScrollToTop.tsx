import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo(0, 0);
    
    // Also scroll main content area
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
