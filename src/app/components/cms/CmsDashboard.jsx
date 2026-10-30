"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import StatsPanel from "./StatsPanel";

async function parseCmsResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `Erreur serveur (${res.status})`);
  }
  return data;
}

const CATEGORIES = ["Web", "Mobile", "Cybersécurité", "IA"];
const inputClass =
  "w-full px-3 py-2 bg-elevated border border-border text-bone text-sm focus:outline-none focus:border-champagne/50";

const emptyProject = {
  title: "",
  description: "",
  image: "",
  category: "Web",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  visible: true,
  featured: false,
  order: 100,
};

const emptyCert = {
  name: "",
  issuer: "",
  date: "",
  url: "",
  description: "",
  visible: true,
  order: 100,
};

const emptyExperience = {
  title: "",
  company: "",
  period: "",
  description: "",
  technologies: "",
  visible: true,
  order: 100,
};

const NAV_ITEMS = [
  ["stats", "Statistiques"],
  ["about", "Section Expertise"],
  ["hero", "Hero (accueil)"],
  ["parcours", "Parcours pro"],
  ["manual", "Projets manuels"],
  ["github", "Projets GitHub"],
  ["certs", "Certifications"],
];

export default function CmsDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("stats");
  const [navOpen, setNavOpen] = useState(false);
  const [manual, setManual] = useState([]);
  const [github, setGithub] = useState([]);
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [certForm, setCertForm] = useState(emptyCert);
  const [editingId, setEditingId] = useState(null);
  const [editingCertId, setEditingCertId] = useState(null);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = useCallback((type, text) => {
    setToast({ type, text });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);
  const [heroForm, setHeroForm] = useState(null);
  const [aboutForm, setAboutForm] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [expForm, setExpForm] = useState(emptyExperience);
  const [editingExpId, setEditingExpId] = useState(null);

  const load = useCallback(async () => {
    const opts = { cache: "no-store" };
    const [m, g, c, s] = await Promise.all([
      fetch("/api/cms/manual-projects", opts).then((r) => r.json()),
      fetch("/api/cms/github-meta", opts).then((r) => r.json()),
      fetch("/api/cms/certifications", opts).then((r) => r.json()),
      fetch("/api/cms/site-content", opts).then((r) => r.json()),
    ]);
    if (m.success) setManual(m.projects);
    if (g.success) setGithub(g.projects);
    if (c.success) setCerts(c.certifications);
    if (s.success && s.content) {
      const { hero, about, experiences: exps } = s.content;
      setHeroForm({
        ...hero,
        rolesText: (hero.roles || []).join("\n"),
        rolesText_en: (hero.roles_en || []).join("\n"),
      });
      setAboutForm(about || DEFAULT_SITE_CONTENT.about);
      setExperiences(exps || []);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  const saveProject = async (e) => {
    e.preventDefault();
    setSaving("project");
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          ? form.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };
      const url = editingId
        ? `/api/cms/manual-projects/${editingId}`
        : "/api/cms/manual-projects";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast("success", editingId ? "Projet mis à jour" : "Projet créé");
      setForm(emptyProject);
      setEditingId(null);
      await load();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    setSaving("project");
    try {
      const res = await fetch(`/api/cms/manual-projects/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast("success", "Projet supprimé");
      await load();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const editProject = (p) => {
    setEditingId(p.id);
    setForm({
      ...p,
      technologies: (p.technologies || []).join(", "),
    });
    setTab("manual");
  };

  const uploadFile = async (
    e,
    { kind = "image", previousPath = "", onPath, persistCv = false } = {}
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      if (previousPath) body.append("previousPath", previousPath);
      const res = await fetch("/api/cms/upload", { method: "POST", body });
      const data = await parseCmsResponse(res);
      onPath?.(data.path);

      if (kind === "cv" && persistCv) {
        const saveRes = await fetch("/api/cms/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hero: { cvUrl: data.path } }),
          cache: "no-store",
        });
        await parseCmsResponse(saveRes);
        setHeroForm((prev) => (prev ? { ...prev, cvUrl: data.path } : prev));
        showToast(
          "success",
          "Nouveau CV enregistré — l’ancien fichier a été remplacé sur le site."
        );
      } else {
        showToast(
          "success",
          data.replaced
            ? kind === "cv"
              ? "CV remplacé"
              : "Image remplacée (ancienne supprimée)"
            : kind === "cv"
              ? "CV téléversé"
              : "Image téléversée"
        );
      }
    } catch (err) {
      showToast("error", err.message || "Erreur réseau lors du téléversement");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const uploadImage = (e) =>
    uploadFile(e, {
      previousPath: form.image || "",
      onPath: (path) => setForm((prev) => ({ ...prev, image: path })),
    });

  const selectTab = (id) => {
    setTab(id);
    setNavOpen(false);
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    if (!aboutForm) return;
    setSaving("about");
    try {
      const res = await fetch("/api/cms/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about: aboutForm }),
        cache: "no-store",
      });
      const data = await parseCmsResponse(res);
      setAboutForm(data.content.about);
      showToast(
        "success",
        "Section Expertise enregistrée. Vérifiez la section « À propos » sur le site."
      );
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const saveHero = async (e) => {
    e.preventDefault();
    if (!heroForm) return;
    setSaving("hero");
    try {
      const { rolesText, rolesText_en, roles: _roles, roles_en: _rolesEn, ...heroFields } = heroForm;
      const toLines = (txt) =>
        (txt || "").split("\n").map((r) => r.trim()).filter(Boolean);
      const res = await fetch("/api/cms/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {
            ...heroFields,
            roles: toLines(rolesText),
            roles_en: toLines(rolesText_en),
          },
        }),
        cache: "no-store",
      });
      const data = await parseCmsResponse(res);
      const h = data.content.hero;
      setHeroForm({
        ...h,
        rolesText: (h.roles || []).join("\n"),
        rolesText_en: (h.roles_en || []).join("\n"),
      });
      showToast(
        "success",
        "Hero enregistré. Ouvrez l’accueil (ou revenez sur l’onglet) pour voir les changements."
      );
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const saveExperiences = async (list) => {
    const res = await fetch("/api/cms/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experiences: list }),
      cache: "no-store",
    });
    const data = await parseCmsResponse(res);
    setExperiences(data.content.experiences);
    return true;
  };

  const saveExperience = async (e) => {
    e.preventDefault();
    setSaving("experience");
    try {
      const item = {
        ...expForm,
        technologies: expForm.technologies
          ? expForm.technologies.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        technologies_en: (expForm.technologiesText_en || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        order: Number(expForm.order) || 100,
      };
      delete item.technologiesText_en;
      let next;
      if (editingExpId) {
        next = experiences.map((x) =>
          x.id === editingExpId ? { ...x, ...item, id: editingExpId } : x
        );
      } else {
        next = [...experiences, { ...item, id: `exp-${Date.now()}` }];
      }
      await saveExperiences(next);
      showToast(
        "success",
        editingExpId ? "Expérience mise à jour" : "Expérience ajoutée"
      );
      setExpForm(emptyExperience);
      setEditingExpId(null);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    setSaving("experience");
    try {
      await saveExperiences(experiences.filter((x) => x.id !== id));
      showToast("success", "Expérience supprimée");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const toggleGithub = async (p, field, value) => {
    try {
      const res = await fetch("/api/cms/github-meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: p.id,
          githubId: p.githubId,
          [field]: value,
        }),
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast("success", "Projet GitHub mis à jour");
      await load();
      return true;
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const saveCert = async (e) => {
    e.preventDefault();
    setSaving("cert");
    try {
      const url = editingCertId
        ? `/api/cms/certifications/${editingCertId}`
        : "/api/cms/certifications";
      const res = await fetch(url, {
        method: editingCertId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certForm),
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast(
        "success",
        editingCertId ? "Certification mise à jour" : "Certification ajoutée"
      );
      setCertForm(emptyCert);
      setEditingCertId(null);
      await load();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const deleteCert = async (id) => {
    if (!confirm("Supprimer ?")) return;
    setSaving("cert");
    try {
      const res = await fetch(`/api/cms/certifications/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast("success", "Certification supprimée");
      await load();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setSaving(null);
    }
  };

  const activeNavLabel =
    NAV_ITEMS.find(([id]) => id === tab)?.[1] ?? "CMS";

  return (
    <div className="min-h-screen bg-void text-bone-dim flex flex-col md:flex-row">
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-void/95 backdrop-blur-md shrink-0">
        <div className="min-w-0">
          <p className="font-display text-bone leading-tight">
            CMS<span className="text-champagne">.</span>
          </p>
          <p className="text-mist text-xs truncate">{activeNavLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setNavOpen((o) => !o)}
          className="shrink-0 px-3 py-2 text-sm border border-border text-bone hover:border-champagne/40"
          style={{ borderRadius: "var(--radius-cut)" }}
          aria-expanded={navOpen}
          aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {navOpen ? "Fermer" : "Menu"}
        </button>
      </header>

      {navOpen && (
        <button
          type="button"
          className="md:hidden fixed inset-0 z-40 bg-void/80 backdrop-blur-sm"
          aria-label="Fermer le menu"
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky md:top-0 left-0 z-50 md:z-auto h-[100dvh] md:h-auto md:min-h-screen w-[min(288px,88vw)] md:w-56 shrink-0 border-r border-border bg-void flex flex-col p-4 md:p-6 transition-transform duration-300 ease-out ${
          navOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <p className="hidden md:block font-display text-lg text-bone mb-6">
          CMS<span className="text-champagne">.</span>
        </p>
        <nav className="flex-1 overflow-y-auto space-y-0.5 -mx-1 px-1">
          {NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => selectTab(id)}
              className={`block w-full text-left px-3 py-2.5 text-sm rounded-sm ${
                tab === id
                  ? "bg-champagne/10 text-champagne"
                  : "text-mist hover:text-bone hover:bg-elevated/50"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="pt-4 mt-2 border-t border-border shrink-0">
          <button
            type="button"
            onClick={logout}
            className="text-sm text-ember hover:underline"
          >
            Déconnexion
          </button>
          <a
            href="/"
            className="block mt-3 text-sm text-mist hover:text-champagne"
          >
            ← Voir le site
          </a>
        </div>
      </aside>

      <main className="flex-1 min-w-0 w-full p-4 sm:p-6 lg:p-8 overflow-y-auto md:max-h-screen relative pb-10">
        {toast && (
          <div
            role="status"
            className={`fixed top-16 md:top-4 left-4 right-4 md:left-auto md:right-4 z-50 md:max-w-md px-4 py-3 border text-sm shadow-lg ${
              toast.type === "success"
                ? "bg-teal/15 border-teal text-teal"
                : "bg-ember/15 border-ember text-ember"
            }`}
            style={{ borderRadius: "var(--radius-cut)" }}
          >
            <p className="font-medium">{toast.type === "success" ? "✓ Succès" : "✕ Erreur"}</p>
            <p className="mt-1 text-bone-dim">{toast.text}</p>
            {toast.type === "success" && (
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-champagne hover:underline text-xs"
              >
                Voir sur le site →
              </a>
            )}
          </div>
        )}

        {tab === "stats" && <StatsPanel />}

        {tab === "about" && aboutForm && (
          <form
            onSubmit={saveAbout}
            className="surface-card p-4 sm:p-6 space-y-4 w-full max-w-2xl"
          >
            <h2 className="font-display text-bone text-lg mb-2">Section Expertise</h2>
            <p className="text-mist text-sm mb-4">
              En-tête de la section « Ce que je fais au quotidien » — idéal quand vous
              changez d&apos;entreprise, de mission ou de positionnement.
            </p>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Petit label (ex. Expertise)
              </label>
              <input
                className={inputClass}
                value={aboutForm.sectionLabel}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, sectionLabel: e.target.value })
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  Titre — ligne 1
                </label>
                <input
                  className={inputClass}
                  value={aboutForm.sectionTitle}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, sectionTitle: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  Titre — accent (doré)
                </label>
                <input
                  className={inputClass}
                  value={aboutForm.sectionTitleAccent}
                  onChange={(e) =>
                    setAboutForm({
                      ...aboutForm,
                      sectionTitleAccent: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Description sous le titre
              </label>
              <textarea
                className={`${inputClass} resize-y min-h-[120px]`}
                rows={4}
                value={aboutForm.sectionDescription}
                onChange={(e) =>
                  setAboutForm({
                    ...aboutForm,
                    sectionDescription: e.target.value,
                  })
                }
              />
            </div>

            <EnFields
              inputClass={inputClass}
              value={aboutForm}
              onChange={setAboutForm}
              fields={[
                ["sectionLabel_en", "Petit label", "input", "Expertise"],
                ["sectionTitle_en", "Titre — ligne 1", "input", "What I can do"],
                ["sectionTitleAccent_en", "Titre — accent", "input", "and what I'm learning"],
                ["sectionDescription_en", "Description", "textarea"],
              ]}
            />

            <button
              type="submit"
              disabled={saving === "about"}
              className="btn-premium btn-premium--primary disabled:opacity-50 w-full sm:w-auto"
            >
              {saving === "about" ? "Enregistrement…" : "Enregistrer la section"}
            </button>
          </form>
        )}

        {tab === "hero" && heroForm && (
          <form onSubmit={saveHero} className="surface-card p-4 sm:p-6 space-y-4 w-full max-w-2xl">
            <h2 className="font-display text-bone text-lg mb-2">Section Hero</h2>
            <p className="text-mist text-sm mb-4">
              Sous-titre, textes rotatifs, CV et liens sociaux — sans toucher au code.
            </p>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Sous-titre (ex. ville + poste)
              </label>
              <input
                className={inputClass}
                value={heroForm.eyebrow}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, eyebrow: e.target.value })
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">Prénom(s)</label>
                <input
                  className={inputClass}
                  value={heroForm.nameLine1}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, nameLine1: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">Nom (accent)</label>
                <input
                  className={inputClass}
                  value={heroForm.nameHighlight}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, nameHighlight: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Phrases rotatives (une par ligne)
              </label>
              <textarea
                className={`${inputClass} resize-none font-mono text-xs`}
                rows={4}
                value={heroForm.rolesText}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, rolesText: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">Introduction</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={4}
                value={heroForm.intro}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, intro: e.target.value })
                }
              />
            </div>

            <div className="surface-card !bg-transparent p-4 border border-border space-y-3">
              <label className="flex items-center gap-2 text-sm text-bone">
                <input
                  type="checkbox"
                  checked={heroForm.available !== false}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, available: e.target.checked })
                  }
                />
                Afficher la pastille verte « disponible »
              </label>
              <input
                className={inputClass}
                placeholder="Disponible pour des missions"
                value={heroForm.availabilityText || ""}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, availabilityText: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Photo de profil (portrait, idéalement 4:5 — 1200 × 1500 px)
              </label>
              <div className="flex flex-wrap items-start gap-4 mb-2">
                <div className="w-24 aspect-[4/5] bg-elevated overflow-hidden border border-border shrink-0">
                  <img
                    src={heroForm.photoUrl || "/images/image.png"}
                    alt="Aperçu de la photo de profil"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-2">
                  <label className="btn-premium btn-premium--ghost cursor-pointer text-xs">
                    {uploading ? "…" : "Changer la photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) =>
                        uploadFile(e, {
                          previousPath: heroForm.photoUrl || "",
                          onPath: (path) =>
                            setHeroForm((prev) => ({ ...prev, photoUrl: path })),
                        })
                      }
                    />
                  </label>
                  <p className="text-mist text-xs max-w-xs">
                    Après le téléversement, cliquez sur « Enregistrer » en bas du
                    formulaire pour publier la nouvelle photo.
                  </p>
                </div>
              </div>
              <input
                className={inputClass}
                placeholder="/images/image.png"
                value={heroForm.photoUrl || ""}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, photoUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">CV (PDF)</label>
              <div className="flex flex-wrap gap-3 mb-2">
                <label className="btn-premium btn-premium--ghost cursor-pointer text-xs">
                  {uploading ? "…" : "Téléverser le CV"}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    disabled={uploading}
                    onChange={(e) =>
                      uploadFile(e, {
                        kind: "cv",
                        previousPath: heroForm.cvUrl || "",
                        persistCv: true,
                        onPath: (path) =>
                          setHeroForm((prev) => ({ ...prev, cvUrl: path })),
                      })
                    }
                  />
                </label>
              </div>
              <input
                className={inputClass}
                placeholder="/cv/David_Rene_Metomo_CV.pdf"
                value={heroForm.cvUrl}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, cvUrl: e.target.value })
                }
              />
              <input
                className={`${inputClass} mt-2`}
                placeholder="Libellé du bouton"
                value={heroForm.cvLabel}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, cvLabel: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                CV en anglais (lien sous les boutons du hero)
              </label>
              <input
                className={inputClass}
                placeholder="/cv/Resume_David_Rene_METOMO_EN_2026.pdf"
                value={heroForm.cvEnUrl || ""}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, cvEnUrl: e.target.value })
                }
              />
              <input
                className={`${inputClass} mt-2`}
                placeholder="English resume"
                value={heroForm.cvEnLabel || ""}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, cvEnLabel: e.target.value })
                }
              />
              <p className="text-mist text-xs mt-1">
                Laissez le lien vide pour masquer le CV anglais. Pour le remplacer,
                déposez le nouveau PDF dans public/cv/ du projet.
              </p>
            </div>

            <EnFields
              inputClass={inputClass}
              value={heroForm}
              onChange={setHeroForm}
              fields={[
                ["eyebrow_en", "Sous-titre", "input", "Douala, Cameroon — Full-stack developer & cybersecurity"],
                ["rolesText_en", "Phrases rotatives (une par ligne)", "textarea"],
                ["intro_en", "Introduction", "textarea"],
                ["availabilityText_en", "Texte de la pastille « disponible »", "input", "Available for projects"],
                ["statusLabel_en", "Encadré photo — titre", "input", "Currently"],
                ["statusText_en", "Encadré photo — texte", "input"],
                ["whatsappCta_en", "Bouton WhatsApp", "input", "Chat on WhatsApp"],
                ["cvLabel_en", "Bouton CV", "input", "Download resume"],
              ]}
            />

            <div>
              <label className="label-mono !text-[0.6rem] block mb-1">
                Texte bouton WhatsApp
              </label>
              <input
                className={inputClass}
                value={heroForm.whatsappCta}
                onChange={(e) =>
                  setHeroForm({ ...heroForm, whatsappCta: e.target.value })
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  Carte « En ce moment »
                </label>
                <input
                  className={inputClass}
                  value={heroForm.statusLabel}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, statusLabel: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">Détail</label>
                <input
                  className={inputClass}
                  value={heroForm.statusText}
                  onChange={(e) =>
                    setHeroForm({ ...heroForm, statusText: e.target.value })
                  }
                />
              </div>
            </div>

            <p className="label-mono !text-[0.6rem] pt-2">Liens sociaux</p>
            {[
              ["github", "GitHub"],
              ["linkedin", "LinkedIn"],
              ["email", "Email (mailto:…)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-mist text-xs block mb-1">{label}</label>
                <input
                  className={inputClass}
                  value={heroForm.social?.[key] || ""}
                  onChange={(e) =>
                    setHeroForm({
                      ...heroForm,
                      social: { ...heroForm.social, [key]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
            <p className="text-mist text-xs">
              WhatsApp utilise le numéro dans <code>.env</code> (CONTACT_PHONE).
            </p>

            <button
              type="submit"
              disabled={saving === "hero"}
              className="btn-premium btn-premium--primary disabled:opacity-50"
            >
              {saving === "hero" ? "Enregistrement…" : "Enregistrer le hero"}
            </button>
          </form>
        )}

        {tab === "parcours" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <form onSubmit={saveExperience} className="surface-card p-4 sm:p-6 space-y-4">
              <h2 className="font-display text-bone text-lg">
                {editingExpId ? "Modifier l'expérience" : "Nouvelle expérience"}
              </h2>
              {["title", "company", "period"].map((f) => (
                <div key={f}>
                  <label className="label-mono !text-[0.6rem] block mb-1">{f}</label>
                  <input
                    className={inputClass}
                    value={expForm[f]}
                    onChange={(e) => setExpForm({ ...expForm, [f]: e.target.value })}
                    required={f === "title"}
                  />
                </div>
              ))}
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={expForm.description}
                  onChange={(e) =>
                    setExpForm({ ...expForm, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  technologies (virgules)
                </label>
                <input
                  className={inputClass}
                  value={expForm.technologies}
                  onChange={(e) =>
                    setExpForm({ ...expForm, technologies: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">ordre</label>
                <input
                  type="number"
                  className={inputClass}
                  value={expForm.order}
                  onChange={(e) => setExpForm({ ...expForm, order: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={expForm.visible}
                  onChange={(e) =>
                    setExpForm({ ...expForm, visible: e.target.checked })
                  }
                />
                Visible sur le site
              </label>
              <div className="flex gap-2">
                <EnFields
                inputClass={inputClass}
                value={expForm}
                onChange={setExpForm}
                fields={[
                  ["title_en", "Intitulé", "input"],
                  ["company_en", "Entreprise (si différente)", "input"],
                  ["period_en", "Période", "input", "Sep 2025 — Present"],
                  ["description_en", "Description", "textarea"],
                  ["technologiesText_en", "Technologies (virgules)", "input"],
                ]}
              />
              <button
                  type="submit"
                  disabled={saving === "experience"}
                  className="btn-premium btn-premium--primary disabled:opacity-50"
                >
                  {saving === "experience"
                    ? "Enregistrement…"
                    : editingExpId
                      ? "Enregistrer"
                      : "Ajouter"}
                </button>
                {editingExpId && (
                  <button
                    type="button"
                    className="btn-premium btn-premium--ghost"
                    onClick={() => {
                      setEditingExpId(null);
                      setExpForm(emptyExperience);
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="label-mono">Parcours ({experiences.length})</h3>
              {experiences.map((exp) => (
                <div key={exp.id} className="surface-card p-4">
                  <p className="text-bone font-medium">{exp.title}</p>
                  <p className="text-champagne text-sm">{exp.company}</p>
                  <p className="text-mist text-xs">{exp.period}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="text-xs text-champagne"
                      onClick={() => {
                        setEditingExpId(exp.id);
                        setExpForm({
                          ...exp,
                          technologies: (exp.technologies || []).join(", "),
                          technologiesText_en: (exp.technologies_en || []).join(", "),
                        });
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-xs text-ember"
                      onClick={() => deleteExperience(exp.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "manual" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <form onSubmit={saveProject} className="surface-card p-4 sm:p-6 space-y-4">
              <h2 className="font-display text-bone text-lg">
                {editingId ? "Modifier le projet" : "Nouveau projet manuel"}
              </h2>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">title</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  Image du projet
                </label>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="btn-premium btn-premium--ghost cursor-pointer text-xs">
                      {uploading ? "Téléversement…" : "Choisir une image"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="sr-only"
                        disabled={uploading}
                        onChange={uploadImage}
                      />
                    </label>
                    <span className="text-mist text-xs">JPG, PNG, WebP, GIF, SVG · max 5 Mo</span>
                  </div>
                  <input
                    className={inputClass}
                    placeholder="/images/projects/mon-projet.png"
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                  <p className="text-mist text-xs">
                    Téléversez une image ou collez un chemin déjà présent dans{" "}
                    <code className="text-champagne">public/</code>.
                  </p>
                  {form.image && (
                    <div className="border border-border p-2 bg-elevated">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Aperçu"
                        className="max-h-40 w-full object-contain"
                        onError={(ev) => {
                          ev.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {[
                ["githubUrl", "Lien GitHub (facultatif, dépôt public)"],
                ["liveUrl", "Lien du site en ligne (facultatif)"],
              ].map(([f, label]) => (
                <div key={f}>
                  <label className="label-mono !text-[0.6rem] block mb-1">{label}</label>
                  <input
                    className={inputClass}
                    type="url"
                    placeholder="https://…"
                    value={form[f] || ""}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">catégorie</label>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">
                  technologies (virgules)
                </label>
                <input
                  className={inputClass}
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  />
                  Visible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  Vedette
                </label>
              </div>
              <div className="flex gap-2">
                <EnFields
                inputClass={inputClass}
                value={form}
                onChange={setForm}
                fields={[
                  ["title_en", "Titre (si différent)", "input"],
                  ["description_en", "Description", "textarea"],
                ]}
              />
              <button
                  type="submit"
                  disabled={saving === "project"}
                  className="btn-premium btn-premium--primary disabled:opacity-50"
                >
                  {saving === "project"
                    ? "Enregistrement…"
                    : editingId
                      ? "Enregistrer"
                      : "Créer"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-premium btn-premium--ghost"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyProject);
                    }}
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="label-mono">Projets manuels ({manual.length})</h3>
              {manual.map((p) => (
                <div key={p.id} className="surface-card p-4 flex justify-between gap-4">
                  <div className="flex gap-3 min-w-0">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt=""
                        className="w-14 h-14 object-cover shrink-0 border border-border"
                      />
                    )}
                    <div className="min-w-0">
                    <p className="text-bone font-medium">{p.title}</p>
                    <p className="text-mist text-xs">
                      {p.visible ? "Visible" : "Masqué"} · {p.category}
                    </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-xs text-champagne"
                      onClick={() => editProject(p)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-xs text-ember"
                      onClick={() => deleteProject(p.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "github" && (
          <div>
            <p className="text-mist text-sm mb-4">
              Dépôts publics et privés via GITHUB_TOKEN. Par défaut, tous les dépôts
              accessibles au token sont listés. Cochez Visible pour les afficher sur le site.
            </p>
            <p className="text-champagne text-sm mb-4">
              {github.length} dépôt{github.length !== 1 ? "s" : ""} synchronisé
              {github.length !== 1 ? "s" : ""}
            </p>
            <button
              type="button"
              className="btn-premium btn-premium--ghost mb-6"
              onClick={async () => {
                setSaving("github-sync");
                try {
                  const res = await fetch("/api/sync-projects", {
                    method: "POST",
                    cache: "no-store",
                  });
                  await parseCmsResponse(res);
                  showToast("success", "Liste GitHub rafraîchie");
                  await load();
                } catch (err) {
                  showToast("error", err.message);
                } finally {
                  setSaving(null);
                }
              }}
              disabled={saving === "github-sync"}
            >
              {saving === "github-sync" ? "Synchronisation…" : "Rafraîchir depuis GitHub"}
            </button>
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {github.map((p) => (
                <GithubRow
                  key={p.id}
                  project={p}
                  onToggle={toggleGithub}
                  inputClass={inputClass}
                />
              ))}
            </div>
          </div>
        )}

        {tab === "certs" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <form onSubmit={saveCert} className="surface-card p-4 sm:p-6 space-y-4">
              <h2 className="font-display text-bone text-lg">
                {editingCertId ? "Modifier certification" : "Nouvelle certification"}
              </h2>
              {[
                ["name", "Nom de la certification", "Certificat professionnel Google Cybersecurity"],
                ["issuer", "Organisme", "Google (Coursera)"],
                ["date", "Date d'obtention", "Octobre 2026"],
                ["url", "Lien de vérification (facultatif)", "https://www.coursera.org/account/accomplishments/…"],
              ].map(([f, label, placeholder]) => (
                <div key={f}>
                  <label className="label-mono !text-[0.6rem] block mb-1">{label}</label>
                  <input
                    className={inputClass}
                    type={f === "url" ? "url" : "text"}
                    placeholder={placeholder}
                    value={certForm[f] || ""}
                    onChange={(e) => setCertForm({ ...certForm, [f]: e.target.value })}
                    required={f === "name"}
                  />
                </div>
              ))}
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">Description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={certForm.description || ""}
                  onChange={(e) =>
                    setCertForm({ ...certForm, description: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={certForm.visible}
                  onChange={(e) =>
                    setCertForm({ ...certForm, visible: e.target.checked })
                  }
                />
                Visible sur le site
              </label>
              <EnFields
                inputClass={inputClass}
                value={certForm}
                onChange={setCertForm}
                fields={[
                  ["name_en", "Nom", "input"],
                  ["issuer_en", "Organisme", "input"],
                  ["date_en", "Date", "input", "Oct 2026"],
                  ["description_en", "Description", "textarea"],
                ]}
              />
              <button
                type="submit"
                disabled={saving === "cert"}
                className="btn-premium btn-premium--primary disabled:opacity-50"
              >
                {saving === "cert"
                  ? "Enregistrement…"
                  : editingCertId
                    ? "Enregistrer"
                    : "Ajouter"}
              </button>
            </form>

            <div className="space-y-3">
              {certs.map((c) => (
                <div key={c.id} className="surface-card p-4">
                  <p className="text-bone font-medium">{c.name}</p>
                  <p className="text-champagne text-sm">{c.issuer}</p>
                  <p className="text-mist text-xs">{c.date}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      className="text-xs text-champagne"
                      onClick={() => {
                        setEditingCertId(c.id);
                        setCertForm({ ...emptyCert, ...c });
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-xs text-ember"
                      onClick={() => deleteCert(c.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
              {certs.length === 0 && (
                <p className="text-mist text-sm">Aucune certification pour le moment.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* Ligne d'un dépôt GitHub : visibilité, vedette, et valeurs d'affichage
   (titre, lien du site, description) qui remplacent celles de GitHub. */
function GithubRow({ project: p, onToggle, inputClass }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: p.overrides?.title || "",
    liveUrl: p.overrides?.liveUrl || "",
    description: p.overrides?.description || "",
    image: p.overrides?.image || "",
    title_en: p.overrides?.title_en || "",
    description_en: p.overrides?.description_en || "",
    order: p.order ?? 500,
  });
  const [busy, setBusy] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", "image");
      if (draft.image) body.append("previousPath", draft.image);
      const res = await fetch("/api/cms/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);
      setDraft((d) => ({ ...d, image: data.path }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingImg(false);
      e.target.value = "";
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/cms/github-meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, githubId: p.githubId, ...draft }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      setOpen(false);
      await onToggle(p, "order", Number(draft.order) || 500);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  const shownLive = p.overrides?.liveUrl || p.homepage || "";

  return (
    <div className="surface-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-bone text-sm font-medium">
            {p.overrides?.title || p.title}
            {p.private && <span className="ml-2 text-xs text-champagne">privé</span>}
          </p>
          <p className="text-mist text-xs truncate">
            {p.githubId || p.full_name}
            {shownLive && <> · {shownLive}</>}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={p.visible !== false}
              onChange={(e) => onToggle(p, "visible", e.target.checked)}
            />
            Visible
          </label>
          <label className="flex items-center gap-1 text-xs">
            <input
              type="checkbox"
              checked={p.featured === true}
              onChange={(e) => onToggle(p, "featured", e.target.checked)}
            />
            Vedette
          </label>
          <button
            type="button"
            className="text-xs text-champagne"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Fermer" : "Modifier"}
          </button>
        </div>
      </div>

      {open && (
        <form onSubmit={save} className="mt-4 space-y-3 border-t border-border pt-4">
          <div>
            <label className="label-mono !text-[0.6rem] block mb-1">
              Titre affiché (vide = nom du dépôt)
            </label>
            <input
              className={inputClass}
              placeholder={p.title}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </div>
          <div>
            <label className="label-mono !text-[0.6rem] block mb-1">
              Lien du site en ligne (vide = aucun lien)
            </label>
            <input
              className={inputClass}
              type="url"
              placeholder="https://…"
              value={draft.liveUrl}
              onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="label-mono !text-[0.6rem] block mb-1">
              Image (capture du site)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {draft.image && (
                <img src={draft.image} alt="" className="w-28 aspect-[16/9] object-cover border border-border" />
              )}
              <label className="btn-premium btn-premium--ghost cursor-pointer text-xs">
                {uploadingImg ? "…" : "Choisir une image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={uploadingImg}
                  onChange={uploadImage}
                />
              </label>
            </div>
            <input
              className={`${inputClass} mt-2`}
              placeholder="/api/media/… ou /images/projects/…"
              value={draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            />
          </div>
          <div>
            <label className="label-mono !text-[0.6rem] block mb-1">
              Description affichée (vide = description GitHub)
            </label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={4}
              placeholder={p.description}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label-mono !text-[0.6rem] block mb-1">
              Ordre (plus petit = plus haut)
            </label>
            <input
              className={inputClass}
              type="number"
              value={draft.order}
              onChange={(e) => setDraft({ ...draft, order: e.target.value })}
            />
          </div>
          <EnFields
            inputClass={inputClass}
            value={draft}
            onChange={setDraft}
            fields={[
              ["title_en", "Titre affiché", "input"],
              ["description_en", "Description affichée", "textarea"],
            ]}
          />
          <button
            type="submit"
            disabled={busy}
            className="btn-premium btn-premium--primary disabled:opacity-50"
          >
            {busy ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}

/* Bloc repliable « Version anglaise » : champs suffixés _en, affichés sur
   la page /en. Vide = le texte français est repris. */
function EnFields({ value, onChange, fields, inputClass }) {
  const filled = fields.filter(([k]) => (value?.[k] || "").toString().trim()).length;
  return (
    <details className="border border-border p-4 group" style={{ borderRadius: "var(--radius-cut)" }}>
      <summary className="cursor-pointer text-sm text-bone flex items-center justify-between gap-3">
        <span>Version anglaise (EN)</span>
        <span className="text-xs text-mist">
          {filled}/{fields.length} renseigné{filled > 1 ? "s" : ""}
        </span>
      </summary>
      <div className="mt-4 space-y-3">
        <p className="text-mist text-xs">
          Affiché sur la version anglaise du site. Un champ vide reprend le texte français.
        </p>
        {fields.map(([key, label, kind, placeholder]) => (
          <div key={key}>
            <label className="label-mono !text-[0.6rem] block mb-1">{label}</label>
            {kind === "textarea" ? (
              <textarea
                className={`${inputClass} resize-y`}
                rows={key.startsWith("rolesText") ? 4 : 3}
                placeholder={placeholder}
                value={value?.[key] || ""}
                onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              />
            ) : (
              <input
                className={inputClass}
                placeholder={placeholder}
                value={value?.[key] || ""}
                onChange={(e) => onChange({ ...value, [key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </details>
  );
}
