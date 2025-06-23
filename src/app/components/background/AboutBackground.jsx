import React from "react";

const AboutBackground = () => {
  return (
    <div className="absolute inset-0 z-1 max-w-7xl mx-auto px-8 md:px-16 w-full h-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover translate-y-[135px]"
      >
        <source src="/images/background/sectionApropos.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <div className="bg-black relative bg-opacity-60 h-full w-full"></div>
    </div>
  );
};

export default AboutBackground;
