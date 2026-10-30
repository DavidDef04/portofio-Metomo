"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaShoppingCart,
  FaLayerGroup,
  FaCode,
  FaShieldAlt,
  FaTools,
  FaMobileAlt,
  FaCheck,
  FaWhatsapp,
  FaEnvelope,
  FaArrowRight,
} from "react-icons/fa";
import SectionHeader from "./ui/SectionHeader";
import AmbientBackground from "./ui/AmbientBackground";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getDict } from "@/lib/i18n";
import { whatsappLink, EMAIL } from "@/config/contact";

export const SERVICE_ICONS = {
  globe: FaGlobe,
  cart: FaShoppingCart,
  layers: FaLayerGroup,
  code: FaCode,
  shield: FaShieldAlt,
  tools: FaTools,
  mobile: FaMobileAlt,
};

/** @param {{ services?: any[], lang?: "fr" | "en" }} props */
export default function ServicesSection({ services = [], lang = "fr" }) {
  const t = getDict(lang).services;
  if (!services.length) return null;

  return (
    <section id="services" className="section-shell relative">
      <AmbientBackground />
      <SectionHeader
        label={t.label}
        title={t.title}
        titleAccent={t.accent}
        description={t.description}
      />

      <motion.div
        className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {services.map((s, i) => {
          const Icon = SERVICE_ICONS[s.icon] || FaCode;
          return (
            <motion.article
              key={s.id || s.title}
              variants={fadeUp}
              custom={i}
              data-service={s.title}
              className="surface-card !rounded-none p-7 md:p-8 flex flex-col group hover:bg-elevated/70 transition-colors duration-500"
            >
              <span
                className="flex items-center justify-center w-11 h-11 mb-6 border border-champagne/30 text-champagne bg-champagne/5"
                style={{ borderRadius: "var(--radius-sm)" }}
                aria-hidden
              >
                <Icon />
              </span>
              <h3 className="font-display text-h3 text-bone font-semibold mb-3">{s.title}</h3>
              <p className="text-mist text-sm leading-relaxed mb-5">{s.description}</p>
              {s.points?.length > 0 && (
                <ul className="space-y-2 mb-7">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-bone-dim">
                      <FaCheck className="text-teal text-[0.7rem] mt-1.5 shrink-0" aria-hidden />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={whatsappLink(t.quoteMessage(s.title))}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-sm text-champagne hover:gap-3 transition-all"
              >
                {t.quote}
                <FaArrowRight className="text-[0.7rem]" aria-hidden />
              </a>
            </motion.article>
          );
        })}
      </motion.div>

      <motion.div
        className="mt-10 surface-card p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-champagne/25"
        style={{ borderRadius: "var(--radius-md)" }}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        <div className="max-w-xl">
          <p className="font-display text-h3 text-bone font-semibold mb-2">{t.ctaTitle}</p>
          <p className="text-mist text-sm leading-relaxed">{t.ctaText}</p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={whatsappLink(getDict(lang).misc.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium !bg-[#25D366] !text-white !border-transparent hover:!brightness-110"
          >
            <FaWhatsapp aria-hidden /> {t.ctaWhatsapp}
          </a>
          <a
            href={`mailto:${EMAIL}?subject=${encodeURIComponent(t.emailSubject)}`}
            className="btn-premium btn-premium--ghost"
          >
            <FaEnvelope aria-hidden /> {t.ctaEmail}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
