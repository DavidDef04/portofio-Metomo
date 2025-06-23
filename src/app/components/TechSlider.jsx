"use client";
import React from "react";
import { motion } from "framer-motion";

const technologies = [
  // Fullstack PHP
  { name: "PHP", src: "/tech/php.svg" },
  { name: "MySQL", src: "/tech/mysql.svg" },
  { name: "Laravel", src: "/tech/laravel.svg" },
  { name: "Symfony", src: "/tech/symfony.svg" },
  { name: "JavaScript", src: "/tech/javascript.svg" },
  { name: "React", src: "/tech/react.svg" },
  { name: "Node.js", src: "/tech/nodejs.svg" },

  // Pentesting / Cybersecurity
  { name: "Kali Linux", src: "/tech/kali-linux.svg" },
  { name: "Metasploit", src: "/tech/metasploit.svg" },
  { name: "Nmap", src: "/tech/nmap.svg" },
  { name: "Wireshark", src: "/tech/wireshark.svg" },
  { name: "Burp Suite", src: "/tech/burp-suite.svg" },
  { name: "Python", src: "/tech/python.svg" },
  { name: "OWASP", src: "/tech/owasp.svg" },
];

// Double le tableau pour avoir l'effet infinite scroll seamless
const doubledTechnologies = [...technologies, ...technologies];

const slideDuration = 23; 

const TechSlider = () => {
  return (
    <section
      id="technologies"
      className="relative top-3 overflow-hidden bg-white py-12"
      aria-label="Technologies utilisées en développement fullstack et pentesting"
    >
      <h2 className="text-white text-3xl font-bold mb-8 text-center">
        Technologies & Outils
      </h2>
      <motion.div
        className="flex w-max gap-12"
        style={{ whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: slideDuration,
        }}
      >
        {doubledTechnologies.map(({ name, src }, index) => (
          <div
            key={`${name}-${index}`}
            className="flex flex-col items-center justify-center"
            style={{ minWidth: 120 }}
          >
            <img
              src={src}
              alt={name}
              className="h-20 w-auto object-contain filter brightness-90"
              loading="lazy"
            />
            <span className="text-white mt-2 text-sm select-none">{name}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TechSlider;
