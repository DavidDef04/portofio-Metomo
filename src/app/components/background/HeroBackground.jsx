import React from 'react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden min-h-screen">
      <video 
        autoPlay
        muted
        loop
        className="w-full h-full object-cover rotate-180 sm:translate-y-[-300px] translate-y-0"
      >
        <source src="/images/background/section1.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay léger sur mobile */}
      <div className="sm:hidden absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/10" />
    </div>
  );
};

export default HeroBackground;
