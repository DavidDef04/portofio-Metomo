"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/motion";
import { whatsappLink } from "@/config/contact";
import { getDict, homePath } from "@/lib/i18n";

const NAV_IDS = ["home", "projects", "achievements", "about", "contact"];

/** Sélecteur FR / EN : lien vers l'autre version, en gardant la section. */
function LangSwitch({ lang, label, className = "" }) {
  const switchTo = (target, e) => {
    if (target === lang) {
      e.preventDefault();
      return;
    }
    try {
      localStorage.setItem("metomo-lang", target);
    } catch {
      /* préférence non mémorisée */
    }
    // Conserver la section affichée (#projects…)
    e.currentTarget.href = homePath(target) + (window.location.hash || "");
  };
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={label}>
      {["fr", "en"].map((code) => (
        <a
          key={code}
          href={homePath(code)}
          hrefLang={code}
          lang={code}
          aria-current={code === lang ? "true" : undefined}
          onClick={(e) => switchTo(code, e)}
          className={code === lang ? "is-active" : ""}
        >
          {code.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

export default function PremiumNav({ lang = "fr" }) {
  const t = getDict(lang).nav;
  const navItems = NAV_IDS.map((id) => ({ id, label: t[id], href: `#${id}` }));
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      const pos = window.scrollY + 120;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActive(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: ease.outExpo, delay: 0.2 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-surface/80 backdrop-blur-xl border-b border-border"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-[calc(72rem+4rem)] mx-auto px-[var(--space-gutter)] flex items-center justify-between">
          <Link
            href="#home"
            onClick={(e) => go(e, "home")}
            className="group flex items-center gap-3"
          >
            <span className="font-display text-lg font-bold text-bone tracking-tight">
              M<span className="text-champagne">.</span>
            </span>
            <span className="hidden sm:block label-mono !text-[0.65rem] !tracking-[0.22em] text-mist group-hover:text-champagne transition-colors">
              METOMO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => go(e, item.id)}
                className={`relative px-4 py-2 text-sm transition-colors duration-300 ${
                  active === item.id ? "text-bone" : "text-mist hover:text-bone"
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-4 right-4 h-px bg-champagne"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LangSwitch lang={lang} label={t.language} />
            <a
              href={whatsappLink(getDict(lang).misc.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium !py-2.5 !px-5 !text-[0.7rem] !bg-[#25D366] !text-white !border-transparent hover:!brightness-110"
            >
              WhatsApp
            </a>
          </div>

          <div className="md:hidden flex items-center gap-3">
          <LangSwitch lang={lang} label={t.language} />
          <button
            type="button"
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 border border-border"
            style={{ borderRadius: "var(--radius-cut)" }}
            onClick={() => setOpen(!open)}
            aria-label={open ? t.closeMenu : t.openMenu}
          >
            <span className={`block w-5 h-px bg-bone transition-transform ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-5 h-px bg-bone transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-bone transition-transform ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-void/95 backdrop-blur-lg pt-24 px-6"
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.id)}
                    className="font-display text-3xl text-bone"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={whatsappLink(getDict(lang).misc.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium !bg-[#25D366] !text-white !border-transparent mt-4 w-fit"
              >
                WhatsApp
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20 md:h-24" aria-hidden="true" />
    </>
  );
}
