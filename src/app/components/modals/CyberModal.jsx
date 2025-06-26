 import { motion } from "framer-motion";
import { useEffect } from "react";
import {
  FaShieldAlt,
  FaNetworkWired,
  FaUserSecret,
  FaServer,
  FaLock,
  FaTools,
  FaBug,
  FaLaptopCode,
  FaProjectDiagram,
  FaDatabase,
  FaWifi,
  FaSearch,
} from "react-icons/fa";
import { SiWireshark } from "react-icons/si"; 


const SvgMetasploit = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" stroke="#EF4444" strokeWidth="4" />
    <path
      d="M20 44L44 20"
      stroke="#EF4444"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="22" cy="22" r="4" fill="#EF4444" />
    <circle cx="42" cy="42" r="4" fill="#EF4444" />
  </svg>
);


const SvgWifite = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" stroke="#6B7280" strokeWidth="4" />
    <path
      d="M20 26a12 12 0 0124 0"
      stroke="#6B7280"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M26 32a6 6 0 0112 0"
      stroke="#6B7280"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="32" cy="40" r="4" fill="#6B7280" />
  </svg>
);

const SvgAirdump = (props) => (
  <svg
    {...props}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="30" stroke="#6B7280" strokeWidth="4" />
    <path
      d="M32 44v-8M32 36l10-10M32 36l-10-10"
      stroke="#6B7280"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

const iconSize = "64px";

const CyberModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const Section = ({ title, icons }) => (
    <div className="mt-8">
      <h4 className="text-xl font-semibold text-blue-400 mb-4">{title}</h4>
      <div className="flex justify-around flex-wrap gap-8 mb-8">
        {icons.map(({ icon: Icon, label, color, isSvg }, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-center gap-2"
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
            {isSvg ? (
              <Icon width={iconSize} height={iconSize} />
            ) : (
              <Icon className="text-4xl" color={color} />
            )}
            <span className="text-xs text-white text-center max-w-[90px]">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-[#1e1e1e] rounded-lg max-w-4xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white text-xl font-bold hover:text-red-500"
          aria-label="Close modal"
        >
          &times;
        </button>

        
        <h3 className="text-2xl font-bold mb-4 text-white">
          🛡️ Cybersécurité / Pentesting & Administration Système
        </h3>

        <p className="text-base lg:text-lg leading-relaxed text-gray-300 mb-6">
          Passionné par la cybersécurité et l'administration des systèmes, je
          réalise des tests d'intrusion et gère la sécurité des réseaux,
          applications et serveurs.
        </p>

        {/* Sections avec icônes */}

        <Section
          title="🔹 Pentesting & Outils"
          icons={[
            { icon: FaBug, label: "Détection de failles", color: "#F87171" },
            {
              icon: FaProjectDiagram,
              label: "Metasploit",
              color: "#EF4444",
            },
            {
              icon: FaNetworkWired,
              label: "Nmap",
              color: "#3B82F6",
            },
            { icon: FaTools, label: "Burp Suite", color: "#F59E0B" },
            { icon: SiWireshark, label: "Wireshark", color: "#10B981" },
            { icon: FaWifi, label: "Wifite", color: "#2563EB" },
            { icon: FaWifi, label: "Airdump", color: "#8B5CF6" },
          ]}
        />

        <Section
          title="🔹 Administration Système"
          icons={[
            { icon: FaServer, label: "Gestion Serveurs", color: "#2563EB" },
            {
              icon: FaUserSecret,
              label: "Gestion Utilisateurs",
              color: "#8B5CF6",
            },
            { icon: FaTools, label: "Configuration Réseau", color: "#F97316" },
          ]}
        />

        <Section
          title="🔹 Sécurité Réseau"
          icons={[
            { icon: FaShieldAlt, label: "Firewall & VLAN", color: "#14B8A6" },
            { icon: FaLock, label: "Chiffrement", color: "#EAB308" },
            { icon: FaNetworkWired, label: "Segmentation", color: "#3B82F6" },
          ]}
        />

        <Section
          title="🔹 Ingénierie Sociale"
          icons={[
            { icon: FaLaptopCode, label: "Phishing", color: "#EF4444" },
            {
              icon: FaUserSecret,
              label: "Techniques Sociales",
              color: "#F59E0B",
            },
          ]}
        />
      </motion.div>
    </motion.div>
  );
};

export default CyberModal;