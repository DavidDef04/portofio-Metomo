"use client";
import React, { useState } from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import "remixicon/fonts/remixicon.css";
import MenuOverlay from "./MenuOverlay";
import { motion } from "framer-motion";

const NavBar = ({ aboutSectionRef }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const navLinks = [
    { title: "About", path: "#about" },
    { title: "Skills", path: "#skills", isSkills: true },
    { title: "Projects", path: "#projects" },
    { title: "Contact", path: "#contact" },
  ];

  const handleNavClick = (link, event) => {
    event.preventDefault();
    setNavbarOpen(false);

    if (link.isSkills && aboutSectionRef?.current?.goToSkills) {
      aboutSectionRef.current.goToSkills();
    }
    const targetId = link.path.replace("#", "");
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full bg-black/90 z-20 shadow-lg border border-[#33353F]">
      <div className="flex justify-between items-center p-6 text-white">
        <Link
          href="/"
          className="text-3xl md:text-5xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
        >
          MDR
        </Link>

        {/* Bouton menu mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white"
          >
            <i
              className={`${
                navbarOpen ? "ri-close-line" : "ri-menu-line"
              } text-2xl text-white`}
            ></i>
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:block">
          <ul className="flex space-x-8 font-bold text-xl">
            {navLinks.map((link, index) => (
              <motion.li
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={(e) => handleNavClick(link, e)}
              >
                <NavLink href={link.path} title={link.title} />
                <span className="absolute bottom-[-8px] left-0 h-[4px] w-0 hover:bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full"></span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menu mobile avec animation */}
      <motion.div
        className={`md:hidden fixed inset-0 bg-black/30 z-30 ${
          navbarOpen ? "block" : "hidden"
        }`}
        initial={{ x: "100%" }}
        animate={{ x: navbarOpen ? 0 : "100%" }}
        transition={{ duration: 0.3 }}
        onClick={() => setNavbarOpen(false)} 
      >
        <div onClick={(e) => e.stopPropagation()}>
          {navbarOpen && (
            <MenuOverlay
              links={navLinks}
              onClose={() => setNavbarOpen(false)}
              onLinkClick={handleNavClick}
            />
          )}
        </div>
      </motion.div>
    </nav>
  );
};

export default NavBar;
