import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Shield, 
  BookOpen, 
  Clock, 
  Droplets, 
  Stethoscope,
  LayoutDashboard,
  Activity,
} from 'lucide-react';
import { getHealthScore, HealthScoreData } from '../services/healthScoreApi';
import { getToken } from '../services/api';

interface SidebarProps {
  isSidebarOpen: boolean;
  onClose?: () => void;
}

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { name: 'Drug Checker', href: '/drug-checker', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'Medicine Library', href: '/library', icon: BookOpen, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { name: 'Reminders', href: '/reminders', icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { name: 'Blood Bank', href: '/blood-bank', icon: Droplets, color: 'text-red-600', bgColor: 'bg-red-50' },
  { name: 'Symptom Checker', href: '/symptom-checker', icon: Stethoscope, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, onClose }) => {
  const location = useLocation();
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthScore();
  }, []);

  const fetchHealthScore = async () => {
    try {
      const token = getToken();
      if (token) {
        const data = await getHealthScore(token);
        setHealthScore(data);
      }
    } catch (error) {
      console.error('Error fetching health score:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ 
          x: isSidebarOpen ? 0 : -300, 
          opacity: isSidebarOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 sm:top-20 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl border-r border-gray-200 dark:border-gray-700 pt-6 overflow-y-auto z-40 transition-colors duration-200"
      >
      <nav className="px-4">
        {/* Menu */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-4">
            Healthcare Tools
          </h2>
          <ul className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.href;
              return (
                <motion.li
                  key={item.name}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    to={item.href}
                    onClick={() => {
                      // Auto-close sidebar on mobile when clicking a link
                      if (window.innerWidth < 1024 && onClose) {
                        onClose();
                      }
                    }}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? `${item.bgColor} dark:bg-gray-700 text-cyan-600 shadow-md border-l-4 border-cyan-600`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    <div className={`mr-4 p-2 rounded-lg transition-all ${
                      isActive ? 'bg-white dark:bg-gray-600 shadow-sm' : 'group-hover:bg-white dark:group-hover:bg-gray-600 group-hover:shadow-sm'
                    }`}>
                      <item.icon className={`h-5 w-5 transition-colors ${
                        isActive ? 'text-cyan-600' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      }`} />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-current rounded-full"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Health Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mx-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Health Score</h3>
          </div>
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : healthScore !== null ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Overall</span>
                <span className={`font-semibold ${
                  healthScore.overallScore >= 80 ? 'text-green-600' :
                  healthScore.overallScore >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {healthScore.overallScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    healthScore.overallScore >= 80 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                    healthScore.overallScore >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-red-400 to-orange-500'
                  }`}
                  style={{ width: `${healthScore.overallScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {healthScore.insights[0] || 'Keep tracking your medications!'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 text-center py-2">
              No data available
            </p>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="mx-4 mt-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <Link
              to="/reminders"
              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors block"
            >
              📋 View Medical History
            </Link>
            <Link
              to="/contact"
              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors block"
            >
              📞 Emergency Contacts
            </Link>
            <Link
              to="/profile"
              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors block"
            >
              ⚙️ Settings & Privacy
            </Link>
          </div>
        </div>
      </nav>
    </motion.aside>
    </>
  );
};

export default Sidebar;
