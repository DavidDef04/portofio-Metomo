import { motion } from "framer-motion";
import { useEffect } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { SiPostman } from "react-icons/si";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaPhp,
  FaDatabase,
  FaLaravel,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiFlutter,
  SiMysql,
  SiGithub,
  SiVercel,
  SiLaravel,
} from "react-icons/si";

const DevModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const Section = ({ title, topIcons, bottomIcons }) => (
    <div className="mt-8">
      <h4 className="text-xl font-semibold text-blue-400 mb-4">{title}</h4>

      <div className="relative flex flex-col items-center justify-center">
        <div className="h-1 w-full bg-gray-600 absolute top-1/2 transform -translate-y-1/2 z-0" />

        <div className="flex justify-around w-full mb-8 z-10">
          {topIcons.map(({ icon: Icon, label, color }, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                delay: idx * 0.15,
                y: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                  ease: "easeInOut",
                  delay: idx * 0.15,
                },
                opacity: { delay: idx * 0.15 },
              }}
            >
              <Icon className="text-4xl" color={color} />
              <span className="text-xs text-white">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-around w-full mt-8 z-10">
          {bottomIcons.map(({ icon: Icon, label, color }, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                delay: idx * 0.15,
                y: {
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 2,
                  ease: "easeInOut",
                  delay: idx * 0.15,
                },
                opacity: { delay: idx * 0.15 },
              }}
            >
              <Icon className="text-4xl" color={color} />
              <span className="text-xs text-white">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      layoutId="dev-modal-button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 2 }}
      exit={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4"
      onClick={onClose} // Clic hors modal ferme le modal
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-[#1e1e1e] rounded-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture si clic dans le modal
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold hover:text-red-500"
          aria-label="Close modal"
        >
          &times;
        </button>

        
        <h3 className="text-2xl font-bold mb-4 text-white">
          💻 Développement Full-Stack
        </h3>

        <p className="text-base lg:text-lg leading-relaxed text-gray-300 mb-6">
          Je conçois des applications web et mobiles en utilisant des
          technologies modernes comme Laravel, Flutter, Next.js.
          <br />
          <br />
          Voici mes principales compétences clés :
        </p>

        {/* Frontend */}
        <Section
          title="🔹 Frontend"
          topIcons={[
            { icon: FaHtml5, label: "HTML", color: "#E34F26" },
            { icon: FaCss3Alt, label: "CSS", color: "#1572B6" },
            { icon: FaJs, label: "JavaScript", color: "#F7DF1E" },
          ]}
          bottomIcons={[
            { icon: SiNextdotjs, label: "Next.js", color: "#000000" },
            { icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
            { icon: SiFlutter, label: "Flutter", color: "#02569B" },
          ]}
        />

        {/* Backend */}
        <Section
          title="🔹 Backend"
          topIcons={[
            { icon: FaPhp, label: "PHP", color: "#777BB4" },
            { icon: SiLaravel, label: "Laravel", color: "#FF2D20" },
          ]}
          bottomIcons={[
            { icon: FaGitAlt, label: "Git", color: "#F05032" },
            { icon: SiGithub, label: "GitHub", color: "#181717" },
            { icon: SiPostman, label: "Postman", color: "#FF6C37" },
          ]}
        />

        {/* Base de données */}
        <Section
          title="🔹 Base de données"
          topIcons={[
            { icon: SiMysql, label: "MySQL", color: "#4479A1" },
            { icon: FaDatabase, label: "MariaDB", color: "#003545" },
          ]}
          bottomIcons={[{ icon: FaLaravel, label: "Eloquent ORM", color: "#FF2D20" }]}
        />

        {/* DevOps */}
        <Section
          title="🔹 Outils & DevOps"
          topIcons={[
            { icon: SiVercel, label: "Vercel", color: "#000000" },
            { icon: SiGithub, label: "CI/CD", color: "#181717" },
          ]}
          bottomIcons={[
            { icon: FaGitAlt, label: "Versioning", color: "#F05032" },
            { icon: FaMobileAlt, label: "Responsive", color: "#4CAF50" },
          ]}
        />
      </motion.div>
    </motion.div>
  );
};

export default DevModal;
