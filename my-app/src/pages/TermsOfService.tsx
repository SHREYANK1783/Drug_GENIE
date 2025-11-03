import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => {
                // Ensure we return to Step 2 of signup
                sessionStorage.setItem('signupCurrentStep', '2');
                sessionStorage.setItem('returnToStep2', 'true');
                
                // Always navigate to /signup (don't use browser back)
                navigate('/signup');
              }}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            </div>
          </div>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Drug GENIE ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service. These Terms of Service ("Terms") govern your use of 
              our healthcare application and related services provided by Drug GENIE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Drug GENIE is a healthcare application that provides:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Medication reminder and management services</li>
              <li>Drug interaction checking and medicine information</li>
              <li>Blood bank and donation coordination services</li>
              <li>AI-powered health assistant</li>
              <li>Health-related notifications and alerts</li>
              <li>Medical appointment reminders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Medical Disclaimer</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-800 font-semibold">IMPORTANT MEDICAL DISCLAIMER</p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Drug GENIE IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Always seek advice from qualified healthcare providers</li>
                <li>Never disregard professional medical advice because of our service</li>
                <li>Do not delay seeking medical treatment based on information from our app</li>
                <li>Drug interaction information is for educational purposes only</li>
                <li>Emergency situations require immediate medical attention, not app consultation</li>
                <li>We do not provide medical diagnoses or treatment recommendations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Use the Service for any unlawful purpose or illegal activity</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity</li>
              <li>Transmit viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Share false or misleading health information</li>
              <li>Use the Service to provide medical advice to others</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Blood Donation Services</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Our blood bank feature connects potential donors with recipients. You understand that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We facilitate connections but do not provide medical screening</li>
                <li>All medical testing and screening must be done by qualified facilities</li>
                <li>We are not responsible for the safety or quality of blood donations</li>
                <li>You must comply with all applicable blood donation regulations</li>
                <li>False information about blood type or health status is prohibited</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content, features, and functionality are owned by 
                Drug GENIE and are protected by international copyright, trademark, patent, 
                trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You retain ownership of any content you submit, but grant us a license to use, 
                modify, and display such content in connection with the Service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, 
              and protect your information when you use our Service. By using our Service, you 
              agree to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations of Liability</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                We disclaim all warranties, express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Merchantability and fitness for a particular purpose</li>
                <li>Accuracy, reliability, or completeness of information</li>
                <li>Uninterrupted or error-free operation</li>
                <li>Security of data transmission</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>IN NO EVENT SHALL DRUG GENIE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING MEDICAL COMPLICATIONS 
                OR HEALTH-RELATED ISSUES.</strong>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to defend, indemnify, and hold harmless Drug GENIE and its affiliates 
              from and against any claims, damages, costs, and expenses (including attorney's fees) 
              arising from or related to your use of the Service, violation of these Terms, or 
              infringement of any rights of another.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately, 
                without prior notice, for any reason, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Breach of these Terms</li>
                <li>Violation of applicable laws</li>
                <li>Fraudulent or harmful activity</li>
                <li>Extended periods of inactivity</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use the Service will cease immediately, but 
                provisions that should survive termination will remain in effect.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of 
              [Your Jurisdiction], without regard to its conflict of law provisions. Any disputes 
              arising from these Terms or your use of the Service shall be subject to the 
              exclusive jurisdiction of the courts in [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision 
              is material, we will provide at least 30 days notice prior to any new terms taking 
              effect. What constitutes a material change will be determined at our sole discretion. 
              Your continued use of the Service after any such changes constitutes acceptance of 
              the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is held to be unenforceable or invalid, such 
              provision will be changed and interpreted to accomplish the objectives of such 
              provision to the greatest extent possible under applicable law, and the remaining 
              provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> legal@drugenie.com</p>
              <p className="text-gray-700"><strong>Address:</strong> Drug GENIE Legal Department</p>
              <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service, together with our Privacy Policy, constitute the sole and 
              entire agreement between you and Drug GENIE regarding the Service and supersede all 
              prior and contemporaneous understandings, agreements, representations, and warranties, 
              both written and oral, regarding the Service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
