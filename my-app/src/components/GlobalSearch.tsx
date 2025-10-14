import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const allPages: SearchResult[] = [
    { title: 'Dashboard', description: 'View your health overview', path: '/', category: 'Pages' },
    { title: 'AI Health Assistant', description: 'Get instant health advice', path: '/ai-assistant', category: 'Pages' },
    { title: 'Drug Interaction Checker', description: 'Check medicine compatibility', path: '/drug-checker', category: 'Pages' },
    { title: 'Medicine Library', description: 'Browse 14,690+ medicines', path: '/library', category: 'Pages' },
    { title: 'Reminders', description: 'Manage medication reminders', path: '/reminders', category: 'Pages' },
    { title: 'Blood Bank', description: 'Find or donate blood', path: '/blood-bank', category: 'Pages' },
    { title: 'Symptom Checker', description: 'Check your symptoms', path: '/symptom-checker', category: 'Pages' },
    { title: 'Profile Settings', description: 'Manage your account', path: '/profile', category: 'Settings' },
    { title: 'Help Center', description: 'Get help and support', path: '/help', category: 'Support' },
    { title: 'Contact Us', description: 'Get in touch with support', path: '/contact', category: 'Support' },
    { title: 'Privacy Policy', description: 'Read our privacy policy', path: '/privacy-policy', category: 'Legal' },
    { title: 'Terms of Service', description: 'Read our terms', path: '/terms-of-service', category: 'Legal' },
  ];

  const recentSearches = [
    'Aspirin interactions',
    'Blood pressure medicines',
    'Diabetes reminders',
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const filtered = allPages.filter(
      (page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase()) ||
        page.category.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results.length > 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex].path);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Search Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center border-b-2 border-gray-200 px-4 py-4">
                <Search className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search pages, features, and more..."
                  className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {query === '' ? (
                  // Recent & Popular
                  <div className="p-4">
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Recent Searches
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setQuery(search)}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-gray-400" />
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                          Popular Pages
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {allPages.slice(0, 5).map((page, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelect(page.path)}
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                  {page.title}
                                </p>
                                <p className="text-sm text-gray-500">{page.description}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  // Search Results
                  <div className="p-2">
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(result.path)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors group ${
                          index === selectedIndex
                            ? 'bg-blue-50 border-2 border-blue-200'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-medium text-gray-900 group-hover:text-blue-600">
                                {result.title}
                              </p>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                {result.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{result.description}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  // No Results
                  <div className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No results found for "{query}"</p>
                    <p className="text-sm text-gray-500">Try different keywords</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t-2 border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↑</kbd>
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">↓</kbd>
                      <span>Navigate</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Enter</kbd>
                      <span>Select</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <kbd className="px-2 py-1 bg-white border border-gray-300 rounded">Esc</kbd>
                      <span>Close</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
