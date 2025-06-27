import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-700 z-10 text-white text-center bg-[#121212]">
      <div className="pt-4 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <p className="italic text-xs sm:text-sm md:text-base">
          © 2025 David Rene{' '}
          <span className="text-transparent font-bold bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            METOMO
          </span>. All rights reserved.
        </p>
      </div>
      <div className="pb-4 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <p className="italic text-xs sm:text-sm md:text-base">
          Built with Next.js and Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
