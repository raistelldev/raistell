"use client";

import { useEffect, useRef } from "react";
import { mountProjectFilm } from "./project-film";
import "./ProjectFilm.css";

export function ProjectFilm() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    return mountProjectFilm(rootRef.current);
  }, []);

  return (
<div ref={rootRef} className="projectFilm">
  <section className="rm-film" role="region" aria-label="Raistell – Energie, die bewegt">
    <header className="rm-header"><span className="rm-logo">RAISTELL<span className="rm-logo-dot"></span></span><span className="rm-edition">IHR PROJEKT IM BILD</span></header>
    <div className="rm-stage">
      <canvas width="1440" height="1080" role="img" aria-label="Animierte Energiestudie: Vom Solardach zum Haus und seinem warmen Wohnraum. Daraus entstehen vier Videos, die auf Website und Smartphone erscheinen. Der Film kehrt über das ganze Haus und sein Dach zum Anfang zurück."></canvas>
      <div className="rm-overline"><span>ENERGIE, DIE BEWEGT.</span><span>24 SEK. / OHNE TON</span></div>
      <div className="rm-copy" aria-hidden="true"><div className="rm-kicker">01 / DIE ENTDECKUNG</div><div className="rm-headline">Hier steckt<br /><em>mehr drin.</em></div></div>
      <div className="rm-output" aria-hidden="true"><span>1 Hauptvideo</span><span>3 Kurzformate</span></div>
      <div className="rm-channels" aria-hidden="true"><span>Website &amp; Vertrieb</span><span>Social Media</span></div>
      <div className="rm-frame-label" aria-hidden="true">SOLAR · WÄRME · ZUHAUSE</div>
      <div className="rm-caption" aria-live="polite">Aus einem Detail wird eine Geschichte.</div>
    </div>
    <div className="rm-bottom">
      <div className="rm-transport">
        <button disabled type="button" className="rm-play film-interaction">Film starten <span aria-hidden="true">↗</span></button>
        <button disabled type="button" className="rm-reset film-interaction" aria-label="Film von vorn starten">Von vorn</button>
        <label className="rm-loop film-interaction"><input type="checkbox" defaultChecked disabled aria-label="Film wiederholen" /><span>Loop</span></label>
        <span className="rm-timer" aria-hidden="true">00:00 / 00:24</span>
      </div>
      <div className="rm-chapters" role="group" aria-label="Szenen auswählen">
        <button disabled type="button" data-scene="0" className="film-interaction" aria-pressed="true"><span>01</span> Entdecken<i></i></button>
        <button disabled type="button" data-scene="1" className="film-interaction" aria-pressed="false"><span>02</span> Spüren<i></i></button>
        <button disabled type="button" data-scene="2" className="film-interaction" aria-pressed="false"><span>03</span> Verwandeln<i></i></button>
        <button disabled type="button" data-scene="3" className="film-interaction" aria-pressed="false"><span>04</span> Wirken<i></i></button>
      </div>
      <div className="rm-footnote"><span>Beispielkonzept · keine Kundenreferenz</span><span className="rm-status">BEREIT</span></div>
    </div>
  </section>
</div>
  );
}
