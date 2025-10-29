import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, AlertTriangle, Info, ExternalLink, Loader2, Pill } from 'lucide-react';
import { searchMedicines, getMedicineByName, MedicineSearchResult, MedicineData } from '../services/medicineApi';
import { Skeleton } from '../components/ui/skeleton';

const MedicineLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineSearchResult[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Search medicines when search term changes
  useEffect(() => {
    const searchDebounced = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const results = await searchMedicines(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Failed to search medicines:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounced);
  }, [searchTerm]);

  // Handle medicine selection
  const handleMedicineSelect = async (medicine: MedicineSearchResult) => {
    setIsLoadingDetails(true);
    try {
      const details = await getMedicineByName(medicine.NAME);
      setSelectedMedicine(details);
    } catch (error) {
      console.error('Failed to load medicine details:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Parse string data into arrays for display
  const parseStringToArray = (str: string): string[] => {
    if (!str) return [];
    return str.split(/\r?\n/).filter(item => item.trim()).map(item => item.trim());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Medicine Information Library</h1>
            <p className="text-gray-600 dark:text-gray-300">Browse comprehensive information about medicines, dosages, and side effects</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          {isSearching && <Loader2 className="absolute right-3 top-3 h-5 w-5 text-blue-500 animate-spin" />}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search from 14,690+ medicines by name..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {isSearching ? 'Searching...' : `Found ${searchResults.length} results`}
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medicine Search Results */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Search Results ({searchResults.length})
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((medicine, index) => (
                <motion.div
                  key={medicine._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleMedicineSelect(medicine)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedMedicine?.name === medicine.NAME ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Pill className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{medicine.NAME}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {medicine.INTRODUCTION?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : searchTerm ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No medicines found for "{searchTerm}"</p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">Search for medicines to see results</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Medicine Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200"
        >
          {isLoadingDetails ? (
            <div className="p-6 space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[250px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              
              {/* Content Sections Skeleton */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-[120px]" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : selectedMedicine ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMedicine.name}</h2>
                  {selectedMedicine.link && (
                    <a
                      href={selectedMedicine.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View on 1mg <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Introduction
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
                    {selectedMedicine.introduction}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-green-500" />
                    Uses
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    {parseStringToArray(selectedMedicine.uses).map((use, index) => (
                      <div key={index} className="flex items-start mb-2 last:mb-0">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-purple-500" />
                    Benefits
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedMedicine.benefits}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Side Effects
                  </h3>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    {parseStringToArray(selectedMedicine.side_effect).map((effect, index) => (
                      <div key={index} className="flex items-start mb-2 last:mb-0">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{effect}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    How to Use
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedMedicine.how_to_use}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                    How it Works
                  </h3>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedMedicine.how_works}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Quick Tips
                  </h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    {parseStringToArray(selectedMedicine.quick_tips).map((tip, index) => (
                      <div key={index} className="flex items-start mb-2 last:mb-0">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Medicine</h3>
              <p className="text-gray-600">Search and select a medicine to view comprehensive information</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MedicineLibrary;