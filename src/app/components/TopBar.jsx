"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter,
  FaSun,
  FaMoon,
  FaGlobe,
  FaWhatsapp
} from "react-icons/fa";

const TopBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState("FR");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/DavidDef04", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/david-rené-metomo-elogo-5b0432314/", label: "LinkedIn" },
    { icon: FaWhatsapp, href: "https://wa.me/237656156546", target: "_blank", label: "Whatsapp" },
  ];

  const contactInfo = [
    { icon: FaEnvelope, text: "metomo442@gmail.com", href: "mailto:metomo442@gmail.com" },
    { icon: FaPhone, text: "+237 656 156 546", href: "tel:+237656156546" },
    { icon: FaPhone, text: "+237 679 413 963", href: "tel:+237679413963" },
    { icon: FaMapMarkerAlt, text: "Douala, Cameroun", href: "#" },
  ];

  return (
    <AnimatePresence>
      {!isScrolled && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white py-2 px-4 border-b border-purple-500/20 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs">
            
            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-4 mb-2 sm:mb-0">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-1 hover:text-purple-400 transition-colors duration-300 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="text-purple-400 group-hover:text-purple-300" />
                  <span className="hidden sm:inline font-medium">{item.text}</span>
                </motion.a>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 hover:border-purple-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon className="text-sm group-hover:text-purple-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TopBar;
