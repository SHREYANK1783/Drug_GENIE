import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { ChatMessage } from '../types';
import { getChatMessages, saveChatMessage, clearChatMessages } from '../utils/storage';
import { getAIResponse } from '../utils/aiResponses';
import { v4 as uuidv4 } from 'uuid';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      // Simulate loading time for chat history
      setTimeout(() => {
        const savedMessages = getChatMessages();
        setMessages(savedMessages);
        setIsLoading(false);
      }, 800);
    };
    loadMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    saveChatMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponse = getAIResponse(inputMessage);
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      saveChatMessage(aiMessage);
      setIsTyping(false);

      // Log the AI consultation to backend
      try {
        await fetch('http://localhost:5000/api/stats/log-consultation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: inputMessage,
            response: aiResponse,
          }),
        });
      } catch (logError) {
        console.error('Error logging consultation:', logError);
        // Don't block the user if logging fails
      }
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages([]);
    clearChatMessages();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Health Assistant</h1>
              <p className="text-gray-600 dark:text-gray-300">Get instant health guidance and information</p>
            </div>
          </div>
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Chat</span>
          </button>
        </div>
      </motion.div>

      {/* Chat Messages */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-3 max-w-3xl ${i % 2 === 0 ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-64 rounded-lg" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bot className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Welcome to AI Health Assistant</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Ask me about symptoms, medications, or general health questions.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {[
                  "What should I do for a headache?",
                  "How do I manage diabetes?",
                  "Tell me about blood pressure",
                  "What are common medication side effects?"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="p-3 text-left bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors text-sm text-gray-900 dark:text-gray-100"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`p-2 rounded-full ${message.type === 'user' ? 'bg-sky-100 dark:bg-sky-900' : 'bg-purple-100 dark:bg-purple-900'}`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-sky-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className={`p-4 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-sky-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-sky-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me about your health concerns..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isTyping}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;