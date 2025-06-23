"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "./NavLink";

const listVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.8, 0.25, 1],
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
};

const MenuOverlay = ({ links, onClose, onLinkClick }) => {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
        onClick={onClose}
      />

      <motion.ul
        key="menu"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center space-y-6 text-white md:hidden"
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-3xl"
        >
          <i className="ri-close-line"></i>
        </button>

        {links.map((link, index) => (
          <motion.li key={index} variants={itemVariants}>
            <span
              className="text-xl font-medium cursor-pointer"
              onClick={(e) => onLinkClick(link, e)}
            >
              <NavLink href={link.path} title={link.title} />
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </AnimatePresence>
  );
};

export default MenuOverlay;
