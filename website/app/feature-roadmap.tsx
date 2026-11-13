"use client";

import { useState } from "react";
import { features, statusLabels, type Language, type Status } from "./features";
import { atnSetup } from "./releases";

export default function FeatureRoadmap({ language }: { language: Language }) {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const t = (en: string, it: string) => language === "en" ? en : it;
  const visible = features.filter(feature => filter === "all" || feature.status === filter);
  return (
    <section className="feature-roadmap section-shell" id="roadmap">
      <div className="section-heading">
        <div><p className="section-kicker">02 / {t("CAPABILITIES & ROADMAP", "CAPACITÀ E ROADMAP")}</p><h2>{t("Available today.", "Disponibile oggi.")}<br /><span>{t("Taking shape next.", "In arrivo domani.")}</span></h2></div>
        <p>{t("From Android and desktop to radios, wearables and field sensors. Follow what is released, what you can test and what comes next.", "Da Android e desktop a radio, dispositivi indossabili e sensori. Scopri cosa è rilasciato, cosa puoi provare e cosa arriverà.")}</p>
      </div>
      <div className="roadmap-meta"><span>{t("RELEASE REVIEW", "AGGIORNAMENTO RELEASE")} / <time dateTime="2026-11-13">13 NOV 2026</time></span><p>{t("Preview builds are for testing. Features in development have no committed release date.", "Le anteprime sono per i test. Le funzioni in sviluppo non hanno una data di rilascio confermata.")}</p></div>
      <div className="roadmap-filters" role="group" aria-label={t("Filter capabilities by status", "Filtra capacità per stato")}>
        {(["all", "published", "preview", "development", "soon", "planned"] as const).filter(status => status === "all" || features.some(feature => feature.status === status)).map(status => <button key={status} aria-pressed={filter === status} onClick={() => setFilter(status)}>{status === "all" ? t("All capabilities", "Tutte le capacità") : statusLabels[status][language]} <span>{status === "all" ? features.length : features.filter(feature => feature.status === status).length}</span></button>)}
      </div>
      <p className="sr-only" role="status">{visible.length} {t("capabilities shown", "capacità mostrate")}</p>
      <div className="feature-grid">
        {visible.map(feature => <article className="feature-card" key={feature.id}>
          <div className="feature-top"><span className={`feature-status ${feature.status}`}>{statusLabels[feature.status][language]}</span>{feature.version && <span className="feature-version">{feature.version}</span>}</div>
          <p className="feature-type">{feature.type}</p><h3>{feature.name}</h3><p className="feature-summary">{feature.summary[language]}</p><p className="feature-detail">{feature.detail[language]}</p>
          {feature.url ? <a href={feature.url} target="_blank" rel="noreferrer">{feature.link?.[language]} <span aria-hidden="true">↗</span></a> : <p className="feature-pending">{feature.status === "development" ? t("Development updates to follow", "Seguiranno aggiornamenti sullo sviluppo") : t("Release details coming soon", "Dettagli del rilascio a breve")}</p>}
        </article>)}
      </div>
      <div className="roadmap-sequence"><strong>{t("BINOCULARS ↔ SHARED MAP", "BINOCOLO ↔ MAPPA CONDIVISA")}</strong><p>{t("BinoX measurements → REM markers → team replication. Selected and permitted nearby REM points → BinoX display.", "Misurazioni BinoX → marker REM → replica al team. Punti REM selezionati e marker vicini autorizzati → display BinoX.")}</p><a href={atnSetup} target="_blank" rel="noreferrer">{t("Set up the BinoX plugin", "Configura il plugin BinoX")} ↗</a></div>
    </section>
  );
}
