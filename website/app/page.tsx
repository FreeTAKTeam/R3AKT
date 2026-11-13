"use client";

import { useEffect, useState } from "react";
import FeatureRoadmap from "./feature-roadmap";
import RustStack, { RNS_REPO } from "./rust-stack";
import Performance from "./performance";
import MotionEffects from "./motion-effects";
import RemTutorials from "./rem-tutorials";
import { lxmfStable, rchPython, rchRust, remAsset, remPluginVersions, remRelease, yaraRelease } from "./releases";
const BASE_PATH = import.meta.env.BASE_URL;

const REM_REPO = remRelease.repository;
const RCH_REPO = rchPython.repository;
const R3AKT_REPO = "https://github.com/FreeTAKTeam/R3AKTClient";
const RCH_MANIFESTO = `${RCH_REPO}/blob/main/docs/Manifesto_Reticulum_Community_Hub.md`;

const videos = [
  { label: "REM // FIELD OPERATIONS", url: "https://www.youtube.com/watch?v=CytmrXzpsps&list=PLZ5ClmhIPkfLwVjcc8HQM8EOYZ1vLepED&index=2" },
  { label: "R3AKT // RESILIENT NETWORK", url: "https://www.youtube.com/watch?v=5LzndFXAnT8" },
];

function R3AKTName() {
  return <span className="r3akt-name">R<sup>3</sup>AKT</span>;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8a9.4 9.4 0 0 0-3 18.3c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3 .8.1-.7.4-1.1.7-1.4-2.3-.3-4.6-1.1-4.6-4.7 0-1 .4-1.9 1-2.5-.1-.3-.4-1.3.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.2.2 2.2.1 2.5.6.7 1 1.5 1 2.5 0 3.6-2.3 4.4-4.6 4.7.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5A9.4 9.4 0 0 0 12 2.8Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 3v9m0 0 4-4m-4 4L6 8M4 16h12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 4.5c2.7-.9 4.8-.2 6.5 1.2 1.7-1.4 3.8-2.1 6.5-1.2v11c-2.5-.7-4.7-.2-6.5 1.2-1.8-1.4-4-1.9-6.5-1.2v-11ZM10 5.7v11" />
    </svg>
  );
}

function UseCaseIcon({ name }: { name: string }) {
  return <span className={`case-icon case-icon-${name}`} aria-hidden="true"><span /><i /><b /></span>;
}

const useCases = [
  {
    number: "01",
    icon: "field",
    title: { en: "Field operations", it: "Operazioni sul campo" },
    text: { en: "Positions, team status, events and essential messages in one shared operational picture.", it: "Posizioni, stato del team, eventi e messaggi essenziali in un quadro operativo condiviso." },
    tag: "FIELD OPS",
  },
  {
    number: "02",
    icon: "emergency",
    title: { en: "Emergency response", it: "Risposta alle emergenze" },
    text: { en: "Structured communications and operational checklists when Internet or mobile networks are unreliable.", it: "Comunicazioni strutturate e check-list operative quando Internet o la rete mobile non sono affidabili." },
    tag: "EMERGENCY",
  },
  {
    number: "03",
    icon: "community",
    title: { en: "Resilient communities", it: "Comunità resilienti" },
    text: { en: "An independent network to coordinate local groups, volunteers and distributed infrastructure.", it: "Una rete indipendente per coordinare gruppi locali, volontari e infrastrutture distribuite." },
    tag: "COMMUNITY",
  },
  {
    number: "04",
    icon: "integration",
    title: { en: "Interoperability", it: "Interoperabilità" },
    text: { en: "Connect Reticulum nodes, TAK systems and Meshtastic networks without locking operators to one transport.", it: "Collega nodi Reticulum, sistemi TAK e reti Meshtastic senza legare gli operatori a un solo trasporto." },
    tag: "INTEGRATION",
  },
];

const remCapabilities = [
  { code: "READY", title: { en: "Prepare before it matters", it: "Preparati prima che serva" }, text: { en: "Check the Ready indicator, choose a clear call sign, save trusted peers and run a short communication test before an emergency.", it: "Controlla l’indicatore Ready, scegli un nominativo chiaro, salva i peer fidati ed esegui un breve test prima di un’emergenza." } },
  { code: "STATUS", title: { en: "Report condition at a glance", it: "Comunica lo stato a colpo d’occhio" }, text: { en: "Action Messages summarize security, capability, supplies and power, health, movement and communications as green, yellow, red or unknown.", it: "Gli Action Message riassumono sicurezza, capacità, scorte ed energia, salute, movimento e comunicazioni in verde, giallo, rosso o sconosciuto." } },
  { code: "EVENTS", title: { en: "Keep the timeline clear", it: "Mantieni chiara la sequenza degli eventi" }, text: { en: "MECP events turn clear choices into compact emergency codes. Household reports show All Home, Someone Missing, Evacuated or Needs Help; SOS activation and cancellation also appear as events.", it: "Gli eventi MECP trasformano scelte chiare in codici compatti. Lo stato familiare indica Tutti a casa, Qualcuno assente, Evacuati o Serve aiuto; anche attivazione e annullamento SOS generano eventi." } },
  { code: "TASKS", title: { en: "Turn plans into checklists", it: "Trasforma i piani in checklist" }, text: { en: "Prepare power-outage, evacuation and shelter-in-place playbooks while conditions are calm. Under stress, follow tasks instead of relying on memory.", it: "Prepara in anticipo procedure per blackout, evacuazione e permanenza al riparo. Sotto stress, segui le attività invece di affidarti alla memoria." } },
  { code: "MAP", title: { en: "Share the operational picture", it: "Condividi il quadro operativo" }, text: { en: "Create and share map markers with your active team. Team membership controls operational replication; saved contacts outside the team can still chat and receive household status and SOS.", it: "Crea e condividi marker con il team attivo. L’appartenenza al team controlla la replica operativa; i contatti salvati esterni al team possono ancora usare chat e ricevere stato familiare e SOS." } },
  { code: "SOS", title: { en: "Escalate real distress", it: "Segnala un pericolo reale" }, text: { en: "SOS can send trusted peers an emergency message, battery state and location, with repeated updates while the emergency remains active.", it: "SOS può inviare ai peer fidati un messaggio d’emergenza, lo stato della batteria e la posizione, ripetendo gli aggiornamenti finché l’emergenza resta attiva." } },
];

const remScenarios = [
  { en: "Power outage", it: "Blackout", detail: { en: "Report limited power, check batteries and generator, reduce loads and confirm group status.", it: "Segnala energia limitata, controlla batterie e generatore, riduci i carichi e conferma lo stato del gruppo." } },
  { en: "Evacuation", it: "Evacuazione", detail: { en: "Coordinate routes, people, medication, pets, fuel and destination check-ins.", it: "Coordina percorsi, persone, medicinali, animali, carburante e conferme all’arrivo." } },
  { en: "Shelter in place", it: "Permanenza al riparo", detail: { en: "Schedule check-ins and track supplies, health and communications without repetitive chat.", it: "Programma i check-in e monitora scorte, salute e comunicazioni senza chat ripetitive." } },
  { en: "Severe weather", it: "Maltempo estremo", detail: { en: "Report blocked roads, flooding, visibility, air quality and local resource needs.", it: "Segnala strade bloccate, allagamenti, visibilità, qualità dell’aria e necessità locali." } },
  { en: "Outdoor groups", it: "Gruppi all’aperto", detail: { en: "Coordinate camp, trail conditions, delays, rest stops and safe return when separated.", it: "Coordina campo, sentieri, ritardi, soste e rientro sicuro quando il gruppo è separato." } },
  { en: "Communications drill", it: "Esercitazione radio", detail: { en: "Once a month: check Ready, announce, confirm peers, send chat and test events, map and SOS safely.", it: "Una volta al mese: controlla Ready, annuncia, conferma i peer e prova chat, eventi, mappa e SOS in sicurezza." } },
];

export default function Home() {
  const [language, setLanguage] = useState<"en" | "it">("en");
  const t = (en: string, it: string) => language === "en" ? en : it;
  const downloads = [
    { name: "REM", meta: `Android · ${remRelease.tag} · Complete / Light`, url: remRelease.notes },
    { name: "LXMF-rs / RNS", meta: `${t("Stable", "Stabile")} · ${lxmfStable.tag}`, url: lxmfStable.notes },
    { name: "YARA", meta: `Desktop beta · ${yaraRelease.tag}`, url: yaraRelease.notes },
    { name: "ATN BinoX plugin", meta: `Android APK · ${remPluginVersions.atn}`, url: remAsset("atn-rangefinder.apk") },
    { name: "RCH Python", meta: `${t("Published", "Pubblicato")} · ${rchPython.tag}`, url: rchPython.notes },
    { name: "RCH 3.0 Rust", meta: `Linux AMD64 · ${rchRust.tag.slice(1)}`, url: rchRust.notes },
  ];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <main>
      <MotionEffects language={language} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label={t("R3AKT — back to top", "R3AKT — torna all'inizio")}>
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="brand-name"><R3AKTName /> <small>ECOSYSTEM</small></span>
        </a>

        <nav className="desktop-nav" aria-label={t("Main navigation", "Navigazione principale")}>
          <a href="#projects">{t("Projects", "Progetti")}</a>
          <a href="#roadmap">{t("What’s new", "Novità")}</a>
          <a href="#use-cases">{t("Use cases", "Casi d’uso")}</a>
          <a href="#rust-stack">Rust RNS</a>
          <a href="#manifesto">{t("Manifesto", "Manifesto")}</a>
          <a href="#performance">{t("Benchmarks", "Benchmark")}</a>
          <a href="#resources">{t("Resources", "Risorse")}</a>
        </nav>

        <div className="header-actions">
          <div className="language-switch" role="group" aria-label={t("Language", "Lingua")}>
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
            <button className={language === "it" ? "active" : ""} onClick={() => setLanguage("it")} aria-pressed={language === "it"}>IT</button>
          </div>
          <details className="download-menu">
            <summary className="header-cta"><DownloadIcon /> {t("Download", "Scarica")} <span className="menu-chevron">⌄</span></summary>
            <div className="download-panel">
              {downloads.map((item) => (
                <a href={item.url} target="_blank" rel="noreferrer" key={item.name}>
                  <span><strong>{t("Download", "Scarica")} {item.name}</strong><small>{item.meta}</small></span><ArrowIcon />
                </a>
              ))}
            </div>
          </details>
        </div>

        <details className="mobile-menu">
          <summary aria-label={t("Open menu", "Apri menu")}><span /><span /></summary>
          <nav aria-label={t("Mobile navigation", "Navigazione mobile")}>
            <div className="mobile-language">
              <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
              <button className={language === "it" ? "active" : ""} onClick={() => setLanguage("it")}>IT</button>
            </div>
            <a href="#projects">{t("Projects", "Progetti")}</a>
            <a href="#roadmap">{t("What’s new", "Novità")}</a>
            <a href="#use-cases">{t("Use cases", "Casi d’uso")}</a>
            <a href="#rust-stack">Rust RNS</a>
            <a href="#manifesto">{t("Manifesto", "Manifesto")}</a>
            <a href="#performance">{t("Benchmarks", "Benchmark")}</a>
            <a href="#resources">{t("Resources", "Risorse")}</a>
            {downloads.map((item) => <a href={item.url} key={item.name}>{t("Download", "Scarica")} {item.name}</a>)}
          </nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> <R3AKTName /> // RETICULUM RESILIENT RESPONSE TACTICAL KIT</div>
          <h1>
            <R3AKTName /><br />
            <em>Democratizing Situational Awareness</em>
          </h1>
          <p className="hero-lede">
            {t(
              "R³AKT brings sovereign situational awareness to the field with REM, RCH and YARA. At its foundation is LXMF-rs: FreeTAKTeam’s own Rust implementation of the Reticulum Network Stack (RNS) and LXMF messaging, with reusable libraries, a typed SDK and daemons.",
              "R³AKT porta sul campo la consapevolezza situazionale sovrana con REM, RCH e YARA. Alla base c’è LXMF-rs: l’implementazione Rust di FreeTAKTeam dello stack di rete Reticulum (RNS) e della messaggistica LXMF, con librerie riutilizzabili, SDK tipizzato e daemon."
            )}
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={remRelease.notes} target="_blank" rel="noreferrer">
              <DownloadIcon /> {t("Download REM for Android", "Scarica REM per Android")}
            </a>
            <a className="button button-secondary" href="#rust-stack">
              {t("Explore our Rust RNS stack", "Esplora il nostro stack RNS Rust")} <ArrowIcon />
            </a>
          </div>
          <div className="hero-proof">
            <span><i className="check" /> {t("End-to-end encryption", "Crittografia end-to-end")}</span>
            <span><i className="check" /> Offline-first</span>
            <span><i className="check" /> Open source</span>
          </div>
        </div>

        <div className="network-stage" aria-label={t("R3AKT ecosystem diagram", "Diagramma dell’ecosistema R3AKT")}>
          <div className="radar-sweep" aria-hidden="true" />
          <div className="network-orbit orbit-one" aria-hidden="true"><i /></div>
          <div className="network-orbit orbit-two" aria-hidden="true"><i /></div>
          <div className="signal-ring ring-a" />
          <div className="signal-ring ring-b" />
          <div className="connection-line line-a" />
          <div className="connection-line line-b" />

          <div className="node-card phone-card">
            <div className="phone-top"><span>R³AKT // REM</span><i /></div>
            <div className="phone-map">
              <span className="map-line m1" />
              <span className="map-line m2" />
              <span className="map-line m3" />
              <span className="map-dot d1" />
              <span className="map-dot d2" />
              <span className="map-dot d3" />
            </div>
            <div className="phone-status">
              <span><i className="status-green" />TEAM 04</span>
              <b>OPERATIONAL</b>
            </div>
          </div>

          <div className="node-card hub-card">
            <span className="node-label">R³AKT // RCH</span>
            <strong>NODE ONLINE</strong>
            <div className="hub-bars"><i /><i /><i /><i /><i /></div>
            <div className="hub-meta"><span>12 peers</span><span>04 routes</span></div>
          </div>

          <div className="mesh-node node-one"><i /> RNode</div>
          <div className="mesh-node node-two"><i /> TCP</div>
          <div className="mesh-node node-three"><i /> TAK</div>
          <div className="live-pill"><span /> MESH ACTIVE</div>
          <span className="demo-caption">{t("NETWORK ILLUSTRATION", "ILLUSTRAZIONE DI RETE")}</span>
        </div>
      </section>

      <section className="tech-strip" aria-label={t("Technical features", "Caratteristiche tecniche")}>
        <span>R³AKT ECOSYSTEM</span><i />
        <span>ANDROID CLIENT</span><i />
        <span>LXMF-rs / RUST RNS</span><i />
        <span>RETICULUM + LXMF</span><i />
        <span>RADIO / TCP / LORA</span><i />
        <span>OPEN SOURCE</span>
      </section>

      <RustStack language={language} />
      <Performance language={language} />

      <section className="projects section-shell" id="projects">
        <div className="section-heading">
          <div>
            <p className="section-kicker">01 / {t("THE PLATFORM", "LA PIATTAFORMA")}</p>
            <h2>{t("One product family.", "Un’unica famiglia di prodotti.")}<br /><span>{t("An expanding field ecosystem.", "Un ecosistema operativo in crescita.")}</span></h2>
          </div>
          <p>{t("From the operator’s device to the coordination node: explore published apps, testing previews and the next integrations.", "Dal dispositivo dell’operatore al nodo di coordinamento: scopri app rilasciate, anteprime di test e prossime integrazioni.")}</p>
        </div>

        <div className="product-grid">
          <article className="product-card rem-card">
            <div className="product-topline">
              <span className="product-code"><small><R3AKTName /> /</small> REM</span>
              <span className="release-badge"><i /> RELEASE · {remRelease.tag}</span>
            </div>
            <div className="product-logo rem-logo">
              <img src={`${BASE_PATH}rem-logo.png`} alt="REM logo" />
            </div>
            <p className="product-type">MOBILE CLIENT / ANDROID</p>
            <h3>Reticulum Emergency Management</h3>
            <p className="product-description">{t("The field application for communications, team location and a shared operational picture over Reticulum.", "L’applicazione da campo per comunicare, localizzare il team e mantenere un quadro operativo condiviso su Reticulum.")}</p>
            <ul>
              <li><span>01</span> {t("Encrypted chat and peer discovery", "Chat cifrata e peer discovery")}</li>
              <li><span>02</span> {t("Dashboard, events and team status", "Dashboard, eventi e stato del team")}</li>
              <li><span>03</span> {t("Shared markers and provisional sensor geometry", "Marker condivisi e geometria dei sensori in anteprima")}</li>
              <li><span>04</span> {t("RNode and radio link support", "Supporto RNode e collegamenti radio")}</li>
            </ul>
            <div className="product-links">
              <a href={remAsset("rem-complete.apk")} target="_blank" rel="noreferrer"><DownloadIcon /> Complete APK</a>
              <a href={remAsset("rem-light.apk")} target="_blank" rel="noreferrer"><DownloadIcon /> Light APK</a>
              <a href={remRelease.notes} target="_blank" rel="noreferrer">{t("Release notes", "Note di rilascio")} <ArrowIcon /></a>
              {language === "it" && <a href="#tutorial-rem">Videoguide REM <ArrowIcon /></a>}
            </div>
          </article>

          <article className="product-card rch-card">
            <div className="product-topline">
              <span className="product-code"><small><R3AKTName /> /</small> RCH</span>
              <span className="release-badge"><i /> PYTHON · {rchPython.tag}</span>
            </div>
            <div className="product-logo rch-logo">
              <img src={`${BASE_PATH}rch-logo.png`} alt="RCH logo" />
            </div>
            <p className="product-type">COMMUNITY HUB / SERVER</p>
            <h3>Reticulum Community Hub</h3>
            <p className="product-description">{t("The Python edition provides desktop packages. The separate RCH 3.0 Rust preview includes a matched server, UI, TAK service and Reticulum daemon in its current Linux AMD64 packages.", "L’edizione Python offre pacchetti desktop. L’anteprima separata RCH 3.0 Rust include server, interfaccia, servizio TAK e daemon Reticulum abbinati nei pacchetti Linux AMD64 attuali.")}</p>
            <p className="rch-edition-note">{t("PUBLISHED", "PUBBLICATO")} / Python {rchPython.tag} · {t("PREVIEW", "ANTEPRIMA")} / Rust {rchRust.tag.slice(1)}</p>
            <ul>
              <li><span>01</span> {t("Shared topics, groups and missions", "Topic, gruppi e missioni condivise")}</li>
              <li><span>02</span> {t("Telemetry and operational picture", "Telemetria e quadro operativo")}</li>
              <li><span>03</span> {t("Federation and TAK interoperability", "Federazione e interoperabilità TAK")}</li>
              <li><span>04</span> {t("Cross-platform server and desktop", "Server e desktop multipiattaforma")}</li>
            </ul>
            <div className="product-links">
              <a href={rchPython.notes} target="_blank" rel="noreferrer"><DownloadIcon /> {t("Python release", "Release Python")}</a>
              <a href={rchRust.notes} target="_blank" rel="noreferrer">{t("Rust preview", "Anteprima Rust")}</a>
              <a href={RCH_REPO} target="_blank" rel="noreferrer"><GithubIcon /> Repository</a>
            </div>
          </article>
        </div>
      </section>

      <FeatureRoadmap language={language} />

      <section className="rem-practice" id="rem-in-practice">
        <div className="section-shell">
          <div className="section-heading light">
            <div><p className="section-kicker">03 / REM IN PRACTICE</p><h2>{t("Know what to do", "Saper cosa fare")}<br /><span>{t("when it counts.", "quando conta.")}</span></h2></div>
            <p>{t("REM is emergency coordination for families, neighbors, farms, outdoor groups and small trusted teams when normal communications are limited or overloaded.", "REM coordina famiglie, vicini, aziende agricole, gruppi all’aperto e piccoli team fidati quando le comunicazioni normali sono limitate o sovraccariche.")}</p>
          </div>
          <div className="rem-principle"><div><span>PREPARE</span><i /></div><div><span>CONNECT</span><i /></div><div><span>REPORT</span><i /></div><div><span>COORDINATE</span></div></div>
          <div className="capability-grid">
            {remCapabilities.map((item, index) => <article className="capability-card" key={item.code}><div className="capability-code"><span>0{index + 1}</span>{item.code}</div><h3>{item.title[language]}</h3><p>{item.text[language]}</p></article>)}
          </div>
          <div className="scenario-panel">
            <div className="scenario-intro"><p className="section-kicker">{t("COMMON WORKFLOWS", "FLUSSI PRINCIPALI")}</p><h3>{t("One shared picture. Six practical situations.", "Un quadro condiviso. Sei situazioni concrete.")}</h3><p>{t("Chat handles specific one-to-one details. Events keep the group timeline concise. The Dashboard turns structured reports into a quick view of who is safe, limited or needs help.", "La chat gestisce i dettagli tra due persone. Gli eventi mantengono sintetica la sequenza del gruppo. La Dashboard trasforma i rapporti strutturati in una vista immediata di chi è al sicuro, limitato o ha bisogno di aiuto.")}</p></div>
            <div className="scenario-list">{remScenarios.map((item, index) => <article key={item.en}><span>0{index + 1}</span><div><strong>{item[language]}</strong><p>{item.detail[language]}</p></div></article>)}</div>
          </div>
          <div className="rem-safety"><strong>{t("REM supports your trusted group. It does not replace emergency services.", "REM supporta il tuo gruppo fidato. Non sostituisce i servizi di emergenza.")}</strong><p>{t("If 911 or official assistance is available, use it. Test SOS only with a clear drill warning, agree location-sharing rules in advance and keep paper contacts, rally points and fallback communications.", "Se il 911 o l’assistenza ufficiale sono disponibili, usali. Prova SOS solo dichiarando chiaramente l’esercitazione, concorda prima le regole per la posizione e conserva contatti, punti di ritrovo e comunicazioni alternative su carta.")}</p></div>
        </div>
      </section>

      <section className="use-cases" id="use-cases">
        <div className="section-shell">
          <div className="section-heading light">
            <div>
              <p className="section-kicker">04 / {t("USE CASES", "CASI D’USO")}</p>
              <h2>{t("Built for the real world.", "Progettato per il mondo reale.")}</h2>
            </div>
            <p>{t("When the network is intermittent, coordination cannot be.", "Quando la rete è intermittente, il coordinamento non può esserlo.")}</p>
          </div>
          <div className="use-case-grid">
            {useCases.map((item) => (
              <article className="use-card" key={item.number}>
                <div className="case-number">{item.number}</div>
                <UseCaseIcon name={item.icon} />
                <p className="case-tag">{item.tag}</p>
                <h3>{item.title[language]}</h3>
                <p>{item.text[language]}</p>
                <a href="#architecture" aria-label={`${t("Learn more", "Scopri di più")}: ${item.title[language]}`}><ArrowIcon /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="architecture section-shell" id="architecture">
        <div className="section-heading">
          <div>
            <p className="section-kicker">05 / {t("HOW IT WORKS", "COME FUNZIONA")}</p>
            <h2>{t("A network that adapts", "Una rete che si adatta")}<br /><span>{t("to the available link.", "al collegamento disponibile.")}</span></h2>
          </div>
          <p>{t("The Reticulum protocol is implemented here by FreeTAKTeam’s LXMF-rs Rust stack. REM embeds it locally; the RCH 3.0 Rust preview uses the daemon and typed SDK; YARA uses the daemon’s HTTP/WebSocket adapter. Applications share the networking foundation while retaining their own workflows.", "Il protocollo Reticulum è implementato qui dallo stack Rust LXMF-rs di FreeTAKTeam. REM lo integra localmente; l’anteprima Rust RCH 3.0 usa daemon e SDK tipizzato; YARA usa l’adattatore HTTP/WebSocket. Le applicazioni condividono la base di rete mantenendo i propri flussi.")}</p>
        </div>

        <div className="architecture-panel">
          <div className="arch-flow" aria-label={t("Architecture flow", "Flusso architetturale")}>
            <div className="arch-node endpoint">
              <span>01</span><i className="phone-shape" />
              <strong>REM</strong><small>FIELD CLIENT</small>
            </div>
            <div className="arch-link"><i /><b>ENCRYPTED</b><i /></div>
            <div className="arch-node transport">
              <span>02</span><i className="mesh-shape" />
              <strong>LXMF-rs</strong><small>RUST RNS + LXMF</small>
            </div>
            <div className="arch-link"><i /><b>ROUTED</b><i /></div>
            <div className="arch-node endpoint">
              <span>03</span><i className="server-shape" />
              <strong>RCH 3.0</strong><small>RUST EDITION / PREVIEW</small>
            </div>
          </div>
          <div className="transport-list">
            <span>reticulum-rs libraries</span><span>Typed SDK / ZeroMQ</span><span>reticulumd</span><span>RNode / TCP interfaces</span>
          </div>
        </div>
      </section>

      <section className="manifesto section-shell" id="manifesto">
        <div className="section-heading">
          <div><p className="section-kicker">06 / RCH MANIFESTO</p><h2>{t("Communication is a commons.", "La comunicazione è un bene comune.")}<br /><span>{t("Resilience is a choice.", "La resilienza è una scelta.")}</span></h2></div>
          <p>{t("RCH supports autonomous communities that need to coordinate, preserve knowledge and remain connected when centralized systems become unavailable or hostile.", "RCH sostiene comunità autonome che devono coordinarsi, preservare conoscenza e restare connesse quando i sistemi centralizzati diventano indisponibili o ostili.")}</p>
        </div>
        <div className="manifesto-panel">
          <blockquote>“RCH begins from a simple refusal: we do not accept that this is inevitable.”</blockquote>
          <div className="manifesto-copy">
            <p>{t("Modern communications have become managed services: centralized, monitored and subject to withdrawal. RCH rejects that dependency and provides infrastructure for civic, humanitarian, mutual-aid, rural and off-grid groups.", "Le comunicazioni moderne sono diventate servizi gestiti: centralizzati, monitorati e revocabili. RCH rifiuta questa dipendenza e offre infrastruttura a gruppi civici, umanitari, di mutuo aiuto, rurali e off-grid.")}</p>
            <p>{t("The hub is not another social network or a flat swarm of interchangeable devices. It starts with real communities of trust, each able to operate locally, retain its identity and federate selectively with others.", "L’hub non è un altro social network né uno sciame piatto di dispositivi intercambiabili. Parte da vere comunità di fiducia, ciascuna capace di operare localmente, conservare la propria identità e federarsi in modo selettivo.")}</p>
            <p>{t("Designed over Reticulum for scarce bandwidth, intermittent power and fragmented links, RCH favors continuity, cryptographic trust and local responsibility. Networks may split and rejoin without forcing a community to surrender control.", "Progettato su Reticulum per banda limitata, energia intermittente e collegamenti frammentati, RCH privilegia continuità, fiducia crittografica e responsabilità locale. Le reti possono separarsi e ricongiungersi senza costringere una comunità a cedere il controllo.")}</p>
          </div>
          <a className="button button-secondary" href={RCH_MANIFESTO} target="_blank" rel="noreferrer">{t("Read the full manifesto", "Leggi il manifesto completo")} <ArrowIcon /></a>
        </div>
      </section>

      <section className="videos" id="videos">
        <div className="section-shell">
          {language === "it" && <RemTutorials />}
          <div className="section-heading light"><div><p className="section-kicker">07 / MEDIA</p><h2>{t("See R³AKT in action.", "Guarda R³AKT in azione.")}</h2></div><p>{t("Introductions, demonstrations and field-oriented material from the project.", "Introduzioni, dimostrazioni e materiale operativo dal progetto.")}</p></div>
          <div className="video-grid">{videos.map((video, index) => <a className="video-card" href={video.url} target="_blank" rel="noreferrer" key={video.url}><span className="play-icon">▶</span><small>VIDEO 0{index + 1}</small><strong>{video.label}</strong><span className="watch-link">{t("WATCH ON YOUTUBE", "GUARDA SU YOUTUBE")} <ArrowIcon /></span></a>)}</div>
        </div>
      </section>

      <section className="resources" id="resources">
        <div className="section-shell">
          <div className="resource-intro">
            <p className="section-kicker">08 / {t("GET STARTED", "INIZIA ORA")}</p>
            <h2>{t("Everything you need", "Tutto ciò che serve")}<br />{t("to join the network.", "per entrare nella rete.")}</h2>
            <p>{t("Download the application, install a hub or contribute directly to the code.", "Scarica l’applicazione, installa un hub o contribuisci direttamente al codice.")}</p>
          </div>
          <div className="resource-grid">
            <a className="resource-card" href={RNS_REPO} target="_blank" rel="noreferrer">
              <span className="resource-icon"><GithubIcon /></span>
              <p>RUST RNS + LXMF</p><h3>LXMF-rs</h3>
              <small>{t("Our independent Reticulum implementation, published Rust libraries, SDK, daemons and interoperability evidence.", "La nostra implementazione indipendente di Reticulum, librerie Rust, SDK, daemon ed evidenze di interoperabilità.")}</small>
              <b>{t("EXPLORE THE STACK", "ESPLORA LO STACK")} <ArrowIcon /></b>
            </a>
            <a className="resource-card featured" href={remRelease.notes} target="_blank" rel="noreferrer">
              <span className="resource-icon"><DownloadIcon /></span>
              <p>DOWNLOAD</p><h3>{t("REM for Android", "REM per Android")}</h3>
              <small>{t("Signed Complete and Light APKs, standalone plugins and checksums.", "APK firmati Complete e Light, plugin separati e checksum.")}</small>
              <b>{t("GO TO RELEASES", "VAI ALLE RELEASE")} <ArrowIcon /></b>
            </a>
            <a className="resource-card" href={`${REM_REPO}#readme`} target="_blank" rel="noreferrer">
              <span className="resource-icon"><BookIcon /></span>
              <p>{t("DOCUMENTATION", "DOCUMENTAZIONE")}</p><h3>{t("REM guide", "Guida REM")}</h3>
              <small>{t("Features, Reticulum configuration, radio and field use.", "Funzioni, configurazione Reticulum, radio e uso sul campo.")}</small>
              <b>{t("READ THE GUIDE", "LEGGI LA GUIDA")} <ArrowIcon /></b>
            </a>
            <a className="resource-card" href={`${RCH_REPO}/tree/main/docs`} target="_blank" rel="noreferrer">
              <span className="resource-icon"><BookIcon /></span>
              <p>{t("DOCUMENTATION", "DOCUMENTAZIONE")}</p><h3>{t("RCH guide", "Guida RCH")}</h3>
              <small>{t("Installation, node configuration and integrations.", "Installazione, configurazione del nodo e integrazioni.")}</small>
              <b>{t("OPEN DOCUMENTATION", "APRI I DOCUMENTI")} <ArrowIcon /></b>
            </a>
            <a className="resource-card" href={R3AKT_REPO} target="_blank" rel="noreferrer">
              <span className="resource-icon"><GithubIcon /></span>
              <p>OPEN SOURCE</p><h3>R³AKT Client</h3>
              <small>{t("Shared Rust crates for wire formats, validation and replication used by REM and RCH.", "Crate Rust condivisi per formati di rete, validazione e replica usati da REM e RCH.")}</small>
              <b>{t("EXPLORE R³AKT", "ESPLORA R³AKT")} <ArrowIcon /></b>
            </a>
          </div>
        </div>
      </section>

      <section className="open-source-cta">
        <div className="cta-grid" aria-hidden="true" />
        <div>
          <p className="section-kicker">BUILT IN THE OPEN</p>
          <h2>{t("Situational awareness", "La consapevolezza situazionale")}<br />{t("should not be a privilege.", "non dovrebbe essere un privilegio.")}</h2>
          <p>{t("The R³AKT family is developed openly by the FreeTAKTeam community. Study the code, propose an idea or build with us.", "La famiglia R³AKT è sviluppata apertamente dalla comunità FreeTAKTeam. Studia il codice, proponi un’idea o costruisci con noi.")}</p>
        </div>
        <a className="button button-light" href="https://github.com/FreeTAKTeam" target="_blank" rel="noreferrer">
          <GithubIcon /> {t("Contribute on GitHub", "Contribuisci su GitHub")}
        </a>
      </section>

      <footer>
        <div className="footer-brand">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <div><strong><R3AKTName /></strong><small>LXMF-rs / Rust RNS · REM + RCH + YARA</small></div>
        </div>
        <div className="footer-links">
          <a href={RNS_REPO}>Rust RNS / LXMF-rs</a>
          <a href={REM_REPO}>REM</a><a href={RCH_REPO}>RCH</a><a href={yaraRelease.notes}>YARA</a><a href="#roadmap">Roadmap</a><a href="#manifesto">Manifesto</a><a href="#videos">Video</a><a href="#resources">Docs</a><a href="https://github.com/FreeTAKTeam">GitHub</a>
        </div>
        <p>Open source · See each project for its license</p>
      </footer>
    </main>
  );
}
