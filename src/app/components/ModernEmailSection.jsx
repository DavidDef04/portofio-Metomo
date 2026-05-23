"use client";
import React, { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import SectionHeader from "./ui/SectionHeader";
import AmbientBackground from "./ui/AmbientBackground";
import SubmitProgressModal from "./SubmitProgressModal";
import { whatsappLink, EMAIL, PHONE_DISPLAY } from "@/config/contact";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((m) => m.Turnstile),
  { ssr: false }
);

const inputClass =
  "w-full px-4 py-3 bg-elevated border border-border text-bone placeholder-mist/60 focus:outline-none focus:border-champagne/50 transition-colors text-sm";

const INITIAL_FORM = {
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const ModernEmailSection = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState("idle");
  const [modalError, setModalError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const submittingRef = useRef(false);

  const canSubmit =
    Boolean(TURNSTILE_SITE_KEY) &&
    Boolean(turnstileToken) &&
    formData.email &&
    formData.phone &&
    formData.subject &&
    formData.message &&
    !submittingRef.current;

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM);
    setTurnstileToken("");
    setTurnstileKey((k) => k + 1);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setModalOpen(true);
    setModalStage("validating");
    setModalError("");

    await new Promise((r) => setTimeout(r, 400));
    setModalStage("sending");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setModalStage("success");
        await new Promise((r) => setTimeout(r, 1400));
        setModalOpen(false);
        resetForm();
      } else {
        setModalError(data.error || "Erreur lors de l'envoi.");
        setModalStage("error");
        await new Promise((r) => setTimeout(r, 2500));
        setModalOpen(false);
        setTurnstileKey((k) => k + 1);
        setTurnstileToken("");
      }
    } catch {
      setModalError("Erreur de connexion.");
      setModalStage("error");
      await new Promise((r) => setTimeout(r, 2500));
      setModalOpen(false);
      setTurnstileKey((k) => k + 1);
      setTurnstileToken("");
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <section id="contact" className="section-shell relative">
      <AmbientBackground />
      <SubmitProgressModal
        open={modalOpen}
        stage={modalStage}
        errorMessage={modalError}
      />

      <SectionHeader
        label="Contact"
        title="Le plus rapide :"
        titleAccent="WhatsApp"
        description="WhatsApp pour une réponse rapide. Le formulaire ci-dessous envoie un e-mail — numéro de téléphone obligatoire."
        align="center"
      />

      <div className="max-w-2xl mx-auto mb-10">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full p-8 md:p-10 border-2 border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/15 transition-colors group"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shrink-0">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
          <div className="text-center sm:text-left">
            <p className="font-display text-xl text-bone font-semibold group-hover:text-champagne transition-colors">
              Ouvrir WhatsApp — {PHONE_DISPLAY}
            </p>
            <p className="text-mist text-xs mt-2">Canal recommandé</p>
          </div>
        </a>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
        <aside className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <div className="surface-card p-8">
            <p className="label-mono mb-6">Coordonnées</p>
            <ul className="space-y-5 text-sm">
              <li>
                <span className="text-mist block mb-1">WhatsApp</span>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] font-medium hover:underline"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <span className="text-mist block mb-1">Email</span>
                <a href={`mailto:${EMAIL}`} className="text-bone hover:text-champagne transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li>
                <span className="text-mist block mb-1">Localisation</span>
                <span className="text-bone">Douala, Cameroun</span>
              </li>
            </ul>
          </div>
        </aside>

        <div className="lg:col-span-3 order-1 lg:order-2">
          {!showEmailForm ? (
            <div className="surface-card p-8 md:p-10 text-center">
              <p className="text-mist text-sm mb-6 leading-relaxed">
                Formulaire e-mail avec vérification anti-spam (Turnstile) et votre
                numéro pour vous recontacter.
              </p>
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="btn-premium btn-premium--ghost"
              >
                Ouvrir le formulaire e-mail
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="surface-card p-8 md:p-10 space-y-5"
            >
              <p className="label-mono !text-[0.6rem] text-mist">
                Mon numéro : {PHONE_DISPLAY} — indiquez le vôtre pour être rappelé
              </p>

              <div>
                <label htmlFor="email" className="label-mono !text-[0.6rem] block mb-2">
                  Votre email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderRadius: "var(--radius-cut)" }}
                  placeholder="vous@entreprise.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="label-mono !text-[0.6rem] block mb-2">
                  Votre téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderRadius: "var(--radius-cut)" }}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="subject" className="label-mono !text-[0.6rem] block mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  maxLength={80}
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ borderRadius: "var(--radius-cut)" }}
                  placeholder="Site web, mission…"
                />
              </div>

              <div>
                <label htmlFor="message" className="label-mono !text-[0.6rem] block mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={500}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  style={{ borderRadius: "var(--radius-cut)" }}
                  placeholder="Votre message…"
                />
              </div>

              {TURNSTILE_SITE_KEY ? (
                <div className="flex justify-center py-2">
                  <Turnstile
                    key={turnstileKey}
                    siteKey={TURNSTILE_SITE_KEY}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken("")}
                    onError={() => setTurnstileToken("")}
                    options={{ theme: "dark", size: "normal" }}
                  />
                </div>
              ) : (
                <p className="text-ember text-xs text-center">
                  Turnstile non configuré : ajoutez NEXT_PUBLIC_TURNSTILE_SITE_KEY et
                  TURNSTILE_SECRET_KEY dans .env.local
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn-premium btn-premium--primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Envoyer le message
              </button>

              <p className="text-mist text-xs text-center">
                {!turnstileToken && TURNSTILE_SITE_KEY
                  ? "Cochez la vérification anti-spam pour activer l'envoi."
                  : null}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModernEmailSection;
