import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, FileText, Mail, Phone, MapPin, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Drug GENIE</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted healthcare companion providing medication management, 
              drug interaction checking, and blood donation services.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-gray-300 hover:text-white transition-colors text-sm">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/drug-checker" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Drug Checker
                </Link>
              </li>
              <li>
                <Link to="/library" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Medicine Library
                </Link>
              </li>
              <li>
                <Link to="/blood-bank" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blood Bank
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/privacy-policy" 
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center sm:justify-start text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                <span>support@drugenie.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-3 text-blue-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-3 mt-0.5 text-blue-400 flex-shrink-0" />
                <span>
                  123 Healthcare Ave<br />
                  Medical District<br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} Drug GENIE. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <span className="text-center">Made with ❤️ for better healthcare</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="whitespace-nowrap">System Status: Operational</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
