import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      {/* Skip to main content - for keyboard accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      {/* Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex pt-20 flex-1">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} onClose={handleToggleSidebar} />

        {/* Main Content + Footer */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? 'lg:ml-72' : 'ml-0'
          }`}
        >
          <main id="main-content" className="flex-1 p-4 sm:p-6" role="main" aria-label="Main content">
            <Outlet />
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>                                                                             
    </div>
  );
};

export default Layout;