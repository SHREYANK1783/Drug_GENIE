import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { symptoms } from '../data/symptoms';
import { Symptom } from '../types';

const SymptomChecker: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Symptom[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom.id)
  );

  const addSymptom = (symptomId: string) => {
    setSelectedSymptoms([...selectedSymptoms, symptomId]);
    setSearchTerm('');
    setHasAnalyzed(false);
  };

  const removeSymptom = (symptomId: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    setHasAnalyzed(false);
  };

  const analyzeSymptoms = () => {
    const selectedSymptomData = symptoms.filter(s => selectedSymptoms.includes(s.id));
    setResults(selectedSymptomData);
    setHasAnalyzed(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-100';
      case 'severe':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallSeverity = () => {
    if (results.some(r => r.severity === 'severe')) return 'severe';
    if (results.some(r => r.severity === 'moderate')) return 'moderate';
    return 'mild';
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
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
            <Stethoscope className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Symptom Checker</h1>
            <p className="text-gray-600 dark:text-gray-300">Get preliminary health insights by describing your symptoms</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Symptom Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Your Symptoms</h2>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for symptoms..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                {filteredSymptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => addSymptom(symptom.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{symptom.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{symptom.category}</p>
                  </button>
                ))}
                {filteredSymptoms.length === 0 && (
                  <p className="p-3 text-gray-500 dark:text-gray-400 text-center">No symptoms found</p>
                )}
              </div>
            )}

            {/* Selected Symptoms */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Symptoms:</h3>
              {selectedSymptoms.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No symptoms selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedSymptoms.map((symptomId) => {
                    const symptom = symptoms.find(s => s.id === symptomId);
                    if (!symptom) return null;
                    
                    return (
                      <div
                        key={symptomId}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{symptom.name}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getSeverityColor(symptom.severity)}`}>
                            {symptom.severity}
                          </span>
                        </div>
                        <button
                          onClick={() => removeSymptom(symptomId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0}
              className="w-full py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Symptoms
            </motion.button>
          </div>
        </motion.div>

        {/* Analysis Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Analysis Results</h2>
          
          {!hasAnalyzed ? (
            <div className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Select symptoms and click "Analyze Symptoms" to see results</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Assessment */}
              <div className={`p-4 rounded-lg border-2 ${
                getOverallSeverity() === 'severe' ? 'border-red-200 bg-red-50' :
                getOverallSeverity() === 'moderate' ? 'border-yellow-200 bg-yellow-50' :
                'border-green-200 bg-green-50'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {getOverallSeverity() === 'severe' ? (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  ) : getOverallSeverity() === 'moderate' ? (
                    <Info className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <h3 className={`font-semibold ${
                    getOverallSeverity() === 'severe' ? 'text-red-800' :
                    getOverallSeverity() === 'moderate' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    Overall Assessment: {getOverallSeverity().charAt(0).toUpperCase() + getOverallSeverity().slice(1)}
                  </h3>
                </div>
                <p className={`text-sm ${
                  getOverallSeverity() === 'severe' ? 'text-red-700' :
                  getOverallSeverity() === 'moderate' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {getOverallSeverity() === 'severe' 
                    ? 'Some of your symptoms may require immediate medical attention. Please consult a healthcare provider.'
                    : getOverallSeverity() === 'moderate'
                    ? 'Your symptoms should be monitored. Consider consulting a healthcare provider if they persist or worsen.'
                    : 'Your symptoms appear to be mild. Monitor them and seek medical advice if they worsen.'
                  }
                </p>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                {results.map((symptom, index) => (
                  <motion.div
                    key={symptom.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{symptom.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Common Causes:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {symptom.commonCauses.map((cause, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recommendations:</h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                          {symptom.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Important Medical Disclaimer</h3>
            <p className="text-sm text-red-700 mt-1">
              This symptom checker is for informational purposes only and should not replace professional medical advice, 
              diagnosis, or treatment. Always consult with a qualified healthcare provider for any health concerns. 
              If you're experiencing a medical emergency, call emergency services immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SymptomChecker;