import { motion } from "framer-motion";
import { useEffect } from "react";

const ReadMoreModal = ({ onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4"
    >
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-[#1e1e1e] rounded-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative"
        style={{ WebkitOverflowScrolling: "touch" }} 
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-2 right-4 text-white text-xl font-bold hover:text-red-500"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-4 text-white">More About Me</h3>
        <p className="text-base lg:text-lg leading-relaxed text-gray-300">
          Passionate about technology from a very young age, I am{" "}
          <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
            David René METOMO
          </span>
          , a full-stack developer and cybersecurity professional driven
          by curiosity and a desire to solve complex problems. With a strong
          foundation in software development and a keen interest in ethical
          hacking, I strive to create secure and efficient solutions that
          positively impact users and businesses alike. Over the years, I’ve had the
          opportunity to work on a wide range of projects that span both
          web and mobile development. My technical expertise includes a variety of
          frameworks and languages such as React, Laravel, Flutter, Node.js,
          and TailwindCSS. Each project I undertake is built with a focus on
          creating seamless user experiences, robust functionality, and
          ensuring security at every level of the development process.
          <br />
          <br />
          In addition to my technical skills, I am passionate about
          continuous learning and adapting to the ever-changing landscape
          of technology. Whether I am diving into the latest cybersecurity
          trends or experimenting with new frameworks, I’m always excited
          about the next challenge. My approach to development goes beyond
          just coding — I work hard to make sure my solutions are
          sustainable, user-friendly, and meet the needs of the people they
          are designed for. I firmly believe that technology should be
          accessible to everyone, and I’m committed to helping bridge the
          gap between innovation and the real-world applications that make a
          difference.
          <br />
          <br />
          Thanks to my expertise in both development and cybersecurity, I
          take a holistic approach to each project I work on. From building
          efficient back-end APIs to designing intuitive and visually
          striking front-end interfaces, I strive to create solutions that
          are both high-performing and secure. I’ve worked with various
          teams and stakeholders, leading projects, contributing to
          technical discussions, and mentoring junior developers along the
          way.
          <br />
          <br />
          This portfolio is a reflection of my journey, and I’m excited to
          continue pushing the boundaries of what’s possible with technology.
          If you’re looking to collaborate on an exciting project or want
          to talk tech, feel free to reach out. I’m always open to new
          opportunities, whether it’s for professional work or just to
          connect and share ideas. Welcome to my digital world!
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ReadMoreModal;
