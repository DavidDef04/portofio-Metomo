import fs from "fs";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { TRACKED_EVENTS } from "@/lib/track";

/**
 * Lecture des statistiques GA4 (API Google Analytics Data) avec un compte de
 * service. Variables Vercel :
 *  - GA4_PROPERTY_ID : identifiant numérique de la propriété GA4
 *  - GOOGLE_APPLICATION_CREDENTIALS_JSON (recommandé) : contenu JSON de la clé
 *    (GOOGLE_APPLICATION_CREDENTIALS est aussi accepté s'il contient le JSON
 *    ou un chemin de fichier)
 */
function loadCredentials() {
  const candidates = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON,
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
  ].filter(Boolean);

  for (const raw of candidates) {
    const value = raw.trim();
    if (value.startsWith("{")) return JSON.parse(value);
    // Valeur encodée en base64
    if (/^[A-Za-z0-9+/=]{200,}$/.test(value)) {
      const decoded = Buffer.from(value, "base64").toString("utf-8");
      if (decoded.trim().startsWith("{")) return JSON.parse(decoded);
    }
    if (fs.existsSync(value)) return JSON.parse(fs.readFileSync(value, "utf-8"));
  }
  return null;
}

export function ga4Status() {
  const propertyId = (process.env.GA4_PROPERTY_ID || "").trim();
  let credentials = null;
  let credentialsError = "";
  try {
    credentials = loadCredentials();
  } catch (e) {
    credentialsError = e.message;
  }
  return { propertyId, credentials, credentialsError };
}

function rows(report, dims = 1) {
  return (report?.rows || []).map((r) => ({
    dims: (r.dimensionValues || []).slice(0, dims).map((d) => d.value),
    values: (r.metricValues || []).map((m) => Number(m.value) || 0),
  }));
}

export async function fetchDashboardStats(days = 28) {
  const { propertyId, credentials, credentialsError } = ga4Status();
  if (!propertyId || !credentials) {
    const err = new Error(
      !propertyId
        ? "GA4_PROPERTY_ID manquant dans les variables Vercel."
        : credentialsError
          ? `Clé du compte de service illisible : ${credentialsError}`
          : "Clé du compte de service absente (GOOGLE_APPLICATION_CREDENTIALS_JSON)."
    );
    err.code = "NOT_CONFIGURED";
    throw err;
  }

  const client = new BetaAnalyticsDataClient({ credentials });
  const property = `properties/${propertyId}`;
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];
  const eventNames = Object.keys(TRACKED_EVENTS);

  const [batch1] = await client.batchRunReports({
    property,
    requests: [
      {
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
      },
      {
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
      {
        dateRanges,
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 8,
      },
      {
        dateRanges,
        dimensions: [{ name: "sessionSource" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
      {
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: { fieldName: "eventName", inListFilter: { values: eventNames } },
        },
      },
    ],
  });

  const [batch2] = await client.batchRunReports({
    property,
    requests: [
      {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      },
      {
        dateRanges,
        dimensions: [{ name: "linkUrl" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: ["project_visit", "project_code"] },
          },
        },
        orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
        limit: 10,
      },
      {
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }],
      },
    ],
  });

  let realtime = null;
  try {
    const [rt] = await client.runRealtimeReport({
      property,
      metrics: [{ name: "activeUsers" }],
    });
    realtime = Number(rt?.rows?.[0]?.metricValues?.[0]?.value || 0);
  } catch {
    realtime = null;
  }

  const [totals, daily, countries, sources, events] = batch1.reports;
  const [pages, projectLinks, devices] = batch2.reports;
  const t = rows(totals, 0)[0]?.values || [0, 0, 0, 0, 0];
  const eventCounts = Object.fromEntries(eventNames.map((n) => [n, 0]));
  for (const r of rows(events)) eventCounts[r.dims[0]] = r.values[0];

  return {
    days,
    realtime,
    totals: {
      users: t[0],
      newUsers: t[1],
      sessions: t[2],
      pageViews: t[3],
      avgSessionSeconds: Math.round(t[4]),
    },
    daily: rows(daily).map((r) => ({ date: r.dims[0], users: r.values[0], views: r.values[1] })),
    countries: rows(countries).map((r) => ({ name: r.dims[0], value: r.values[0] })),
    sources: rows(sources).map((r) => ({ name: r.dims[0], value: r.values[0] })),
    pages: rows(pages).map((r) => ({ name: r.dims[0], value: r.values[0], users: r.values[1] })),
    projectLinks: rows(projectLinks).map((r) => ({ name: r.dims[0], value: r.values[0] })),
    devices: rows(devices).map((r) => ({ name: r.dims[0], value: r.values[0] })),
    events: eventCounts,
    eventLabels: TRACKED_EVENTS,
  };
}
