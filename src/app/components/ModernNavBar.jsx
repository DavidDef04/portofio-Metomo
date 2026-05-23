"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaBriefcase, 
  FaEnvelope, 
  FaCode,
  FaTrophy,
  FaGraduationCap
} from "react-icons/fa";

const ModernNavBar = ({ aboutSectionRef }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef(null);

  const navItems = [
    { id: "home", label: "Accueil", icon: FaHome, href: "#home" },
    { id: "about", label: "À Propos", icon: FaUser, href: "#about" },
    { id: "achievements", label: "Compétences", icon: FaTrophy, href: "#achievements" },
    { id: "projects", label: "Réalisations", icon: FaBriefcase, href: "#projects" },
    { id: "contact", label: "Contact", icon: FaEnvelope, href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Détecter la section active
      const sections = navItems.map(item => item.id);
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <>
      {/* NavBar */}
      <motion.nav
        ref={navRef}
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? -10 : 0 }}
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? "bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-purple-500/20" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0"
            >
              <Link 
                href="#home" 
                onClick={(e) => handleNavClick(e, "home")}
                className="group flex items-center gap-2"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="/images/Profil.jpg" 
                    className="w-full h-full rounded-md object-cover" 
                    alt="Profile David René METOMO"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%237c3aed'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='white'%3EDM%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <span className="text-white font-bold text-xl hidden sm:block group-hover:text-purple-400 transition-colors duration-300">
                  David René METOMO
                </span>
              </Link>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 group ${
                      activeSection === item.id
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="text-sm" />
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-white hover:bg-purple-500/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <FaTimes key="close" className="text-lg" />
                ) : (
                  <FaBars key="menu" className="text-lg" />
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t border-purple-500/20"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        activeSection === item.id
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <item.icon className="text-lg" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed nav + topbar */}
      <div className="h-20" />
    </>
  );
};

export default ModernNavBar;
