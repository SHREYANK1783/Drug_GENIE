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
      {/* Navbar */}
      <Navbar onToggleSidebar={handleToggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex pt-20 flex-1">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main
          className={`flex-1 p-6 transition-all duration-300 ${
            isSidebarOpen ? 'ml-72' : 'ml-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
      
      {/* Footer */}
      <Footer />                                                                             
    </div>
  );
};

export default Layout;