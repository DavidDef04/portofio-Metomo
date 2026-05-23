"use client";
import React from "react";
import { whatsappLink, EMAIL } from "@/config/contact";

const ModernFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-8">
      <div className="max-w-[calc(72rem+4rem)] mx-auto px-[var(--space-gutter)] py-16">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr] gap-12">
          <div>
            <p className="font-display text-2xl text-bone font-bold mb-4">
              METOMO<span className="text-champagne">.</span>
            </p>
            <p className="text-mist text-sm max-w-sm leading-relaxed">
              Développeur full-stack — sites web, SEO, déploiement et
              automatisation. Basé à Douala.
            </p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-[#25D366] hover:underline"
            >
              Contacter sur WhatsApp →
            </a>
          </div>

          <nav aria-label="Navigation pied de page">
            <p className="label-mono mb-4">Navigation</p>
            <ul className="space-y-2 text-sm">
              {[
                ["#home", "Accueil"],
                ["#about", "Expertise"],
                ["#projects", "Travaux"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-mist hover:text-champagne transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-mono mb-4">Stack actuelle</p>
            <p className="text-mist text-sm leading-loose">
              Django · Laravel · JavaScript · SQL · Next.js · Astro . HTML · CSS · Tailwind · n8n
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="block mt-4 text-mist text-sm hover:text-champagne transition-colors"
            >
              {EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-mist text-xs">
          <p>© {year} David René METOMO. Tous droits réservés.</p>
          <p className="label-mono !text-[0.6rem]">
            Douala, Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
