"use client";

import { useState } from "react";

const playlistId = "PLait08aJQUoA";

// Keep the order of the Resta Connesso playlist; summaries follow the episode descriptions.
const tutorials = [
  {
    id: "UhuV2SC_E-w",
    title: "Checklist: organizzare le attività operative",
    description: "Come creare una checklist, aggiornare le singole attività e seguire l’avanzamento del team dalla Dashboard. Il video mostra anche come preparare e importare un modello CSV da riutilizzare nelle esercitazioni o durante un intervento.",
  },
  {
    id: "a1ZbKLjyKDU",
    title: "Action Messages: comunicare lo stato operativo",
    description: "Come segnalare al team le proprie condizioni con un Action Message. Le prove nell’app chiariscono come scegliere il livello di gravità, come leggere il Team Status e quando usare un Action Message invece di un evento.",
  },
  {
    id: "tb48bkp0rIw",
    title: "Eventi: condividere aggiornamenti operativi",
    description: "Come creare e inviare un evento, poi consultare e filtrare quelli ricevuti. Il tutorial spiega come il protocollo MECP aiuta a condividere segnalazioni standard, per esempio una strada bloccata o una richiesta di aiuto.",
  },
  {
    id: "3907_GPutUc",
    title: "Contatti: trovare e collegare i peer",
    description: "Che cos’è un peer, come i dispositivi si riconoscono tramite le loro identità digitali e come orientarsi tra Discovered, Peers e Hub. Il video mostra come aggiungere un contatto e verificare la connessione con un messaggio in chat.",
  },
  {
    id: "8bEqQxlhDto",
    title: "REM per il coordinamento dei piccoli gruppi",
    description: "Una panoramica di come famiglie, vicini e gruppi fidati possono coordinarsi quando le comunicazioni abituali sono inaffidabili. Il video presenta la configurazione di base, le funzioni principali e alcuni scenari da provare in esercitazione.",
  },
  {
    id: "_wyjREfD38M",
    title: "Installare REM su Android, passo dopo passo",
    description: "Da dove scaricare REM, come installarlo su Android e come affrontare la configurazione iniziale. Il tour finale passa in rassegna le schermate principali per aiutare chi apre l’app per la prima volta.",
  },
];

export default function RemTutorials() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="rem-tutorials" id="tutorial-rem" aria-labelledby="rem-tutorials-title">
      <div className="section-heading light">
        <div>
          <p className="section-kicker">VIDEOGUIDE / RESTA CONNESSO</p>
          <h2 id="rem-tutorials-title">REM, passo dopo passo.</h2>
        </div>
        <p>Sei tutorial in italiano, dall’installazione alla gestione delle attività del team. <a className="tutorial-playlist" href={`https://www.youtube.com/playlist?list=${playlistId}`} target="_blank" rel="noreferrer">Apri la playlist su YouTube ↗</a></p>
      </div>
      <div className="rem-tutorial-grid">
        {tutorials.map(({ id, title, description }, index) => (
          <article className="rem-tutorial" key={id}>
            <div className="tutorial-frame">
              {activeId === id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
                  title={title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  ref={player => { player?.focus(); }}
                />
              ) : (
                <button type="button" onClick={() => setActiveId(id)} aria-label={`Riproduci: ${title}`}>
                  <img src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" width={320} height={180} loading="lazy" />
                  <span className="play-icon" aria-hidden="true">▶</span>
                </button>
              )}
            </div>
            <div className="tutorial-copy">
              <p className="section-kicker">VIDEO {String(index + 1).padStart(2, "0")}</p>
              <h3>{title}</h3>
              <p>{description}</p>
              <a className="watch-link" href={`https://www.youtube.com/watch?v=${id}&list=${playlistId}`} target="_blank" rel="noreferrer" aria-label={`Guarda su YouTube: ${title}`}>GUARDA SU YOUTUBE <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
