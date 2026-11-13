"use client";

import { useState } from "react";
import dataset from "./benchmark-data.json";
import type { Language } from "./features";
import { lxmfStable } from "./releases";

const BASE_PATH = import.meta.env.BASE_URL;
const methodology = `${lxmfStable.repository}/blob/v0.16.1/docs/performance.md`;
const metrics = ["p50", "p95", "p99", "throughput"] as const;
type Metric = (typeof metrics)[number];
const scale = [1, 2, 5, 10, 20, 50, 100, 200];
const logLimit = Math.log2(scale[scale.length - 1]);

function formatValue(value: number, metric: Metric, language: Language) {
  const format = (n: number) => n.toLocaleString(language, { maximumFractionDigits: 2 });
  if (metric === "throughput") return `${format(value)} ops/s`;
  const [number, unit] = value < 1000 ? [value, "ns"] : value < 1e6 ? [value / 1000, "µs"] : value < 1e9 ? [value / 1e6, "ms"] : [value / 1e9, "s"];
  return `${format(number)} ${unit}`;
}

export default function Performance({ language }: { language: Language }) {
  const t = (en: string, it: string) => language === "en" ? en : it;
  const [metric, setMetric] = useState<Metric>("p50");
  const throughput = metric === "throughput";
  const metricName = throughput ? t("Throughput", "Throughput") : metric.toUpperCase();
  const factor = (row: (typeof dataset.rows)[number]) => throughput
    ? row.rust[metric] / row.python[metric]
    : row.python[metric] / row.rust[metric];
  const formatFactor = (n: number) => `${n.toLocaleString(language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×`;
  const medianLabel = t("P50 median latency · P95 / P99 tail latency", "P50 latenza mediana · P95 / P99 latenza di coda");

  return (
    <section className="performance section-shell" id="performance">
      <div className="section-heading">
        <div><p className="section-kicker">MEASURED / NOV 2026</p><h2>{t("Put the stack", "Metti lo stack")}<br /><span>{t("to the test.", "alla prova.")}</span></h2></div>
        <p>{t("Compare LXMF-rs and the Python reference across 18 matched workloads. Switch metrics to see how the results change.", "Confronta LXMF-rs e l’implementazione Python di riferimento su 18 carichi equivalenti. Cambia metrica per vedere come variano i risultati.")}</p>
      </div>
      <div className="benchmark-stage" aria-labelledby="benchmark-results">
        <div className="benchmark-overview">
          <div>
            <p className="benchmark-tag">{t("RUST / PYTHON COMPARISON", "CONFRONTO RUST / PYTHON")}</p>
            <h3 id="benchmark-results">{t("Performance by workload", "Prestazioni per carico")}</h3>
          </div>
          <div className="metric-controls" role="group" aria-label={t("Benchmark metric", "Metrica benchmark")}>
            {metrics.map(item => <button type="button" aria-pressed={metric === item} onClick={() => setMetric(item)} key={item}>{item === "throughput" ? "Throughput" : item.toUpperCase()}</button>)}
          </div>
        </div>
        <div className="benchmark-key">
          <span>{medianLabel}</span>
          <span aria-live="polite">{metricName} · {throughput ? t("Higher is better", "Più alto è meglio") : t("Lower is better", "Più basso è meglio")}</span>
        </div>
        <div className="benchmark-axis" aria-hidden="true">
          <span>{t("Workload", "Carico")}</span>
          <span className="benchmark-axis-labels">{scale.map(n => <span key={n} style={{ left: `${Math.log2(n) / logLimit * 100}%` }}>{n}×</span>)}</span>
          <span>{t("Measured values", "Valori misurati")}</span>
        </div>
        <ol className="benchmark-workloads">
          {dataset.rows.map(row => {
            const ratio = factor(row);
            const speedup = ratio >= 1 ? ratio : 1 / ratio;
            const width = `${Math.log2(speedup) / logLimit * 100}%`;
            const faster = ratio > 1 ? "Rust" : ratio < 1 ? "Python" : t("Tie", "Pari");
            return (
              <li className="benchmark-row" key={row.label}>
                <span className="benchmark-workload-name">{row.label}</span>
                <div className="benchmark-relative">
                  <div className="benchmark-track" aria-hidden="true">
                    {scale.map(n => <i key={n} className="benchmark-tick" style={{ left: `${Math.log2(n) / logLimit * 100}%` }} />)}
                    <i className={`benchmark-fill ${ratio < 1 ? "python-fill" : ""}`} style={{ width }} />
                  </div>
                  <strong>{faster} {formatFactor(speedup)}</strong>
                </div>
                <div className="benchmark-values">
                  <span><b>Rust</b> {formatValue(row.rust[metric], metric, language)}</span>
                  <span><b>Python</b> {formatValue(row.python[metric], metric, language)}</span>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="benchmark-reading">{t("Bar length shows the speed ratio on a logarithmic scale: 1× means equal performance. The measured values are shown alongside each bar.", "La lunghezza delle barre mostra il rapporto di velocità su scala logaritmica: 1× indica prestazioni uguali. Accanto a ogni barra trovi i valori misurati.")}</p>
      </div>
      <div className="benchmark-method"><span>Intel Core Ultra 7 165H · Linux x86_64 · Rust 1.99.1 · Python 3.14.4</span><p>{t("Five interleaved runs with equivalent signing, verification and cache behavior. Python uses the PyCA cryptography backend. These local tests measure specific operations; radio range and whole-system performance require separate tests.", "Cinque esecuzioni alternate con firma, verifica e cache equivalenti. Python usa il backend crittografico PyCA. Questi test locali misurano operazioni specifiche; portata radio e prestazioni dell’intero sistema richiedono prove separate.")}</p></div>
      <div className="benchmark-sources">
        <a href={`${BASE_PATH}benchmarks/lxmf-fair-2026-11-01.json`} download>{t("Download benchmark data", "Scarica i dati del benchmark")} ↓</a>
        <a href={methodology} target="_blank" rel="noreferrer">{t("Full results & methodology", "Risultati completi e metodologia")} ↗</a>
      </div>
    </section>
  );
}
