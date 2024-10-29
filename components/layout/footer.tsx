import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useTheme, useThemeStyles } from '../layout/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const themeStyles = useThemeStyles();

  const linkClass = `transition-colors duration-200 ease-in-out ${
    theme === 'light' ? 'hover:text-primary' : 'hover:text-primary-dark'
  }`;

  const iconClass = `transition-colors duration-200 ease-in-out ${
    theme === 'light' ? 'text-gray-500 hover:text-primary' : 'text-gray-400 hover:text-primary-dark'
  }`;

  return (
    <footer className={`mt-12 border-t ${themeStyles.backgroundColor} ${themeStyles.color}`}>
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-primary' : 'text-primary-dark'}`}>
              FraudScout
            </h3>
            <p className="text-sm mb-6">Smart Solutions for Safer Transactions.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className={iconClass} aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className={iconClass} aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://linkedin.com" className={iconClass} aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className={linkClass}>Features</Link></li>
              <li><Link href="#" className={linkClass}>Pricing</Link></li>
              <li><Link href="#" className={linkClass}>FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className={linkClass}>About Us</Link></li>
              <li><Link href="#" className={linkClass}>Contact</Link></li>
              <li><Link href="#" className={linkClass}>Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className={linkClass}>Privacy Policy</Link></li>
              <li><Link href="#" className={linkClass}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} mt-8 pt-6 flex flex-col md:flex-row justify-between items-center`}>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            &copy; {new Date().getFullYear()} FraudScout. All rights reserved.
          </p>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <a href="mailto:asifoned@gmail.com" className={`${linkClass} flex items-center space-x-1`}>
              <FaEnvelope size={16} />
              <span>asifoned@gmail.com</span>
            </a>
            <a href="tel:+919444202524" className={`${linkClass} flex items-center space-x-1`}>
              <FaPhone size={16} />
              <span>+91 9444202524</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;