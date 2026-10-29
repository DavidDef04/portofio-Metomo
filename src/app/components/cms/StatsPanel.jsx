"use client";
import { useCallback, useEffect, useState } from "react";

const RANGES = [
  [7, "7 jours"],
  [28, "28 jours"],
  [90, "90 jours"],
];

// Ordre et regroupement des actions suivies
const ACTION_GROUPS = [
  ["CV", ["cv_download_fr", "cv_download_en"]],
  ["Contact", ["contact_whatsapp", "contact_email", "contact_form_sent"]],
  ["Projets & réseaux", ["project_visit", "project_code", "social_click", "language_switch"]],
];

const COUNTRY_FR = {
  Cameroon: "Cameroun",
  France: "France",
  "United States": "États-Unis",
  Canada: "Canada",
  Belgium: "Belgique",
  Switzerland: "Suisse",
  Germany: "Allemagne",
  "United Kingdom": "Royaume-Uni",
  "Côte d’Ivoire": "Côte d'Ivoire",
  Senegal: "Sénégal",
  Gabon: "Gabon",
  Nigeria: "Nigeria",
  "(not set)": "Non précisé",
};

const DEVICE_FR = { desktop: "Ordinateur", mobile: "Mobile", tablet: "Tablette" };

function fmtDuration(sec) {
  if (!sec) return "0 s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m ? `${m} min ${String(s).padStart(2, "0")} s` : `${s} s`;
}

function fmtDate(yyyymmdd) {
  const d = new Date(`${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}T12:00:00`);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function prettyPath(path) {
  if (path === "/") return "Accueil (FR)";
  if (path === "/en") return "Accueil (EN)";
  return path;
}

function prettyLink(url) {
  try {
    const u = new URL(url);
    return (u.host.replace(/^www\./, "") + u.pathname).replace(/\/$/, "");
  } catch {
    return url;
  }
}

function Kpi({ label, value, hint }) {
  return (
    <div className="surface-card p-5">
      <p className="label-mono !text-[0.6rem] mb-2">{label}</p>
      <p className="font-display text-3xl text-bone font-semibold tabular-nums">{value}</p>
      {hint && <p className="text-mist text-xs mt-1">{hint}</p>}
    </div>
  );
}

function BarList({ title, items, format = (x) => x, empty = "Pas encore de données." }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="surface-card p-5">
      <p className="label-mono !text-[0.6rem] mb-4">{title}</p>
      {items.length === 0 ? (
        <p className="text-mist text-sm">{empty}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.name}>
              <div className="flex justify-between gap-3 text-sm mb-1">
                <span className="text-bone-dim truncate">{format(i.name)}</span>
                <span className="text-bone tabular-nums shrink-0">{i.value}</span>
              </div>
              <div className="h-1 bg-elevated-2">
                <div className="h-full bg-champagne/70" style={{ width: `${(i.value / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DailyChart({ daily }) {
  if (!daily.length) {
    return <p className="text-mist text-sm">Pas encore de visites sur la période.</p>;
  }
  const max = Math.max(1, ...daily.map((d) => d.users));
  return (
    <div>
      <div className="flex items-end gap-[3px] h-36" role="img" aria-label="Visiteurs par jour">
        {daily.map((d) => (
          <div key={d.date} className="flex-1 min-w-0 group relative h-full flex items-end">
            <div
              className="w-full bg-champagne/60 group-hover:bg-champagne transition-colors"
              style={{ height: `${Math.max(2, (d.users / max) * 100)}%` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] bg-elevated-2 text-bone px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {fmtDate(d.date)} · {d.users} visiteur{d.users > 1 ? "s" : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-mist text-[0.65rem] mt-2">
        <span>{fmtDate(daily[0].date)}</span>
        <span>{fmtDate(daily[daily.length - 1].date)}</span>
      </div>
    </div>
  );
}

export default function StatsPanel() {
  const [days, setDays] = useState(28);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (d) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cms/analytics?days=${d}`, { cache: "no-store" });
      const json = await res.json();
      if (!json.success) {
        setError({ message: json.error, notConfigured: json.notConfigured });
        setData(null);
      } else {
        setData(json.stats);
      }
    } catch (e) {
      setError({ message: e.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-bone text-lg">Statistiques du portfolio</h2>
          <p className="text-mist text-sm">
            Visites et actions des visiteurs (Google Analytics).
            {data?.realtime != null && (
              <span className="ml-2 inline-flex items-center gap-1.5 text-bone">
                <span className="availability-dot" aria-hidden />
                {data.realtime} en ce moment
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Période">
          {RANGES.map(([d, label]) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              aria-pressed={days === d}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                days === d
                  ? "border-champagne text-champagne bg-champagne/5"
                  : "border-border text-mist hover:text-bone"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-mist text-sm">Chargement des statistiques…</p>}

      {error && !loading && (
        <div className="surface-card p-5 border border-ember/40">
          <p className="text-ember text-sm font-medium mb-2">
            {error.notConfigured
              ? "Les statistiques ne sont pas encore connectées."
              : "Impossible de lire les statistiques."}
          </p>
          <p className="text-mist text-sm mb-3">{error.message}</p>
          {error.notConfigured && (
            <ol className="text-mist text-sm list-decimal pl-5 space-y-1">
              <li>Google Cloud : activez « Google Analytics Data API » et créez un compte de service avec une clé JSON.</li>
              <li>Google Analytics → Admin → Gestion des accès à la propriété : ajoutez l'e-mail du compte de service (rôle Lecteur).</li>
              <li>Vercel → Environment Variables : GA4_PROPERTY_ID et GOOGLE_APPLICATION_CREDENTIALS_JSON (contenu du fichier JSON), puis redéployez.</li>
            </ol>
          )}
        </div>
      )}

      {data && !loading && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi label="Visiteurs" value={data.totals.users} hint={`dont ${data.totals.newUsers} nouveaux`} />
            <Kpi label="Pages vues" value={data.totals.pageViews} />
            <Kpi label="Sessions" value={data.totals.sessions} />
            <Kpi label="Durée moyenne" value={fmtDuration(data.totals.avgSessionSeconds)} hint="par session" />
          </div>

          <div className="surface-card p-5">
            <p className="label-mono !text-[0.6rem] mb-4">Visiteurs par jour</p>
            <DailyChart daily={data.daily} />
          </div>

          <div className="surface-card p-5">
            <p className="label-mono !text-[0.6rem] mb-4">Actions des visiteurs</p>
            <div className="grid md:grid-cols-3 gap-6">
              {ACTION_GROUPS.map(([group, names]) => (
                <div key={group}>
                  <p className="text-bone text-sm font-medium mb-3">{group}</p>
                  <ul className="space-y-2">
                    {names.map((n) => (
                      <li key={n} className="flex justify-between gap-3 text-sm">
                        <span className="text-mist">{data.eventLabels[n]}</span>
                        <span className="text-bone tabular-nums">{data.events[n] ?? 0}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-mist text-xs mt-4">
              Les nouvelles actions peuvent mettre jusqu'à 24 à 48 h à apparaître dans Google Analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <BarList title="Pays" items={data.countries} format={(n) => COUNTRY_FR[n] || n} />
            <BarList
              title="Provenance des visites"
              items={data.sources}
              format={(n) => (n === "(direct)" ? "Accès direct" : n)}
            />
            <BarList title="Pages consultées" items={data.pages} format={prettyPath} />
            <BarList
              title="Projets ouverts"
              items={data.projectLinks}
              format={prettyLink}
              empty="Aucun clic sur un projet pour l'instant."
            />
            <BarList title="Appareils" items={data.devices} format={(n) => DEVICE_FR[n] || n} />
          </div>
        </>
      )}
    </div>
  );
}
