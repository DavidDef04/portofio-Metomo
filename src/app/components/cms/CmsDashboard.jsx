"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export default function CmsDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("manual");
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
      const { hero, experiences: exps } = s.content;
      setHeroForm({
        ...hero,
        rolesText: (hero.roles || []).join("\n"),
      });
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

  const saveHero = async (e) => {
    e.preventDefault();
    if (!heroForm) return;
    setSaving("hero");
    try {
      const { rolesText, roles: _roles, ...heroFields } = heroForm;
      const res = await fetch("/api/cms/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero: {
            ...heroFields,
            roles: (rolesText || "")
              .split("\n")
              .map((r) => r.trim())
              .filter(Boolean),
          },
        }),
        cache: "no-store",
      });
      const data = await parseCmsResponse(res);
      const h = data.content.hero;
      setHeroForm({
        ...h,
        rolesText: (h.roles || []).join("\n"),
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
        order: Number(expForm.order) || 100,
      };
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
          visible: field === "visible" ? value : p.visible !== false,
          featured: field === "featured" ? value : p.featured === true,
          order: p.order ?? 500,
        }),
        cache: "no-store",
      });
      await parseCmsResponse(res);
      showToast("success", "Projet GitHub mis à jour");
      await load();
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

  return (
    <div className="min-h-screen bg-void text-bone-dim flex">
      <aside className="w-56 border-r border-border p-6 shrink-0">
        <p className="font-display text-lg text-bone mb-8">
          CMS<span className="text-champagne">.</span>
        </p>
        {[
          ["hero", "Hero (accueil)"],
          ["parcours", "Parcours"],
          ["manual", "Projets manuels"],
          ["github", "Projets GitHub"],
          ["certs", "Certifications"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`block w-full text-left px-3 py-2 mb-1 text-sm ${
              tab === id ? "bg-champagne/10 text-champagne" : "text-mist hover:text-bone"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={logout}
          className="mt-8 text-sm text-ember hover:underline"
        >
          Déconnexion
        </button>
        <a href="/" className="block mt-4 text-sm text-mist hover:text-champagne">
          ← Voir le site
        </a>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-h-screen relative">
        {toast && (
          <div
            role="status"
            className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 border text-sm shadow-lg ${
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

        {tab === "hero" && heroForm && (
          <form onSubmit={saveHero} className="surface-card p-6 space-y-4 max-w-2xl">
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
          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={saveExperience} className="surface-card p-6 space-y-4">
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
          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={saveProject} className="surface-card p-6 space-y-4">
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

              {["githubUrl", "liveUrl"].map((f) => (
                <div key={f}>
                  <label className="label-mono !text-[0.6rem] block mb-1">{f}</label>
                  <input
                    className={inputClass}
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
                <div
                  key={p.id}
                  className="surface-card p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-bone text-sm font-medium">
                      {p.title}
                      {p.private && (
                        <span className="ml-2 text-xs text-champagne">privé</span>
                      )}
                    </p>
                    <p className="text-mist text-xs">{p.githubId || p.full_name}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={p.visible !== false}
                        onChange={(e) => toggleGithub(p, "visible", e.target.checked)}
                      />
                      Visible
                    </label>
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={p.featured === true}
                        onChange={(e) => toggleGithub(p, "featured", e.target.checked)}
                      />
                      Vedette
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "certs" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <form onSubmit={saveCert} className="surface-card p-6 space-y-4">
              <h2 className="font-display text-bone text-lg">
                {editingCertId ? "Modifier certification" : "Nouvelle certification"}
              </h2>
              {["name", "issuer", "date"].map((f) => (
                <div key={f}>
                  <label className="label-mono !text-[0.6rem] block mb-1">{f}</label>
                  <input
                    className={inputClass}
                    value={certForm[f]}
                    onChange={(e) => setCertForm({ ...certForm, [f]: e.target.value })}
                    required={f === "name"}
                  />
                </div>
              ))}
              <div>
                <label className="label-mono !text-[0.6rem] block mb-1">description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={certForm.description}
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
                        setCertForm(c);
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
