import type { Language } from "./features";

const steps = [
  { icon: "radio", title: { en: "Radio report", it: "Segnalazione radio" }, text: { en: "An operator reports a blocked road in everyday language. SIGIL is intended to transcribe it into chat and turn a specific report into an event.", it: "Un operatore segnala una strada bloccata con parole semplici. SIGIL è pensato per trascrivere il messaggio in chat e trasformare una segnalazione specifica in un evento." }, status: { en: "SIGIL · In development", it: "SIGIL · In sviluppo" } },
  { icon: "drone", title: { en: "Aerial context", it: "Contesto dall’alto" }, text: { en: "A drone captures an image of the affected area for the team’s map. Image delivery and attachment are part of the target workflow.", it: "Un drone acquisisce un’immagine dell’area interessata per la mappa del team. L’invio e l’allegato dell’immagine fanno parte del flusso previsto." }, status: { en: "Image workflow · Target", it: "Flusso immagini · Obiettivo" } },
  { icon: "binoculars", title: { en: "Observe and mark", it: "Osserva e segnala" }, text: { en: "An operator uses BinoX measurements to create a geographic marker in REM. Live video is a separate Wi-Fi/IP path, outside Reticulum.", it: "Un operatore usa le misurazioni BinoX per creare un marker geografico in REM. Il video in diretta usa un collegamento Wi-Fi/IP separato, fuori da Reticulum." }, status: { en: "Markers · Published / Video · In development", it: "Marker · Pubblicati / Video · In sviluppo" } },
  { icon: "mesh", title: { en: "Connect the field", it: "Collega il campo" }, text: { en: "Reticulum carries encrypted information across available links, including LoRa and TCP. The originating analog radio voice and live video use their own paths.", it: "Reticulum trasporta informazioni cifrate sui collegamenti disponibili, tra cui LoRa e TCP. La voce radio analogica originale e il video in diretta usano collegamenti propri." }, status: { en: "Reticulum / Fabric · Published", it: "Reticulum / Fabric · Pubblicato" } },
  { icon: "hub", title: { en: "Coordinate through RCH", it: "Coordina con RCH" }, text: { en: "RCH brings reports and map information together for authorized participants, supporting a shared operational picture.", it: "RCH raccoglie segnalazioni e informazioni sulla mappa per i partecipanti autorizzati, sostenendo un quadro operativo condiviso." }, status: { en: "RCH Python · Published / Rust · Preview", it: "RCH Python · Pubblicato / Rust · Anteprima" } },
  { icon: "devices", title: { en: "Keep the team informed", it: "Aggiorna il team" }, text: { en: "Team members follow available updates on phones and computers; the REM watch integration brings selected status to the wrist.", it: "I membri del team seguono gli aggiornamenti disponibili su telefoni e computer; l’integrazione con l’orologio REM porta al polso alcuni stati selezionati." }, status: { en: "Watch plugin · Published / Watch app · Preview", it: "Plugin orologio · Pubblicato / App orologio · Anteprima" } },
] as const;

function ScenarioIcon({ name }: { name: typeof steps[number]["icon"] }) {
  const paths = {
    radio: <><rect x="7" y="9" width="14" height="18" rx="2" /><path d="M10 9 8 3m3 10h6m-6 4h6m-5 5h4" /></>,
    drone: <><path d="m8 9 6 5m10-5-6 5M8 23l6-5m10 5-6-5M14 13h4v6h-4z" /><circle cx="6" cy="7" r="3" /><circle cx="26" cy="7" r="3" /><circle cx="6" cy="25" r="3" /><circle cx="26" cy="25" r="3" /></>,
    binoculars: <><circle cx="9" cy="21" r="6" /><circle cx="23" cy="21" r="6" /><path d="m4 18 4-10h4l2 11m14-1L24 8h-4l-2 11m-4-4h4" /></>,
    mesh: <><circle cx="16" cy="16" r="3" /><circle cx="5" cy="7" r="2" /><circle cx="27" cy="7" r="2" /><circle cx="5" cy="26" r="2" /><circle cx="27" cy="26" r="2" /><path d="m7 8 7 6m11-6-7 6M7 25l7-7m11 7-7-7" /></>,
    hub: <><rect x="6" y="6" width="20" height="9" rx="2" /><rect x="6" y="18" width="20" height="9" rx="2" /><path d="M10 10h1m-1 12h1m4-12h7m-7 12h7" /></>,
    devices: <><rect x="3" y="7" width="16" height="12" rx="1" /><path d="M8 23h7m-3-4v4" /><rect x="22" y="10" width="6" height="12" rx="1" /><path d="M24 7h2m-2 18h2" /></>,
  };
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

export default function OperationalScenario({ language }: { language: Language }) {
  const t = (en: string, it: string) => language === "en" ? en : it;
  return <section className="operational-scenario" aria-labelledby="operational-scenario-title">
    <div className="operational-heading"><div><p className="section-kicker">{t("OPERATIONAL SCENARIO", "SCENARIO OPERATIVO")}</p><h3 id="operational-scenario-title">{t("A blocked road. A shared picture.", "Una strada bloccata. Un quadro condiviso.")}</h3></div><p>{t("A target field workflow connecting radio, observation and the team’s map.", "Un flusso operativo previsto che collega radio, osservazione e mappa del team.")}</p></div>
    <div className="operational-grid">{steps.map(step => <article key={step.icon}><div className="operational-icon"><ScenarioIcon name={step.icon} /></div><h4>{step.title[language]}</h4><p>{step.text[language]}</p><span>{step.status[language]}</span></article>)}</div>
    <p className="operational-caption">{t("This scenario describes a target integration, not an end-to-end released capability. Published components can be used individually; preview and in-development features require further integration and validation.", "Questo scenario descrive un’integrazione prevista, non una capacità completa già rilasciata. I componenti pubblicati possono essere usati singolarmente; le funzioni in anteprima e in sviluppo richiedono ulteriore integrazione e verifica.")}</p>
  </section>;
}
