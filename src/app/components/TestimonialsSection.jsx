"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaArrowRight } from "react-icons/fa";
import SectionHeader from "./ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getDict } from "@/lib/i18n";

/** Témoignages clients (saisis dans le CMS). Rien n'est affiché si la liste est vide. */
export default function TestimonialsSection({ testimonials = [], lang = "fr" }) {
  const t = getDict(lang).testimonials;
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="section-shell relative">
      <SectionHeader label={t.label} title={t.title} titleAccent={t.accent} />
      <motion.div
        className={`grid gap-px bg-border ${testimonials.length > 1 ? "md:grid-cols-2" : "max-w-3xl"}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {testimonials.map((item, i) => (
          <motion.figure
            key={item.id || i}
            variants={fadeUp}
            custom={i}
            className="surface-card !rounded-none p-8 md:p-10 flex flex-col"
          >
            <FaQuoteLeft className="text-champagne/50 text-2xl mb-6" aria-hidden />
            <blockquote className="font-serif italic text-xl md:text-2xl text-bone leading-snug mb-8 flex-1">
              {lang === "en" ? `“${item.quote}”` : `« ${item.quote} »`}
            </blockquote>
            <figcaption className="flex flex-wrap items-end justify-between gap-4 pt-6 border-t border-border">
              <div>
                <p className="text-bone font-medium">{item.name}</p>
                <p className="text-mist text-sm">
                  {[item.role, item.company].filter(Boolean).join(" — ")}
                </p>
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-champagne hover:gap-3 transition-all"
                >
                  {t.visit} <FaArrowRight className="text-[0.7rem]" aria-hidden />
                </a>
              )}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
