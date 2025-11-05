import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, X, AlertTriangle, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';
import { checkDrugInteractions, getSeverityColor, DrugInteraction, getMedicineSuggestions } from '../utils/drugInteractions';
import { Skeleton } from '../components/ui/skeleton';
import { logUserActivity, ActivityTypes } from '../services/activityLogger';

const DrugChecker: React.FC = () => {
  const [medications, setMedications] = useState<string[]>([]);
  const [currentMed, setCurrentMed] = useState('');
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);   
  const [hasChecked, setHasChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);           
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);      

  // Handle input changes and show suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentMed(value);
    
    if (value.length >= 2) {
      const newSuggestions = getMedicineSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const selectSuggestion = (suggestion: string) => {
    setCurrentMed(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addMedication = () => {
    const trimmedMed = currentMed.trim();
    
    if (!trimmedMed) {
      return;
    }
    
    if (medications.includes(trimmedMed)) {
      return;
    }
    
    // Allow any reasonable input - validation will happen during interaction checking
    // This ensures we don't block potentially valid drug names
    if (trimmedMed.length < 2) {
      return;
    }
    
    // Only add if it's a valid medicine name
    setMedications([...medications, trimmedMed]);
    setCurrentMed('');
    setHasChecked(false);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
    setHasChecked(false);
  };

  const checkInteractions = async () => {
    if (medications.length < 2) {
      return;
    }

    setIsLoading(true);
    try {
      const foundInteractions = await checkDrugInteractions(medications);
      setInteractions(foundInteractions);
      setHasChecked(true);

      // Log the interaction check to backend
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await fetch(`${API_URL}/api/stats/log-interaction`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            medications: medications,
            interactionsFound: foundInteractions.length,
          }),
        });

        // Log activity for recent activity feed
        await logUserActivity(
          ActivityTypes.DRUG_INTERACTION,
          'Drug interaction check performed',
          `Checked: ${medications.join(' + ')}`,
          {
            medications: medications,
            interactionCount: foundInteractions.length
          }
        );
      } catch (logError) {
        console.error('Error logging interaction:', logError);
        // Don't block the user if logging fails
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMedication();
    }
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
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Drug Interaction Checker</h1>
            <p className="text-gray-600 dark:text-gray-300">Check for potentially dangerous interactions between medications</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Add Medications</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentMed}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Start typing medicine name (e.g., Asp... for Aspirin)"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addMedication}
                  className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0 flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{suggestion}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Medication List */}
            <div className="space-y-2">
              {medications.map((med, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">{med}</span>
                  <button
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={checkInteractions}
              disabled={medications.length < 2 || isLoading}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Checking Interactions...</span>
                </>
              ) : (
                <span>Check for Interactions</span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Interaction Results</h2>
          
          {isLoading ? (
            <div className="p-6 space-y-4">
              {/* Interaction Cards Skeleton */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-[200px]" />
                      <Skeleton className="h-4 w-[80px]" />
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-[70%]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[60%]" />
                    <Skeleton className="h-3 w-[80%]" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasChecked ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Add medications and click "Check for Interactions" to see results</p>
            </div>
          ) : interactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Interactions Found</h3>
              <p className="text-gray-600 dark:text-gray-400">These medications appear to be safe to take together based on our database.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      interaction.severity === 'severe' ? 'text-red-500' :
                      interaction.severity === 'moderate' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {interaction.drug1} + {interaction.drug2}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity.toUpperCase()}
                        </span>
                      </div>
                      {/* Simple Summary */}
                      {interaction.simpleSummary && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3">
                          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            💡 {interaction.simpleSummary}
                          </p>
                        </div>
                      )}
                      
                      {/* Side Effects */}
                      {interaction.sideEffects && interaction.sideEffects.length > 0 && (
                        <div className="bg-red-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-red-800 mb-2">⚠️ Possible Side Effects:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {interaction.sideEffects.map((effect, idx) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <span className="text-red-600">•</span>
                                <span className="text-sm text-red-700">{effect}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* What to Avoid */}
                      {interaction.whatToAvoid && interaction.whatToAvoid.length > 0 && (
                        <div className="bg-orange-50 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-orange-800 mb-2">🚫 What NOT to Consume/Do:</p>
                          <div className="space-y-1">
                            {interaction.whatToAvoid.map((avoid, idx) => (
                              <div key={idx} className="flex items-center space-x-1">
                                <span className="text-orange-600">✗</span>
                                <span className="text-sm text-orange-700">{avoid}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Doctor's Advice:</strong> {interaction.recommendation}
                        </p>
                        {interaction.source && (
                          <p className="text-xs text-blue-600 mt-1">
                            Source: {interaction.source.toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700 mt-1">
              This tool provides general information about drug interactions and should not replace professional medical advice. 
              Always consult with your healthcare provider or pharmacist before starting, stopping, or changing medications.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DrugChecker;