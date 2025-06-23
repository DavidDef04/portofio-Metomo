'use client';
import React from 'react';
import { motion } from "framer-motion";


const variants = {
  default: {width: 0},
  active: {width: "calc(100% - 0.75rem)"},
};

const TabButton = ({ active, selectTab, title }) => {
  const buttonClasses = active
    ? 'text-white border-b border-purple-500'
    : 'text-[#ADB7BE]';

  return (
    <button onClick={selectTab} className="group relative px-3 py-1">
      <span
        className={`relative z-10 font-semibold text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-pink-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-700 ease-out ${buttonClasses}`}
      >
        {title}
      </span>
    </button>
  );
};

export default TabButton;
