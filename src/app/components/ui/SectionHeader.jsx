"use client";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function SectionHeader({
  label,
  title,
  titleAccent,
  description,
  align = "left",
}) {
  const alignClass =
    align === "center" ? "text-center items-center mx-auto" : "text-left items-start";

  return (
    <motion.header
      className={`flex flex-col gap-5 max-w-2xl mb-16 md:mb-20 ${alignClass}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {label && (
        <motion.span className="label-mono" variants={fadeUp} custom={0}>
          {label}
        </motion.span>
      )}
      <motion.h2
        className="font-display text-h1 text-bone font-semibold"
        variants={fadeUp}
        custom={1}
      >
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="font-serif italic font-normal text-champagne">
              {titleAccent}
            </span>
          </>
        )}
      </motion.h2>
      {description && (
        <motion.p
          className="text-mist max-w-xl leading-relaxed"
          variants={fadeUp}
          custom={2}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        className="h-px w-16 bg-gradient-to-r from-champagne/60 to-transparent mt-2"
        variants={fadeUp}
        custom={3}
      />
    </motion.header>
  );
}
