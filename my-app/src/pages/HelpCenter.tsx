import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  MessageCircle,
  Video,
  Mail,
  Phone,
  Clock,
  Shield,
  Bot,
  Droplets,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoTutorialsModal from '../components/VideoTutorialsModal';
import LiveChatModal from '../components/LiveChatModal';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle },
    { id: 'ai-assistant', name: 'AI Assistant', icon: Bot },
    { id: 'drugs', name: 'Drug Checker', icon: Shield },
    { id: 'reminders', name: 'Reminders', icon: Clock },
    { id: 'blood-bank', name: 'Blood Bank', icon: Droplets },
  ];

  const faqs: FAQ[] = [
    {
      category: 'getting-started',
      question: 'How do I create an account?',
      answer: 'Click the "Sign Up" button on the login page, fill in your personal information including name, age, blood group, and gender, then create a secure password. You\'ll receive a confirmation email to verify your account.',
    },
    {
      category: 'getting-started',
      question: 'Is Drug GENIE free to use?',
      answer: 'Yes! Drug GENIE is completely free to use. We provide all features including AI health assistance, drug interaction checking, medicine library, reminders, and blood bank services at no cost.',
    },
    {
      category: 'ai-assistant',
      question: 'How does the AI Health Assistant work?',
      answer: 'Our AI Assistant uses advanced natural language processing to understand your health queries and provide relevant information. It can help with general health questions, symptom analysis, and medication guidance. However, it should not replace professional medical advice.',
    },
    {
      category: 'ai-assistant',
      question: 'Is the AI Assistant confidential?',
      answer: 'Yes, all conversations with the AI Assistant are private and encrypted. We do not share your health queries with third parties, and your data is stored securely in compliance with healthcare privacy standards.',
    },
    {
      category: 'drugs',
      question: 'How do I check for drug interactions?',
      answer: 'Go to the Drug Checker page, search and add the medications you\'re taking, then click "Check Interactions". Our system will analyze potential interactions and provide detailed warnings if any are found.',
    },
    {
      category: 'drugs',
      question: 'How accurate is the drug interaction checker?',
      answer: 'Our drug interaction database contains 770+ verified interactions and covers 14,690+ medicines. While highly accurate, it should complement—not replace—advice from your healthcare provider.',
    },
    {
      category: 'drugs',
      question: 'Can I check interactions for herbal supplements?',
      answer: 'Yes, our database includes many common herbal supplements and over-the-counter medications. Search by the supplement name to check for potential interactions.',
    },
    {
      category: 'reminders',
      question: 'How do I set up medication reminders?',
      answer: 'Navigate to the Reminders page, click "Add New Reminder", enter your medication name, dosage, and select the times you need to take it. You can set daily, weekly, or custom schedules.',
    },
    {
      category: 'reminders',
      question: 'Will I receive notifications for my reminders?',
      answer: 'Yes! You\'ll receive browser notifications at your scheduled times. Make sure to enable notifications when prompted by your browser. You can also configure email and SMS reminders in your profile settings.',
    },
    {
      category: 'reminders',
      question: 'Can I set reminders for multiple medications?',
      answer: 'Absolutely! You can create unlimited reminders for different medications, each with their own schedule and dosage instructions.',
    },
    {
      category: 'blood-bank',
      question: 'How does the Blood Bank system work?',
      answer: 'The Blood Bank allows you to create donation requests specifying your blood group, urgency level, and location. Compatible donors will be notified automatically, and they can contact you directly to coordinate donation.',
    },
    {
      category: 'blood-bank',
      question: 'Who can see my blood donation request?',
      answer: 'Only users with compatible blood types will see your request. The system uses blood compatibility rules to ensure notifications are sent only to eligible donors.',
    },
    {
      category: 'blood-bank',
      question: 'Can I donate blood through this platform?',
      answer: 'While we don\'t handle the actual donation process, you can respond to blood requests from others and coordinate with them directly. We provide contact information to facilitate the connection.',
    },
    {
      category: 'getting-started',
      question: 'How do I update my profile information?',
      answer: 'Go to your Profile page from the user menu, click "Edit Profile", update your information, and click "Save Changes". Some information like your email cannot be changed for security reasons.',
    },
    {
      category: 'getting-started',
      question: 'How do I change my password?',
      answer: 'Navigate to Profile > Security tab, enter your current password, then create and confirm your new password. Your new password must be at least 6 characters with one uppercase letter and one special character.',
    },
    {
      category: 'getting-started',
      question: 'What should I do if I forget my password?',
      answer: 'Click the "Forgot Password" link on the login page, enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.',
    },
    {
      category: 'drugs',
      question: 'Can I save my medication list?',
      answer: 'Yes, your medication list in the Drug Checker is automatically saved to your account. You can access it anytime and update it as your prescriptions change.',
    },
    {
      category: 'ai-assistant',
      question: 'What kind of questions can I ask the AI?',
      answer: 'You can ask about symptoms, general health advice, medication information, side effects, when to see a doctor, and more. The AI is designed to provide informative responses but always recommends consulting healthcare professionals for diagnosis and treatment.',
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center"
      >
        <HelpCircle className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Help Center</h1>
        <p className="text-blue-100 text-lg">
          Find answers to common questions and learn how to use Drug GENIE
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, FAQs, and guides..."
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="flex overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeCategory === category.id
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
              }`}
            >
              <category.icon className="h-5 w-5" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowVideoModal(true)}>
          <div className="p-3 bg-purple-100 rounded-xl w-fit mb-4">
            <Video className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Video Tutorials</h3>
          <p className="text-gray-600 text-sm mb-4">
            Watch step-by-step guides on using Drug GENIE features
          </p>
          <button className="text-purple-600 font-medium hover:text-purple-700">
            Watch Videos →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowChatModal(true)}>
          <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
            <MessageCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 text-sm mb-4">
            Chat with our support team for instant assistance
          </p>
          <button className="text-green-600 font-medium hover:text-green-700">
            Start Chat →
          </button>
        </div>

        <Link
          to="/contact"
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <div className="p-3 bg-blue-100 rounded-xl w-fit mb-4">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Support</h3>
          <p className="text-gray-600 text-sm mb-4">
            Send us a message and we'll get back to you soon
          </p>
          <span className="text-blue-600 font-medium hover:text-blue-700">
            Contact Us →
          </span>
        </Link>
      </motion.div>

      {/* FAQs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>

        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No results found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500 mt-2">Try different keywords or browse all topics</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-700 mb-6">
            Our support team is available 24/7 to assist you with any questions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Mail className="h-5 w-5" />
              <span>Contact Support</span>
            </Link>
            <a
              href="tel:+1234567890"
              className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
            >
              <Phone className="h-5 w-5" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Video Tutorials Modal */}
      <VideoTutorialsModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />

      {/* Live Chat Modal */}
      <LiveChatModal isOpen={showChatModal} onClose={() => setShowChatModal(false)} />
    </div>
  );
};

export default HelpCenter;
