"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

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
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [heroForm, setHeroForm] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [expForm, setExpForm] = useState(emptyExperience);
  const [editingExpId, setEditingExpId] = useState(null);

  const load = useCallback(async () => {
    const [m, g, c, s] = await Promise.all([
      fetch("/api/cms/manual-projects").then((r) => r.json()),
      fetch("/api/cms/github-meta").then((r) => r.json()),
      fetch("/api/cms/certifications").then((r) => r.json()),
      fetch("/api/cms/site-content").then((r) => r.json()),
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
    });
    const data = await res.json();
    if (data.success) {
      setMsg(editingId ? "Projet mis à jour" : "Projet créé");
      setForm(emptyProject);
      setEditingId(null);
      load();
    } else setMsg(data.error || "Erreur");
  };

  const deleteProject = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/cms/manual-projects/${id}`, { method: "DELETE" });
    load();
  };

  const editProject = (p) => {
    setEditingId(p.id);
    setForm({
      ...p,
      technologies: (p.technologies || []).join(", "),
    });
    setTab("manual");
  };

  const uploadFile = async (e, { kind = "image", onPath } = {}) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const res = await fetch("/api/cms/upload", { method: "POST", body });
      const data = await res.json();
      if (data.success) {
        onPath(data.path);
        setMsg(kind === "cv" ? "CV téléversé" : "Image téléversée");
      } else {
        setMsg(data.error || "Échec du téléversement");
      }
    } catch {
      setMsg("Erreur réseau lors du téléversement");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const uploadImage = (e) =>
    uploadFile(e, {
      onPath: (path) => setForm((prev) => ({ ...prev, image: path })),
    });

  const saveHero = async (e) => {
    e.preventDefault();
    if (!heroForm) return;
    const { rolesText, ...rest } = heroForm;
    const payload = {
      hero: {
        ...rest,
        roles: rolesText
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean),
      },
    };
    const res = await fetch("/api/cms/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setMsg("Section hero enregistrée");
      load();
    } else setMsg(data.error || "Erreur");
  };

  const saveExperiences = async (list) => {
    const res = await fetch("/api/cms/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experiences: list }),
    });
    const data = await res.json();
    if (data.success) {
      setExperiences(data.content.experiences);
      return true;
    }
    setMsg(data.error || "Erreur");
    return false;
  };

  const saveExperience = async (e) => {
    e.preventDefault();
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
      next = [
        ...experiences,
        { ...item, id: `exp-${Date.now()}` },
      ];
    }
    if (await saveExperiences(next)) {
      setMsg(editingExpId ? "Expérience mise à jour" : "Expérience ajoutée");
      setExpForm(emptyExperience);
      setEditingExpId(null);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm("Supprimer cette expérience ?")) return;
    await saveExperiences(experiences.filter((x) => x.id !== id));
    setMsg("Expérience supprimée");
  };

  const toggleGithub = async (p, field, value) => {
    await fetch("/api/cms/github-meta", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        githubId: p.githubId,
        visible: field === "visible" ? value : p.visible !== false,
        featured: field === "featured" ? value : p.featured === true,
        order: p.order ?? 500,
      }),
    });
    load();
  };

  const saveCert = async (e) => {
    e.preventDefault();
    const url = editingCertId
      ? `/api/cms/certifications/${editingCertId}`
      : "/api/cms/certifications";
    const res = await fetch(url, {
      method: editingCertId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certForm),
    });
    const data = await res.json();
    if (data.success) {
      setMsg(editingCertId ? "Certification mise à jour" : "Certification ajoutée");
      setCertForm(emptyCert);
      setEditingCertId(null);
      load();
    }
  };

  const deleteCert = async (id) => {
    if (!confirm("Supprimer ?")) return;
    await fetch(`/api/cms/certifications/${id}`, { method: "DELETE" });
    load();
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

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {msg && (
          <p className="mb-4 text-sm text-teal" onAnimationEnd={() => setMsg("")}>
            {msg}
          </p>
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
                        onPath: (path) =>
                          setHeroForm({ ...heroForm, cvUrl: path }),
                      })
                    }
                  />
                </label>
              </div>
              <input
                className={inputClass}
                placeholder="/CV_David_Metomo.pdf"
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

            <button type="submit" className="btn-premium btn-premium--primary">
              Enregistrer le hero
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
                <button type="submit" className="btn-premium btn-premium--primary">
                  {editingExpId ? "Enregistrer" : "Ajouter"}
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
                <button type="submit" className="btn-premium btn-premium--primary">
                  {editingId ? "Enregistrer" : "Créer"}
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
                await fetch("/api/sync-projects", { method: "POST" });
                load();
                setMsg("Liste GitHub rafraîchie");
              }}
            >
              Rafraîchir depuis GitHub
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
              <button type="submit" className="btn-premium btn-premium--primary">
                {editingCertId ? "Enregistrer" : "Ajouter"}
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
