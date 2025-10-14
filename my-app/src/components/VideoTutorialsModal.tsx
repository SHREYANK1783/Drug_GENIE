import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Clock, Award, X } from 'lucide-react';

interface VideoTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoTutorialsModal: React.FC<VideoTutorialsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tutorials = [
    {
      title: 'Getting Started with Drug GENIE',
      duration: '5:30',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Getting+Started',
      description: 'Learn the basics of navigating Drug GENIE and setting up your profile',
    },
    {
      title: 'Using the AI Health Assistant',
      duration: '8:15',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=AI+Assistant',
      description: 'Discover how to get personalized health advice from our AI',
    },
    {
      title: 'Drug Interaction Checker',
      duration: '6:45',
      level: 'Intermediate',
      thumbnail: 'https://via.placeholder.com/300x200/EC4899/FFFFFF?text=Drug+Checker',
      description: 'Check for dangerous drug interactions before taking medications',
    },
    {
      title: 'Setting Up Medication Reminders',
      duration: '4:20',
      level: 'Beginner',
      thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Reminders',
      description: 'Never miss a dose with smart medication reminders',
    },
    {
      title: 'Blood Bank System Overview',
      duration: '7:30',
      level: 'Intermediate',
      thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Blood+Bank',
      description: 'Learn how to request or donate blood through our platform',
    },
    {
      title: 'Advanced Search in Medicine Library',
      duration: '5:50',
      level: 'Advanced',
      thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Medicine+Library',
      description: 'Search through 14,690+ medicines with advanced filters',
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-6xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Tutorials</h2>
            <p className="text-gray-600">Step-by-step guides to master Drug GENIE</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{tutorials.length}</p>
            <p className="text-sm text-gray-600">Tutorials</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">42 min</p>
            <p className="text-sm text-gray-600">Total Duration</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">All Levels</p>
            <p className="text-sm text-gray-600">Skill Levels</p>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-blue-600 ml-1" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full">
                  {tutorial.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{tutorial.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{tutorial.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
          <p className="text-center text-gray-700">
            <strong>🎬 More tutorials coming soon!</strong> We're creating comprehensive video guides for all Drug GENIE features.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoTutorialsModal;
