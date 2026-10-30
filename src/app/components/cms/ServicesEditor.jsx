"use client";
import { useEffect, useState } from "react";

const ICONS = [
  ["globe", "Globe (site vitrine)"],
  ["cart", "Panier (e-commerce)"],
  ["layers", "Couches (SaaS)"],
  ["code", "Code (sur mesure)"],
  ["mobile", "Mobile"],
  ["shield", "Bouclier (sécurité)"],
  ["tools", "Outils (maintenance)"],
];

const toLines = (txt) =>
  (txt || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** Convertit un service stocké en formulaire éditable (listes → texte). */
function toForm(s) {
  return {
    ...s,
    pointsText: (s.points || []).join("\n"),
    pointsText_en: (s.points_en || []).join("\n"),
  };
}

function fromForm(f) {
  const { pointsText, pointsText_en, ...rest } = f;
  return {
    ...rest,
    points: toLines(pointsText),
    points_en: toLines(pointsText_en),
    order: Number(f.order) || 100,
    visible: f.visible !== false,
  };
}

/**
 * Éditeur de la section Services : une carte repliable par offre, champs
 * français et anglais, ajout / suppression, enregistrement groupé.
 */
export default function ServicesEditor({ services, onSave, inputClass, confirmAction, saving }) {
  const [items, setItems] = useState(() => (services || []).map(toForm));
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    setItems((services || []).map(toForm));
  }, [services]);

  const update = (id, patch) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const add = () => {
    const id = `svc-${Date.now()}`;
    const order = Math.max(0, ...items.map((i) => Number(i.order) || 0)) + 10;
    setItems((list) => [
      ...list,
      { id, icon: "code", title: "Nouveau service", description: "", pointsText: "", visible: true, order },
    ]);
    setOpenId(id);
  };

  const remove = async (it) => {
    const ok = await confirmAction({
      title: `Supprimer « ${it.title} » ?`,
      message: "Pour la retirer du site sans la perdre, décochez plutôt « Visible ».",
    });
    if (ok) setItems((list) => list.filter((x) => x.id !== it.id));
  };

  const submit = (e) => {
    e.preventDefault();
    onSave(items.map(fromForm));
  };

  const sorted = [...items].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

  return (
    <form onSubmit={submit} className="w-full max-w-3xl space-y-4">
      <div>
        <h2 className="font-display text-bone text-lg">Services</h2>
        <p className="text-mist text-sm">
          Les offres affichées dans la section Services du site, chacune avec un bouton « Demander
          un devis » vers WhatsApp. Pas de prix affiché.
        </p>
      </div>

      {sorted.map((it) => {
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
                <p className="text-bone text-sm font-medium truncate">{it.title || "Sans titre"}</p>
                <p className="text-mist text-xs">
                  Ordre {it.order} · {it.visible !== false ? "Visible" : "Masqué"}
                  {it.title_en ? ` · EN : ${it.title_en}` : " · EN à compléter"}
                </p>
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
                <div className="grid sm:grid-cols-[1fr_auto_auto] gap-3">
                  <div>
                    <label className="label-mono !text-[0.6rem] block mb-1">Titre</label>
                    <input
                      className={inputClass}
                      value={it.title || ""}
                      onChange={(e) => update(it.id, { title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="label-mono !text-[0.6rem] block mb-1">Icône</label>
                    <select
                      className={inputClass}
                      value={it.icon || "code"}
                      onChange={(e) => update(it.id, { icon: e.target.value })}
                    >
                      {ICONS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="label-mono !text-[0.6rem] block mb-1">Ordre</label>
                    <input
                      className={inputClass}
                      type="number"
                      value={it.order ?? 100}
                      onChange={(e) => update(it.id, { order: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label-mono !text-[0.6rem] block mb-1">Description</label>
                  <textarea
                    className={`${inputClass} resize-y`}
                    rows={3}
                    value={it.description || ""}
                    onChange={(e) => update(it.id, { description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label-mono !text-[0.6rem] block mb-1">
                    Points clés (un par ligne)
                  </label>
                  <textarea
                    className={`${inputClass} resize-y`}
                    rows={3}
                    value={it.pointsText || ""}
                    onChange={(e) => update(it.id, { pointsText: e.target.value })}
                  />
                </div>

                <details className="border border-border p-4" style={{ borderRadius: "var(--radius-cut)" }}>
                  <summary className="cursor-pointer text-sm text-bone">Version anglaise (EN)</summary>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="label-mono !text-[0.6rem] block mb-1">Titre</label>
                      <input
                        className={inputClass}
                        value={it.title_en || ""}
                        onChange={(e) => update(it.id, { title_en: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label-mono !text-[0.6rem] block mb-1">Description</label>
                      <textarea
                        className={`${inputClass} resize-y`}
                        rows={3}
                        value={it.description_en || ""}
                        onChange={(e) => update(it.id, { description_en: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="label-mono !text-[0.6rem] block mb-1">
                        Points clés (un par ligne)
                      </label>
                      <textarea
                        className={`${inputClass} resize-y`}
                        rows={3}
                        value={it.pointsText_en || ""}
                        onChange={(e) => update(it.id, { pointsText_en: e.target.value })}
                      />
                    </div>
                  </div>
                </details>

                <button type="button" className="text-xs text-ember" onClick={() => remove(it)}>
                  Supprimer ce service
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn-premium btn-premium--ghost" onClick={add}>
          Ajouter un service
        </button>
        <button
          type="submit"
          disabled={saving}
          className="btn-premium btn-premium--primary disabled:opacity-50"
        >
          {saving ? "Enregistrement…" : "Enregistrer les services"}
        </button>
      </div>
    </form>
  );
}
