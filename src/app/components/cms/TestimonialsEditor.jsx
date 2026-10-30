"use client";
import { useEffect, useState } from "react";

const EMPTY = {
  name: "",
  role: "",
  company: "",
  quote: "",
  link: "",
  role_en: "",
  quote_en: "",
  visible: true,
};

/**
 * Témoignages clients. À ne remplir qu'avec de vrais retours de clients,
 * avec leur accord pour la publication.
 */
export default function TestimonialsEditor({ testimonials, onSave, inputClass, confirmAction, saving }) {
  const [items, setItems] = useState(testimonials || []);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setItems(testimonials || []);
  }, [testimonials]);

  const update = (id, patch) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const add = () => {
    const id = `tst-${Date.now()}`;
    const order = Math.max(0, ...items.map((i) => Number(i.order) || 0)) + 10;
    setItems((list) => [...list, { ...EMPTY, id, order }]);
    setOpenId(id);
  };

  const remove = async (it) => {
    const ok = await confirmAction({
      title: `Supprimer le témoignage de ${it.name || "ce client"} ?`,
      message: "Pour le retirer du site sans le perdre, décochez plutôt « Visible ».",
    });
    if (ok) setItems((list) => list.filter((x) => x.id !== it.id));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(
      items
        .filter((it) => (it.quote || "").trim() && (it.name || "").trim())
        .map((it) => ({ ...it, order: Number(it.order) || 100, visible: it.visible !== false }))
    );
  };

  const field = (it, key, label, opts = {}) => (
    <div>
      <label className="label-mono !text-[0.6rem] block mb-1">{label}</label>
      {opts.textarea ? (
        <textarea
          className={`${inputClass} resize-y`}
          rows={4}
          placeholder={opts.placeholder}
          value={it[key] || ""}
          onChange={(e) => update(it.id, { [key]: e.target.value })}
          required={opts.required}
        />
      ) : (
        <input
          className={inputClass}
          type={opts.type || "text"}
          placeholder={opts.placeholder}
          value={it[key] || ""}
          onChange={(e) => update(it.id, { [key]: e.target.value })}
          required={opts.required}
        />
      )}
    </div>
  );

  return (
    <form onSubmit={submit} className="w-full max-w-3xl space-y-4">
      <div>
        <h2 className="font-display text-bone text-lg">Témoignages clients</h2>
        <p className="text-mist text-sm">
          Collez ici les mots exacts de vos clients, avec leur accord pour la publication. La
          section n'apparaît sur le site qu'à partir du premier témoignage visible.
        </p>
      </div>

      {items.length === 0 && (
        <p className="surface-card p-4 text-mist text-sm">Aucun témoignage pour le moment.</p>
      )}

      {items.map((it) => {
        const open = openId === it.id;
        return (
          <div key={it.id} className="surface-card p-4">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="text-left flex-1 min-w-0"
                onClick={() => setOpenId(open ? null : it.id)}
                aria-expanded={open}
              >
                <p className="text-bone text-sm font-medium truncate">
                  {it.name || "Nouveau témoignage"}
                  {it.company ? ` — ${it.company}` : ""}
                </p>
                <p className="text-mist text-xs truncate">{it.quote || "Texte à compléter"}</p>
              </button>
              <label className="flex items-center gap-1 text-xs shrink-0">
                <input
                  type="checkbox"
                  checked={it.visible !== false}
                  onChange={(e) => update(it.id, { visible: e.target.checked })}
                />
                Visible
              </label>
              <button
                type="button"
                className="text-xs text-champagne shrink-0"
                onClick={() => setOpenId(open ? null : it.id)}
              >
                {open ? "Fermer" : "Modifier"}
              </button>
            </div>

            {open && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                {field(it, "quote", "Témoignage (mots exacts du client)", { textarea: true, required: true })}
                <div className="grid sm:grid-cols-2 gap-3">
                  {field(it, "name", "Nom", { required: true, placeholder: "Prénom Nom" })}
                  {field(it, "company", "Entreprise", { placeholder: "Smart Rénov" })}
                  {field(it, "role", "Fonction", { placeholder: "Gérant" })}
                  {field(it, "link", "Lien du site (facultatif)", { type: "url", placeholder: "https://…" })}
                </div>
                <details className="border border-border p-4" style={{ borderRadius: "var(--radius-cut)" }}>
                  <summary className="cursor-pointer text-sm text-bone">Version anglaise (EN)</summary>
                  <div className="mt-4 space-y-3">
                    <p className="text-mist text-xs">
                      Traduction fidèle des mots du client. Vide = texte français affiché.
                    </p>
                    {field(it, "quote_en", "Témoignage", { textarea: true })}
                    {field(it, "role_en", "Fonction", { placeholder: "Manager" })}
                  </div>
                </details>
                <div className="w-24">{field(it, "order", "Ordre", { type: "number" })}</div>
                <button type="button" className="text-xs text-ember" onClick={() => remove(it)}>
                  Supprimer ce témoignage
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-premium btn-premium--ghost" onClick={add}>
          Ajouter un témoignage
        </button>
        <button type="submit" disabled={saving} className="btn-premium btn-premium--primary disabled:opacity-50">
          {saving ? "Enregistrement…" : "Enregistrer les témoignages"}
        </button>
      </div>
    </form>
  );
}
