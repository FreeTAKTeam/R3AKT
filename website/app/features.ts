import { lxmfCandidate, lxmfStable, rchPython, rchRust, remAsset, remPluginVersions, remRelease, yaraRelease } from "./releases";

export type Language = "en" | "it";
type Copy = Record<Language, string>;
export type Status = "published" | "preview" | "development" | "soon" | "planned";
const rem = remRelease.repository;

export const statusLabels: Record<Status, Copy> = {
  published: { en: "Published", it: "Pubblicato" },
  preview: { en: "Preview", it: "Anteprima" },
  development: { en: "In development", it: "In sviluppo" },
  soon: { en: "Soon", it: "A breve" },
  planned: { en: "Planned", it: "Pianificato" },
};

export const features: { id: string; name: string; type: string; status: Status; version?: string; summary: Copy; detail: Copy; url?: string; link?: Copy }[] = [
  {
    id: "rns", name: "LXMF-rs / Rust RNS", type: "FOUNDATION / NETWORK STACK", status: "published", version: lxmfStable.tag,
    summary: { en: "Our Reticulum and LXMF implementation in Rust.", it: "La nostra implementazione Reticulum e LXMF in Rust." },
    detail: { en: "FreeTAKTeam’s independent Rust implementation of RNS and LXMF powers REM, RCH Rust and YARA. The stable release aligns 22 public packages and adds a reusable durable event broker, more efficient propagation storage, and readiness notifications for reticulumd under systemd. Packages are available for Linux, macOS and Windows.", it: "L’implementazione indipendente in Rust di RNS e LXMF di FreeTAKTeam è alla base di REM, RCH Rust e YARA. La release stabile allinea 22 pacchetti pubblici e introduce un broker riutilizzabile per eventi persistenti, uno storage di propagazione più efficiente e notifiche di avvio di reticulumd con systemd. Pacchetti per Linux, macOS e Windows." },
    url: lxmfStable.notes, link: { en: "Rust stack release & downloads", it: "Release e download dello stack Rust" },
  },
  {
    id: "rns-rc", name: "LXMF-rs release candidate", type: "FOUNDATION / NETWORK STACK", status: "preview", version: lxmfCandidate.tag,
    summary: { en: "Test the next maintenance update.", it: "Prova il prossimo aggiornamento di manutenzione." },
    detail: { en: "The candidate reclaims idle SDK sessions while preserving durable identities and accepted work. It also updates SQLite and rustix and fixes interface and shutdown behavior. Use the stable release for the standard distribution.", it: "La candidata libera le sessioni SDK inattive preservando identità persistenti e operazioni già accettate. Aggiorna anche SQLite e rustix e corregge il comportamento delle interfacce e dell’arresto. Per la distribuzione ordinaria usa la release stabile." },
    url: lxmfCandidate.notes, link: { en: "Candidate packages & notes", it: "Pacchetti e note della candidata" },
  },
  {
    id: "rem", name: "REM", type: "ANDROID / FIELD COORDINATION", status: "published", version: remRelease.tag,
    summary: { en: "A shared picture, from your phone.", it: "Un quadro condiviso, dal telefono." },
    detail: { en: "Create and share persistent map objects with your active team. REM 1.6.2 also displays provisional R3S/1 sensor geometry and origin positions from authorized plugins. It runs on LXMF-rs 0.16.1; the Complete APK includes four optional plugin installers, while Light omits them.", it: "Crea e condividi oggetti persistenti sulla mappa con il team attivo. REM 1.6.2 mostra anche la geometria dei sensori R3S/1, ancora provvisoria, e le posizioni di origine fornite dai plugin autorizzati. Usa LXMF-rs 0.16.1; l’APK Complete include quattro installer opzionali, mentre Light li omette." },
    url: remRelease.notes, link: { en: "Release & Android downloads", it: "Release e download Android" },
  },
  {
    id: "rch-python", name: "RCH — Python edition", type: "PYTHON / COMMUNITY HUB", status: "published", version: rchPython.tag,
    summary: { en: "The released Python-based community hub.", it: "L’hub di comunità Python già rilasciato." },
    detail: { en: "Published Python-based RCH package with group and topic communications, mission data, telemetry, files, chat, maps and TAK integration. Release 2.9.6 keeps the Python runtime as the default; its optional Rust mission-sync bridge is disabled by default. Desktop packages are available for Windows, macOS and Linux.", it: "Pacchetto RCH basato su Python già pubblicato, con comunicazioni per gruppi e topic, dati di missione, telemetria, file, chat, mappe e integrazione TAK. La release 2.9.6 mantiene Python come runtime predefinito; il bridge Rust opzionale per la sincronizzazione missioni è disabilitato inizialmente. Sono disponibili pacchetti desktop per Windows, macOS e Linux." },
    url: rchPython.notes, link: { en: "Python release & downloads", it: "Release Python e download" },
  },
  {
    id: "rch-rust", name: "RCH 3.0 — Rust edition", type: "RUST / COMMUNITY HUB", status: "preview", version: rchRust.tag.slice(1),
    summary: { en: "Your community's coordination node.", it: "Il nodo di coordinamento della comunità." },
    detail: { en: "Preview.38 ships Linux AMD64 packages with the UI, RCH server, TAK service and matching LXMF-rs 0.16.2-rc.1 daemon. It adds SDK session recovery that preserves durable custody and team-scoped mission commands. Debian upgrade and restart checks passed; physical radio and sustained production operation still need qualification.", it: "L’anteprima .38 offre pacchetti Linux AMD64 con interfaccia, server RCH, servizio TAK e daemon abbinato LXMF-rs 0.16.2-rc.1. Aggiunge il recupero delle sessioni SDK preservando la custodia persistente e comandi di missione limitati al team. Aggiornamento Debian e riavvii verificati; restano da qualificare radio fisiche e funzionamento prolungato in produzione." },
    url: rchRust.notes, link: { en: "Linux AMD64 packages & notes", it: "Pacchetti Linux AMD64 e note" },
  },
  {
    id: "yara", name: "YARA", type: "DESKTOP / RETICULUM MESSAGING", status: "preview", version: yaraRelease.tag,
    summary: { en: "A practical window into the Rust mesh.", it: "Una finestra pratica sulla mesh Rust." },
    detail: { en: "Yet Another Reticulum Application is a MeshChat-compatible desktop messenger with a bundled Rust daemon. Beta.3 adds separate identity profiles and a Backbone Client interface. New profiles connect to the R3AKT backbone by default; existing interfaces stay as saved. Unsigned beta builds are available for Windows, macOS and Linux, including Raspberry Pi OS 64-bit.", it: "Yet Another Reticulum Application è un’app desktop di messaggistica compatibile con MeshChat, con daemon Rust incluso. La beta.3 aggiunge profili di identità separati e l’interfaccia Backbone Client. I nuovi profili si collegano alla dorsale R3AKT per impostazione predefinita; le interfacce esistenti restano invariate. Build beta non firmate per Windows, macOS e Linux, incluso Raspberry Pi OS a 64 bit." },
    url: yaraRelease.notes, link: { en: "Download the desktop beta", it: "Scarica la beta desktop" },
  },
  {
    id: "trex", name: "Amazfit T-Rex 2", type: "WEARABLE / REM TACTICAL", status: "preview",
    summary: { en: "Keep essential status on your wrist.", it: "Lo stato essenziale, al polso." },
    detail: { en: "REM Tactical 1.3.29 and REM Sync 0.1.32 have documented Zepp build and setup steps. Tap REM on the watch to opt into live status through the companion and Android plugin. Compass, altitude, pressure, heart rate and battery work locally where supported. The source build is available; Zepp Store availability is unconfirmed.", it: "REM Tactical 1.3.29 e REM Sync 0.1.32 hanno istruzioni di compilazione e configurazione per Zepp. Tocca REM sul quadrante per attivare lo stato live tramite companion e plugin Android. Bussola, altitudine, pressione, frequenza cardiaca e batteria funzionano in locale dove supportati. Il sorgente è disponibile; la disponibilità nello Zepp Store non è confermata." },
    url: "https://github.com/FreeTAKTeam/rem-tactical-trex2", link: { en: "Watch face & companion source", it: "Sorgente quadrante e companion" },
  },
  {
    id: "watch-plugin", name: "REM Watch Status plugin", type: "ANDROID / WEARABLE BRIDGE", status: "published", version: remPluginVersions.watch,
    summary: { en: "Bring REM status to the watch face.", it: "Porta lo stato REM sul quadrante." },
    detail: { en: "The signed Android plugin ships with REM Complete and as a separate APK. It exposes connection, operator, team and event status locally to REM Sync, which relays it to the T-Rex 2 watch face. The Zepp companion and watch face are installed separately.", it: "Il plugin Android firmato è incluso in REM Complete e disponibile come APK separato. Espone in locale lo stato di connessione, operatore, team ed eventi a REM Sync, che lo inoltra al quadrante T-Rex 2. Companion e quadrante Zepp si installano a parte." },
    url: remAsset("watch-status.apk"), link: { en: "Download Watch Status APK", it: "Scarica l’APK Watch Status" },
  },
  {
    id: "gotenna", name: "goTenna Mesh beta", type: "RADIO / REM PLUGIN", status: "preview", version: remPluginVersions.gotenna,
    summary: { en: "Another connection for the field.", it: "Un altro collegamento per il campo." },
    detail: { en: "The optional Android beta pairs with goTenna Mesh over Bluetooth LE to exchange addressed chat, MECP event codes and positions. Forwarding to public Mesh is off by default. Radio headers are plaintext, sender claims are unverified, and physical range and delivery still need qualification.", it: "La beta Android opzionale si collega a goTenna Mesh via Bluetooth LE per scambiare chat indirizzate, codici evento MECP e posizioni. L’inoltro alla mesh pubblica è disattivato per impostazione predefinita. Le intestazioni radio sono in chiaro, il mittente dichiarato non è verificato e portata e consegna richiedono ancora prove sul campo." },
    url: remAsset("gotenna-mesh-beta.apk"), link: { en: "Download the beta APK", it: "Scarica l’APK beta" },
  },
  {
    id: "atn", name: "ATN BinoX & rangefinders", type: "OBSERVATION / REM PLUGIN", status: "published", version: remPluginVersions.atn,
    summary: { en: "From an observation to a shared point.", it: "Dall’osservazione a un punto condiviso." },
    detail: { en: "Connect ATN BinoX 4K over Bluetooth to turn measurements into REM markers and show permitted points on the BinoX display. Version 0.4.5 updates the native build for 16 KiB alignment and ships with REM 1.6.2. Other models and firmware need separate validation.", it: "Collega ATN BinoX 4K via Bluetooth per trasformare misurazioni in marker REM e mostrare sul display BinoX i punti autorizzati. La versione 0.4.5 aggiorna la build nativa con allineamento a 16 KiB ed è distribuita con REM 1.6.2. Altri modelli e firmware richiedono verifiche separate." },
    url: remAsset("atn-rangefinder.apk"), link: { en: "Download ATN Rangefinder APK", it: "Scarica l’APK ATN Rangefinder" },
  },
  {
    id: "drones", name: "Drone control over Reticulum", type: "DRONES / RETICULUM CONTROL", status: "development",
    summary: { en: "Extend the mesh to drone operations.", it: "Estendi la mesh alle operazioni con droni." },
    detail: { en: "Drone command and status exchange over Reticulum is under development for the R³AKT ecosystem. Supported vehicles, available controls, link requirements and field-validation results will be documented as the integration progresses.", it: "Lo scambio di comandi e stato dei droni su Reticulum è in sviluppo per l’ecosistema R³AKT. Veicoli supportati, controlli disponibili, requisiti di collegamento e risultati delle prove sul campo saranno documentati con l’avanzare dell’integrazione." },
  },
  {
    id: "plugins", name: "REM plugin system", type: "ANDROID / EXTENSIONS", status: "published",
    summary: { en: "Add a capability with explicit trust.", it: "Aggiungi capacità con fiducia esplicita." },
    detail: { en: "REM Complete includes optional BLE Heart Rate, Watch Status, ATN Rangefinder and goTenna Mesh beta installers. Each plugin is also available as a separate APK. Approve the publisher and grant only the capabilities you want to enable.", it: "REM Complete include gli installer opzionali BLE Heart Rate, Watch Status, ATN Rangefinder e goTenna Mesh beta. Ogni plugin è disponibile anche come APK separato. Approva l’editore e concedi solo i permessi per le funzioni che vuoi attivare." },
    url: `${rem}/blob/${remRelease.tag}/docs/plugins/android-plugin-system.md`, link: { en: "Plugin system & SDK", it: "Sistema plugin e SDK" },
  },
  {
    id: "heart-rate", name: "BLE Heart Rate plugin", type: "ANDROID / SENSOR", status: "published", version: remPluginVersions.heartRate,
    summary: { en: "Read heart rate from a Bluetooth sensor.", it: "Leggi la frequenza cardiaca da un sensore Bluetooth." },
    detail: { en: "The optional REM plugin connects to a BLE heart-rate sensor. Version 1.0.1 improves recovery when Bluetooth connection setup fails and releases monitoring resources when the Android service stops.", it: "Il plugin opzionale per REM si collega a un sensore di frequenza cardiaca BLE. La versione 1.0.1 migliora il recupero quando la connessione Bluetooth non riesce e libera le risorse di monitoraggio all’arresto del servizio Android." },
    url: remAsset("ble-heart-rate.apk"), link: { en: "Download BLE Heart Rate APK", it: "Scarica l’APK BLE Heart Rate" },
  },
];
