"use client";
import React, {
  useState,
  useTransition,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import TabButton from "./TabButton";
import ReadMoreModal from "./modals/ReadMoreModal";
import DevModal from "./modals/DevModal";
import CyberModal from "./modals/CyberModal";
import CertificationModal from "./modals/CertificationModal";


const AboutSection = forwardRef((props, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isCyberModalOpen, setIsCyberModalOpen] = useState(false);
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();
  const [selectedCertification, setSelectedCertification] = useState(null);

  const sectionDomRef = useRef(null);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  
  const setRefs = (node) => {
    sectionDomRef.current = node;
    inViewRef(node);
  };

 
  useImperativeHandle(ref, () => ({
    goToSkills: () => {
      startTransition(() => {
        setTab("skills");
      });
      sectionDomRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  }));

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const TAB_DATA = [
    {
      title: "Skills",
      id: "skills",
      content: (
        <ul className="list-disc pl-5 space-y-4">
          <li
            onClick={() => setIsDevModalOpen(true)}
            className="relative group cursor-pointer font-medium text-blue-400 hover:text-white transition"
          >
            <motion.div layoutId="dev-modal-button" className="inline-block" />
            💻 Full-Stack Development (Web & Mobile)
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full"></span>
          </li>
          <li
            onClick={() => setIsCyberModalOpen(true)}
            className="relative group cursor-pointer font-medium text-blue-400 hover:text-white transition"
          >
            🛡️ Cybersecurity / Pentesting
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full"></span>
          </li>
        </ul>
      ),
    },
    {
      title: "Education",
      id: "education",
      content: (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            GESTMARTER-GROUP
          </h3>
          <ul className="pl-5 space-y-2">
            {[
              {
                label: "Facebook",
                url: "https://www.facebook.com/getsmarter237",
              },
              {
                label: "Website",
                url: "https://getsmarter-group.com/",
              },
             
            ].map(({ label, url }, idx) => (
              <li
                key={idx}
                onClick={() => window.open(url, "_blank")}
                className="cursor-pointer text-blue-400 hover:text-white transition-all duration-300 border-none w-fit hover:border-white"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      ),
    },

    {
      title: "Certifications",
      id: "certifications",
      content: (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Mes certifications
          </h3>
          <ul className="pl-5 space-y-2">
            {[
              {
                label: "Professional Qualification Certificate (AQP)",
                image: "/images/certification1.jpg", 
              },
              {
                label: "Attestation de stage",
                image: "/images/certification2.jpg", 
              },
            ].map(({ label, image }, idx) => (
              <li
                key={idx}
                onClick={() => setSelectedCertification(image)}
                className="cursor-pointer text-blue-400 hover:text-white transition-all duration-300 border-none w-fit hover:border-white"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <motion.section
      ref={setRefs}
      id="about"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-white"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.9 },
            scale: { duration: 0.9 },
            rotate: {
              repeat: Infinity,
              duration: 50,
              ease: "linear",
            },
          }}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto aspect-square rounded-full overflow-hidden border-4 border-blue-500 shadow-lg z-10"
        >
          <Image
            src="/images/aboutSection.jpg"
            width={500}
            height={500}
            alt="About Image"
            className="object-cover w-full h-full"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="z-10"
        >
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>

          <p className="text-base lg:text-lg mb-4 leading-relaxed">
            Passionate about technology from a very young age, I am{" "}
            <span className="text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
              David René METOMO
            </span>
            , a full-stack developer and cybersecurity professional driven by
            the desire to build innovative, high-performance, and secure digital
            solutions. With solid expertise in{" "}
            <strong>web and mobile development</strong>, I’ve had the
            opportunity to work on a variety of projects — from simple showcase
            websites to complex applications...
          </p>

          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group text-sm font-bold text-blue-400 hover:text-white transition"
          >
            <span>Read more</span>
            <span className="absolute bottom-0 right-0 h-[3px] w-0 bg-gradient-to-l from-pink-500 via-purple-500 to-blue-500 origin-right transition-all duration-500 group-hover:w-full"></span>
          </motion.button>

          <div className="mt-6 space-x-4">
            {TAB_DATA.map(({ title, id }) => (
              <TabButton
                key={id}
                title={title}
                selectTab={() => handleTabChange(id)}
                active={tab === id}
              />
            ))}

            <div className="mt-8">
              {TAB_DATA.find((t) => t.id === tab).content}
            </div>
          </div>
        </motion.div>
      </div>

      {/* === Modals === */}
      <AnimatePresence>
        {isModalOpen && <ReadMoreModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {isDevModalOpen && (
          <DevModal onClose={() => setIsDevModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCyberModalOpen && (
          <CyberModal onClose={() => setIsCyberModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCertification && (
          <CertificationModal
            imageSrc={selectedCertification}
            onClose={() => setSelectedCertification(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
});

export default AboutSection;
