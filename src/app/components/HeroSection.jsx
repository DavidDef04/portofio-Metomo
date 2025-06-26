"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HeroBackground from "./background/HeroBackground";
import DownloadCV from "./DownloadCV";
import "../../../src/app/styles/HeroSection.css"; 

const HeroSection = () => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      id="home"
      className="relative lg:py-16"
    >
      <HeroBackground />
      <div className="HeroSection mt-20 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 mb-4">
        {/* Texte animé */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="hero-text hero-text-501 col-span-1 sm:col-span-7 place-self-center text-center sm:text-left justify-self-start z-10"
        >
          <h1 className=" text-white mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Hello, I'm
            </span>
            <br />
            <span className="block">
              <TypeAnimation
                sequence={["David René", 3000, "METOMO", 3000]}
                wrapper="span"
                speed={45}
                repeat={Infinity}
              />
            </span>
          </h1>

          <p className="text-[#ADB7BE] text-sm sm:text-base md:text-lg mb-6 lg:text-xl leading-relaxed">
            I'm a technology enthusiast, specializing in both{" "}
            <span className="font-semibold text-2xl sm:text-3xl text-blue-500">
              full-stack development
            </span>{" "}
            (web & mobile) and{" "}
            <span className="font-semibold text-2xl sm:text-3xl text-purple-500">
              <TypeAnimation
                sequence={["cybersecurity", 3000, "pentesting", 3000]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span>{" "}
            (Pentest). My goal? To create innovative, high-performance, and
            secure solutions, while pushing the boundaries of coding and
            security.
            <br />
            <br />
            Explore my projects, skills, and world through this portfolio,
            designed with ❤️, technical flair, and creativity.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <motion.button
              whileTap={{ scale: 0.9, rotate: -2 }}
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="px-6 py-4 rounded-full w-full sm:w-auto text-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold border-2 border-transparent hover:scale-[1.1] hover:bg-transparent hover:border-white transition duration-300"
            >
              Contact Me
            </motion.button>

            <motion.div whileTap={{ scale: 0.9, rotate: 2 }}>
              <DownloadCV
                className="px-3 py-3 rounded-full w-full sm:w-auto text-center bg-transparent hover:scale-[1.1] hover:bg-blue-500 hover:border-none font-extralight text-white border border-white duration-75"
                label="Download CV"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Image animée */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="hero-image hero-image-501 col-span-1 sm:col-span-5 flex justify-center items-center place-self-center mt-6 lg:mt-0 z-15"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="image-wrapper rounded-full w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] bg-white/20 backdrop-blur backdrop-brightness-125 border border-white/10 overflow-hidden relative"
          >
            <Image
              src="/images/Profil.jpg"
              alt="Profile Picture"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover z-20 brightness-[1.4]"
              width={300}
              height={300}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
