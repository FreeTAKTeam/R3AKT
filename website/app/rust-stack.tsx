import type { Language } from "./features";
import { lxmfStable } from "./releases";

export const RNS_REPO = lxmfStable.repository;

export default function RustStack({ language }: { language: Language }) {
  const t = (en: string, it: string) => language === "en" ? en : it;
  return (
    <section className="rust-stack section-shell" id="rust-stack">
      <div className="section-heading">
        <div><p className="section-kicker">THE FOUNDATION / FREETAKTEAM</p><h2>{t("Our RNS implementation.", "La nostra implementazione RNS.")}<br /><span>{t("Reticulum, in Rust.", "Reticulum, in Rust.")}</span></h2></div>
        <p>{t("LXMF-rs is FreeTAKTeam’s independent Rust implementation of the Reticulum Network Stack (RNS) and LXMF messaging. It is the networking foundation behind this ecosystem—and a reusable stack for your own applications.", "LXMF-rs è l’implementazione indipendente in Rust di FreeTAKTeam dello stack di rete Reticulum (RNS) e della messaggistica LXMF. È la base di rete di questo ecosistema e uno stack riutilizzabile nelle tue applicazioni.")}</p>
      </div>
      <div className="rust-foundation">
        <div className="rust-identity"><span className="feature-status published">{t("Published", "Pubblicato")} · {lxmfStable.tag}</span><p>RNS + LXMF + SDK</p><h3>LXMF-rs</h3><p>{t("A native networking stack. Libraries, daemons and developer tools from one maintained Rust workspace.", "Uno stack di rete nativo. Librerie, daemon e strumenti per sviluppatori da un unico workspace Rust mantenuto.")}</p><div className="rust-links"><a className="button button-primary" href={lxmfStable.notes} target="_blank" rel="noreferrer">{t("Get the Rust stack", "Scarica lo stack Rust")} ↗</a><a href="#performance">{t("Explore the benchmarks", "Esplora i benchmark")} ↓</a><a href={RNS_REPO} target="_blank" rel="noreferrer">{t("Explore the source", "Esplora il sorgente")} ↗</a></div></div>
        <div className="rust-capabilities">
          <article><span>01 / NETWORK</span><h4>{t("Reticulum networking in Rust", "Rete Reticulum in Rust")}</h4><p>{t("Identity and destination handling, transport, interfaces, links, channels and resources. The reticulum-rs crates expose the RNS implementation directly to applications.", "Identità e destinazioni, trasporto, interfacce, link, canali e risorse. I crate reticulum-rs espongono l’implementazione RNS direttamente alle applicazioni.")}</p></article>
          <article><span>02 / MESSAGE</span><h4>{t("LXMF messaging and delivery", "Messaggistica e consegna LXMF")}</h4><p>{t("Wire formats, direct and propagated messaging, delivery states and opt-in durable custody. The same workspace provides the messaging layer above RNS.", "Formati dei messaggi, invio diretto e propagato, stati di consegna e custodia persistente opzionale. Lo stesso workspace fornisce la messaggistica sopra RNS.")}</p></article>
          <article><span>03 / BUILD</span><h4>{t("Libraries, SDK and daemons", "Librerie, SDK e daemon")}</h4><p>{t("22 public packages, including the new durable event broker, plus a typed SDK, reticulumd and command-line tools. Choose native libraries or a daemon API for your application.", "22 pacchetti pubblici, incluso il nuovo broker per eventi persistenti, oltre a SDK tipizzato, reticulumd e strumenti a riga di comando. Scegli librerie native o un’API daemon per la tua applicazione.")}</p></article>
        </div>
      </div>
      <div className="rust-consumers" aria-label={t("Applications using the Rust stack", "Applicazioni che usano lo stack Rust")}>
        <article><strong>REM</strong><p>{t("Embeds the Rust Reticulum/LXMF runtime in the Android field client.", "Integra il runtime Rust Reticulum/LXMF nel client Android da campo.")}</p></article>
        <article><strong>RCH 3.0 / Rust</strong><p>{t("The Rust preview connects coordination services to reticulumd through the typed SDK and ZeroMQ. Published RCH 2.9.6 uses the Python runtime by default.", "L’anteprima Rust collega i servizi a reticulumd tramite SDK tipizzato e ZeroMQ. RCH 2.9.6 pubblicato usa Python come runtime predefinito.")}</p></article>
        <article><strong>YARA</strong><p>{t("Exercises the Rust daemon through a MeshChat-compatible HTTP/WebSocket interface.", "Utilizza il daemon Rust tramite un’interfaccia HTTP/WebSocket compatibile con MeshChat.")}</p></article>
      </div>
      <div className="rust-evidence"><p>{t("Compatibility is backed by versioned tests and field evidence. The stable reference baseline is Reticulum 1.5.2 and LXMF 0.9.6; selected 1.5.5 updates do not establish full forward parity. Hardware and embedded support vary by target.", "La compatibilità è supportata da test versionati ed evidenze sul campo. La base di riferimento stabile è Reticulum 1.5.2 e LXMF 0.9.6; gli aggiornamenti 1.5.5 selezionati non dimostrano piena parità futura. Il supporto hardware ed embedded varia per target.")}</p><nav aria-label={t("Rust stack documentation", "Documentazione stack Rust")}><a href={`${RNS_REPO}/blob/main/docs/sdk/README.md`} target="_blank" rel="noreferrer">SDK ↗</a><a href={`${RNS_REPO}/blob/main/docs/README.md`} target="_blank" rel="noreferrer">{t("Documentation", "Documentazione")} ↗</a><a href={`${RNS_REPO}/blob/main/docs/status/real-world-interoperability.md`} target="_blank" rel="noreferrer">{t("Interoperability evidence", "Evidenze di interoperabilità")} ↗</a><a href={`${RNS_REPO}/blob/main/docs/status/current-roadmap.md`} target="_blank" rel="noreferrer">Roadmap ↗</a></nav></div>
    </section>
  );
}
