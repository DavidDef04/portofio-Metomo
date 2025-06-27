import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToHome = () => {
    const heroSection = document.getElementById("home");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={scrollToHome}
      className={`
        fixed z-50 bottom-6 right-6 sm:bottom-8 sm:right-8 
        p-3 sm:p-4 md:p-5 
        rounded-full 
        bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 
        text-white text-lg sm:text-xl md:text-2xl 
        shadow-lg 
        transition-all duration-500 ease-in-out
        transform hover:scale-105
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
      `}
    >
      ↑
    </button>
  );
};

export default ScrollToTopButton;
