import React, {useState} from "react";
import "remixicon/fonts/remixicon.css";
import Link from "next/link";
import { motion } from "framer-motion";

const cardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
};

const ProjectCard = ({ imgUrl, title, description, gitUrl, linkUrl }) => {
  const [isExpanded, setIsExpended] = useState(false);
  const toggleDescription = () => {
    setIsExpended((prev) => !prev);
  }
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden group shadow-lg bg-[#181818] z-10"
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Image avec overlay */}
      <div
        className="h-40 md:h-52 w-full bg-cover bg-center rounded-t-xl relative"
        style={{ backgroundImage: `url(${imgUrl})` }}
      >
        {/* Overlay animé */}
        <motion.div
          className="absolute inset-0 bg-black/70 opacity-0 flex items-center justify-center gap-6 transition-opacity duration-500 z-20 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Lire toute la description */}
          <div className="relative group/icon">
            <button
              onClick={toggleDescription}
              className="h-12 w-12 rounded-full border border-white/50 hover:border-white flex items-center justify-center transition-all duration-300"
            >
              <i className="ri-file-text-line text-xl text-white/70 group-hover/icon:text-white"></i>
            </button>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {isExpanded ? "Réduire la description" : "Lire toute la description"}
            </span>
          </div>

          {/* Voir le projet */}
          <div className="relative group/icon">
            <Link
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-full border border-white/50 hover:border-white flex items-center justify-center transition-all duration-300"
            >
              <i className="ri-eye-line text-xl text-white/70 group-hover/icon:text-white"></i>
            </Link>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Voir le projet
            </span>
          </div>
        </motion.div>
      </div>

      {/* Contenu texte */}
      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className={`text-sm text-[#ADB7BE] leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-3'} `}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
