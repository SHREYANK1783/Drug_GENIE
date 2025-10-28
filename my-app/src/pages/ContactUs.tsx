import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  CheckCircle,
} from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@druggenie.com',
      link: 'mailto:support@druggenie.com',
      color: 'blue',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'green',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Healthcare Ave, Medical District, NY 10001',
      link: 'https://maps.google.com',
      color: 'red',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon-Fri: 9AM - 6PM EST',
      link: null,
      color: 'orange',
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', link: 'https://facebook.com', color: 'blue' },
    { icon: Twitter, name: 'Twitter', link: 'https://twitter.com', color: 'sky' },
    { icon: Linkedin, name: 'LinkedIn', link: 'https://linkedin.com', color: 'blue' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center"
      >
        <MessageCircle className="h-16 w-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-blue-100 text-lg">
          We're here to help! Reach out to us anytime.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Send us a Message</h2>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Thank you for contacting us. We'll respond within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Contact Info Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Contact Information</h3>
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div
                    className={`p-2 bg-${info.color}-100 rounded-lg flex-shrink-0`}
                  >
                    <info.icon className={`h-5 w-5 text-${info.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{info.title}</p>
                    {info.link ? (
                      <a
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{info.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-${social.color}-50 rounded-xl hover:bg-${social.color}-100 transition-colors`}
                  title={social.name}
                >
                  <social.icon className={`h-6 w-6 text-${social.color}-600`} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Response */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Quick Response</h3>
            </div>
            <p className="text-sm text-gray-700">
              We typically respond to all inquiries within 24 hours during business days.
              For urgent matters, please call us directly.
            </p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border-2 border-red-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Emergency</h3>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              For medical emergencies, please call 911 or visit your nearest emergency room.
            </p>
            <p className="text-xs text-gray-600">
              Drug GENIE is not a substitute for emergency medical care.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="h-64 md:h-96 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Interactive Map Coming Soon</p>
            <p className="text-sm text-gray-500 mt-2">
              123 Healthcare Ave, Medical District, NY 10001
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
