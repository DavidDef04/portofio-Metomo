"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRefetchOnFocus } from "@/lib/useRefetchOnFocus";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { ease, fadeUp, staggerContainer } from "@/lib/motion";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import AmbientBackground from "./ui/AmbientBackground";
import { whatsappLink } from "@/config/contact";

const socialLinkMotion = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.55 + i * 0.09, duration: 0.55, ease: ease.outExpo },
  }),
};

const ModernHeroSection = () => {
  const [hero, setHero] = useState(DEFAULT_SITE_CONTENT.hero);
  const [roleIndex, setRoleIndex] = useState(0);

  const roles = hero.roles?.length ? hero.roles : DEFAULT_SITE_CONTENT.hero.roles;

  const loadHero = useCallback(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.hero) setHero(d.hero);
      })
      .catch(() => {});
  }, []);

  useRefetchOnFocus(loadHero);

  useEffect(() => {
    const t = setInterval(
      () => setRoleIndex((i) => (i + 1) % roles.length),
      3200
    );
    return () => clearInterval(t);
  }, [roles.length]);

  const heroSocialLinks = useMemo(
    () => [
      {
        label: "WhatsApp",
        href: whatsappLink(),
        external: true,
        icon: FaWhatsapp,
        variant: "whatsapp",
      },
      {
        label: "GitHub",
        href: hero.social?.github || DEFAULT_SITE_CONTENT.hero.social.github,
        external: true,
        icon: FaGithub,
        variant: "default",
      },
      {
        label: "LinkedIn",
        href: hero.social?.linkedin || DEFAULT_SITE_CONTENT.hero.social.linkedin,
        external: true,
        icon: FaLinkedin,
        variant: "default",
      },
      {
        label: "Email",
        href: hero.social?.email || DEFAULT_SITE_CONTENT.hero.social.email,
        external: false,
        icon: FaEnvelope,
        variant: "default",
      },
    ],
    [hero.social]
  );

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center"
    >
      <AmbientBackground />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <motion.div className="relative z-10 w-full max-w-[calc(72rem+4rem)] mx-auto px-[var(--space-gutter)] pt-8 pb-24 md:pb-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center"
        >
          <div className="order-2 lg:order-1 relative z-10">
            <motion.p className="label-mono mb-6" variants={fadeUp} custom={0}>
              {hero.eyebrow}
            </motion.p>

            <motion.h1
              className="font-display text-display text-bone font-bold mb-6"
              variants={fadeUp}
              custom={1}
            >
              {hero.nameLine1}
              <br />
              <span className="text-champagne">{hero.nameHighlight}</span>
            </motion.h1>

            <motion.div
              className="h-12 mb-8 overflow-hidden"
              variants={fadeUp}
              custom={2}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.55, ease: ease.outExpo }}
                  className="font-serif italic text-xl md:text-2xl text-silver"
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            <motion.p
              className="text-mist max-w-2xl leading-relaxed mb-10 whitespace-pre-line"
              variants={fadeUp}
              custom={3}
            >
              {hero.intro}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              custom={4}
            >
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium btn-premium--primary"
              >
                {hero.whatsappCta}
              </a>
              <a
                href={hero.cvUrl}
                download
                className="btn-premium btn-premium--ghost"
              >
                {hero.cvLabel}
              </a>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3 mt-14 pt-8 border-t border-border"
              variants={fadeUp}
              custom={5}
            >
              {heroSocialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    custom={i}
                    variants={socialLinkMotion}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`hero-social-link label-mono !text-[0.65rem] ${
                      link.variant === "whatsapp" ? "hero-social-link--whatsapp" : ""
                    }`}
                    aria-label={link.label}
                  >
                    <Icon aria-hidden />
                    <span>{link.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            className="order-1 lg:order-2 relative"
            variants={fadeUp}
            custom={2}
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
              <div
                className="absolute -inset-4 border border-border"
                style={{ borderRadius: "var(--radius-md)" }}
              />
              <div className="clip-chamfer relative overflow-hidden bg-elevated aspect-[4/5]">
                <Image
                  src="/images/image.png"
                  alt={`${hero.nameLine1} ${hero.nameHighlight} — Développeur full-stack`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover object-top grayscale-[20%] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-elevated/90 via-transparent to-transparent pointer-events-none" />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-4 md:-left-8 surface-card px-5 py-4 max-w-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, ease: ease.outExpo }}
              >
                <p className="label-mono !text-[0.6rem] mb-1">{hero.statusLabel}</p>
                <p className="text-sm text-bone font-medium leading-snug">
                  {hero.statusText}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.a
          href="#achievements"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 label-mono !text-[0.6rem] text-mist hover:text-champagne transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span>Explorer</span>
          <motion.span
            className="block w-px h-8 bg-gradient-to-b from-champagne/50 to-transparent"
            animate={{ scaleY: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default ModernHeroSection;
