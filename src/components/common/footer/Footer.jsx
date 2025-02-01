import React from 'react';
import { FiGithub, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-blue-100">
              © {currentYear} D.X. Software de Gestión Open Source.
            </div>

            {/* Made by Section */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-100">Hecho con</span>
              <FiHeart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm text-blue-100">por</span>
              <a
                href="https://github.com/NebyX1"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <FiGithub className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-semibold bg-gradient-to-r from-blue-200 to-indigo-200 text-transparent bg-clip-text hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                  NebyX
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;