import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
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
          <main className="flex-1 p-4 sm:p-6">
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