import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, EyeOff, Mail, Lock, User, Calendar, Droplets, ArrowRight, CheckCircle, Check, X } from 'lucide-react';
import { registerUser } from '../../utils/storage';
import toast from 'react-hot-toast';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Initialize with completely empty form - no persistence
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bloodGroup: '',
    gender: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  // Smart initialization - preserve data when returning from legal pages
  useEffect(() => {
    const savedFormData = sessionStorage.getItem('signupFormData');
    const savedStep = sessionStorage.getItem('signupCurrentStep');
    const returnToStep2 = sessionStorage.getItem('returnToStep2');
    
    // If returning from legal pages, restore data
    if (returnToStep2 === 'true' || savedFormData) {
      console.log(' RESTORING DATA FROM LEGAL PAGE NAVIGATION');
      
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);
          
          if (parsedData.email || parsedData.password) {
            setCurrentStep(2);
          }
        } catch (error) {
          console.error('Error parsing saved data:', error);
        }
      }
      
      if (returnToStep2 === 'true') {
        setCurrentStep(2);
        sessionStorage.removeItem('returnToStep2');
      } else if (savedStep && parseInt(savedStep) >= 1 && parseInt(savedStep) <= 2) {
        setCurrentStep(parseInt(savedStep));
      }
    } else {
      // New user - clear everything and start fresh
      console.log(' NEW USER - STARTING FRESH');
      sessionStorage.clear();
      localStorage.clear();
      
      setFormData({
        name: '',
        age: '',
        bloodGroup: '',
        gender: '',
        email: '',
        password: '',
      });
      setCurrentStep(1);
    }
  }, []);

  // Save form data when user enters information
  useEffect(() => {
    if (formData.name || formData.age || formData.email || formData.password) {
      sessionStorage.setItem('signupFormData', JSON.stringify(formData));
    }
  }, [formData]);

  // Save current step
  useEffect(() => {
    sessionStorage.setItem('signupCurrentStep', currentStep.toString());
  }, [currentStep]);

  // Clear saved data on successful registration
  const clearSavedData = () => {
    sessionStorage.removeItem('signupFormData');
    sessionStorage.removeItem('signupCurrentStep');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
      };
      
      const newUser = await registerUser(userData);
      
      if (newUser) {
        clearSavedData(); // Clear saved form data on successful registration
        toast.success('Account created successfully! Welcome to Drug GENIE.');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // Show error toast with the error message
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Password validation helpers
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      hasMinLength,
      hasUpperCase,
      hasSpecialChar,
      isValid: hasMinLength && hasUpperCase && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const isStep1Valid = formData.name && formData.age && formData.bloodGroup && formData.gender;
  const isStep2Valid = formData.email && passwordValidation.isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Drug GENIE</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Join the Future of<br />
              <span className="text-blue-200">Digital Healthcare</span>
            </h2>
            
            <p className="text-xl text-cyan-100 mb-12 leading-relaxed">
              Get personalized health insights, medication reminders, and AI-powered 
              medical assistance tailored just for you.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '50K+', label: 'Active Users' },
                { number: '99.9%', label: 'Uptime' },
                { number: '24/7', label: 'AI Support' },
                { number: '100%', label: 'Secure' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-cyan-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-32 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center space-x-3">
              <div className="p-3 bg-cyan-500 rounded-2xl">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Drug GENIE</h1>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">Step {currentStep} of 2</span>
                <span className="text-sm font-medium text-cyan-600">{currentStep === 1 ? 'Personal Info' : 'Account Setup'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: '50%' }}
                  animate={{ width: currentStep === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join thousands of users managing their health smarter</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Age
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          required
                          min="1"
                          max="120"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                          placeholder="Age"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Blood Group
                      </label>
                      <div className="relative">
                        <Droplets className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <select
                          required
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all appearance-none bg-white"
                        >
                          <option value="">Select</option>
                          {bloodGroups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Gender
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <label key={gender} className="relative">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="sr-only"
                          />
                          <div className={`p-3 border-2 rounded-xl text-center cursor-pointer transition-all ${
                            formData.gender === gender
                              ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}>
                            <span className="text-sm font-medium">{gender}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email address"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className={`mt-3 space-y-2 transition-all duration-200 ${
                      passwordFocused || formData.password ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                    }`}>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          {passwordValidation.hasMinLength ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${
                            passwordValidation.hasMinLength ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            At least 6 characters
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {passwordValidation.hasUpperCase ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${
                            passwordValidation.hasUpperCase ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            One uppercase letter (A-Z)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {passwordValidation.hasSpecialChar ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={`text-xs ${
                            passwordValidation.hasSpecialChar ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            One special character (!@#$%^&*)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <p className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link
                        to="/terms-of-service"
                        onClick={() => {
                          // Force save current form data and step 2 before navigating
                          sessionStorage.setItem('signupFormData', JSON.stringify(formData));
                          sessionStorage.setItem('signupCurrentStep', '2');
                          sessionStorage.setItem('returnToStep2', 'true');
                          console.log('Saved form data before navigation:', formData);
                        }}
                        className="text-cyan-600 hover:text-cyan-500 font-medium underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy-policy"
                        onClick={() => {
                          // Force save current form data and step 2 before navigating
                          sessionStorage.setItem('signupFormData', JSON.stringify(formData));
                          sessionStorage.setItem('signupCurrentStep', '2');
                          sessionStorage.setItem('returnToStep2', 'true');
                          console.log('Saved form data before navigation:', formData);
                        }}
                        className="text-cyan-600 hover:text-cyan-500 font-medium underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!isStep2Valid || isLoading}
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Create Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-600 hover:text-cyan-500 font-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );   
};

export default SignupPage;