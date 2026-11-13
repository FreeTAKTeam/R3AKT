"use client";

import { useEffect, useState } from "react";
import type { Language } from "./features";

export default function MotionEffects({ language }: { language: Language }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      root.dataset.motion = paused || reduced.matches ? "paused" : "active";
      if (root.dataset.motion === "paused") document.getAnimations().forEach(animation => {
        if (animation.effect && Number(animation.effect.getComputedTiming().endTime) < Infinity) animation.finish();
      });
    };
    updateMotion();
    reduced.addEventListener("change", updateMotion);
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = root.scrollHeight - innerHeight;
        root.style.setProperty("--reading-progress", String(distance > 0 ? scrollY / distance : 0));
      });
    };
    updateProgress();
    addEventListener("scroll", updateProgress, { passive: true });
    const revealed = new WeakSet<Element>();
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (root.dataset.motion === "active") entry.target.animate([{ opacity: .15, transform: "translateY(35px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 750, delay: Number.parseInt((entry.target as HTMLElement).style.getPropertyValue("--reveal-delay")) || 0, easing: "cubic-bezier(.16,1,.3,1)" });
      reveal.unobserve(entry.target);
    }), { threshold: .08 });
    const observe = () => document.querySelectorAll(".section-heading,.rust-foundation,.rust-consumers article,.benchmark-stage,.product-card,.feature-card,.capability-card,.use-card,.resource-card,.video-card,.scenario-panel,.architecture-panel").forEach((element, index) => {
      if (revealed.has(element)) return;
      revealed.add(element);
      (element as HTMLElement).style.setProperty("--reveal-delay", `${index % 3 * 90}ms`);
      if (element.getBoundingClientRect().top > innerHeight * .85) reveal.observe(element);
    });
    observe();
    const changes = new MutationObserver(observe);
    const featureGrid = document.querySelector(".feature-grid");
    if (featureGrid) changes.observe(featureGrid, { childList: true });
    const stage = document.querySelector(".network-stage");
    const visible = new IntersectionObserver(entries => entries.forEach(entry => stage?.classList.toggle("motion-visible", entry.isIntersecting)));
    if (stage) visible.observe(stage);
    return () => { reduced.removeEventListener("change", updateMotion); removeEventListener("scroll", updateProgress); cancelAnimationFrame(frame); reveal.disconnect(); changes.disconnect(); visible.disconnect(); };
  }, [paused]);
  return <><div className="reading-progress" aria-hidden="true" /><button className="motion-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{language === "en" ? paused ? "Resume motion" : "Pause motion" : paused ? "Riprendi animazioni" : "Pausa animazioni"}</button></>;
}
