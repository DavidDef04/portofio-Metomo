"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "remixicon/fonts/remixicon.css";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const iconVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.2, color: "#fff" },
};

const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
};

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const popupVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const EmailSection = () => {
  const controls = useAnimation();
  const [ref, isInView] = useInView({ triggerOnce: false, threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    } else{
      controls.start({ opacity: 0, y: 50 });
    }
  }, [isInView, controls]);

  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [popupCount, setPopupCount] = useState(0); // Pour forcer remount popup

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setProgress(0);
    setShowPopup(true);
    setPopupCount((c) => c + 1); // incrémente à chaque apparition du popup

    const duration = 4000;
    const intervalTime = 50;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      if (elapsed >= duration) clearInterval(interval);
    }, intervalTime);

    const data = {
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/send";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const resData = await response.json();
    console.log(resData);

    clearInterval(interval);
    setProgress(100);

    if (response.status === 200) {
      setEmailSubmitted(true);
      e.target.reset();
    } else {
      setError("Erreur lors de l'envoi, veuillez réessayer.");
    }

    setTimeout(() => {
      setShowPopup(false);
      setIsLoading(false);
      setProgress(0);
    }, duration);
  };

  return (
    <>
      <motion.section
        ref={ref}
        id="contact"
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
        className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative z-10"
      >
        <div
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, #4f46e5, transparent)",
          }}
          className="rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-y-1/2"
        ></div>

        {/* Texte et social media */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xl font-bold text-white my-2 z-10"
        >
          <h5 className="text-xl font-bold z-10">Let's Connect...</h5>
          <p className="text-[#ADB7BE] mb-5 max-w-md z-10">
            I'm currently looking for new opportunities, my inbox is always open.
            Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <br />
          <div className="socials flex flex-row gap-4 z-10">
            {[
              { href: "https://github.com/DavidDef04", icon: "ri-github-fill", color: "white" },
              { href: "https://www.linkedin.com/in/david-rené-metomo-elogo-5b0432314", icon: "ri-linkedin-box-fill", color: "#0077B5" },
              { href: "https://facebook.com/davidrenemetomo", icon: "ri-facebook-box-fill", color: "#1877F2" },
              { href: "https://wa.me/237656156546", icon: "ri-whatsapp-fill", color: "green" },
            ].map(({ href, icon, color }, i) => (
              <motion.div
                key={href}
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer z-10 transition-transform transform duration-300"
              >
                <Link href={href} target="_blank" rel="noopener noreferrer">
                  <i
                    className={`${icon} text-3xl`}
                    style={{ color }}
                  ></i>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <form className="flex flex-col z-10" onSubmit={handleSubmit}>
            {[
              {
                label: "Your email",
                id: "email",
                type: "email",
                name: "email",
                placeholder: "exemple@gmail.com",
                required: true,
              },
              {
                label: "Subject",
                id: "subject",
                type: "text",
                name: "subject",
                placeholder: "Just saying hi!",
                required: true,
              },
            ].map(({ label, id, type, name, placeholder, required }, i) => (
              <motion.div
                key={id}
                className="mb-2 z-10"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <label
                  htmlFor={id}
                  className="text-white block mb-2 font-medium text-sm"
                >
                  {label}
                </label>
                <input
                  name={name}
                  autoComplete={type === "email" ? "email" : undefined}
                  className="bg-[#181818] border border-[#121212] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-[#ADB7BE]"
                  type={type}
                  id={id}
                  placeholder={placeholder}
                  required={required}
                />
              </motion.div>
            ))}

            <motion.div
              className="mb-6 z-10"
              variants={inputVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <label
                htmlFor="message"
                className="text-white block text-sm mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                name="message"
                className="bg-[#181818] border border-[#121212] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder:text-[#ADB7BE]"
                id="message"
                rows="4"
                placeholder="Tell me about your ideas!"
                required
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isLoading}
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`px-6 py-3 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-extrabold border-2 border-transparent hover:bg-transparent hover:border-white transition duration-300 z-10 flex items-center justify-center gap-2 ${
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Envoi...
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.section>

      {/* Popup avec barre de progression */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            key={`popup-${popupCount}`} // clé unique pour forcer remount et rejouer animation
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded shadow-lg z-50 w-72"
          >
            <p className="font-semibold mb-2">Message envoyé avec succès !</p>
            <div className="w-full h-2 bg-green-300 rounded overflow-hidden">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailSection;
