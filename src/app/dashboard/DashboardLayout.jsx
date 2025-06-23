"use client";
import { useState } from "react";

const sections = [
  { id: "profile", label: "Profil" },
  { id: "projects", label: "Projets" },
  { id: "contact", label: "Contact" },
  
];

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1f1f2e] text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-white/10 ${
              activeSection === section.id ? "bg-white/10 font-semibold" : ""
            }`}
          >
            {section.label}
          </button>
        ))}
        <div className="mt-10 space-y-2">
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            ✅ Sauvegarder & Quitter
          </button>
          <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
            ♻️ Réinitialiser & Quitter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeSection === "profile" && <div>📄 Affichage du profil </div>}
        {activeSection === "projects" && <div>🗂️ Affichage des projets </div>}
        {activeSection === "contact" && <div>📬 Affichage des infos contact </div>}
      </main>
    </div>
  );
}
