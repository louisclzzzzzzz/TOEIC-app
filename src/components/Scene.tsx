/**
 * « Photos » de la Part 1.
 *
 * Deux rendus possibles :
 *  - une vraie photo (`scene.image`, fichier de `public/photos/`) ;
 *  - à défaut, une illustration vectorielle dessinée ici même — aucune image à
 *    charger, fonctionne hors ligne, aucun problème de droits.
 *
 * Palette volontairement sourde et accordée au reste de l'app : ces scènes ne
 * doivent pas crier plus fort que la question qu'elles accompagnent.
 *
 * Le repli vectoriel sert aussi de filet quand un fichier photo est manquant ou
 * renommé : la session ne doit jamais s'interrompre sur une image cassée.
 */

import { useState } from 'react';
import type { ReactElement } from 'react';
import type { SceneId, ScenePicture } from '../types';

const PAPER = '#efe9dc';
const INK = '#1a2238';
const SKIN = '#e0bfa0';
const WOOD = '#b99a6b';
const CLOTH = '#4f5a7a';
const CLOTH_ALT = '#7d8aa8';
const ACCENT = '#c2740c';
const LINE = '#c8bfae';

function OfficeDesk() {
  return (
    <g>
      {/* fenêtre */}
      <rect x="20" y="20" width="74" height="56" rx="3" fill="none" stroke={LINE} strokeWidth="1.6" />
      <path d="M57 20v56M20 48h74" stroke={LINE} strokeWidth="1.6" />
      {/* bureau */}
      <rect x="38" y="132" width="244" height="7" rx="2" fill={WOOD} />
      <path d="M62 139v44M258 139v44" stroke={WOOD} strokeWidth="7" strokeLinecap="round" />
      {/* personne assise */}
      <circle cx="150" cy="78" r="17" fill={SKIN} />
      <path d="M133 75c0-11 7-19 17-19s17 8 17 19c-6-6-11-8-17-8s-11 2-17 8z" fill={INK} />
      <path d="M126 132c0-19 11-32 24-32s24 13 24 32z" fill={CLOTH} />
      {/* bras replié + combiné */}
      <path d="M168 114c8-4 12-14 8-22" stroke={CLOTH} strokeWidth="8" strokeLinecap="round" fill="none" />
      <rect x="167" y="70" width="9" height="21" rx="4.5" fill={INK} transform="rotate(18 171 80)" />
      {/* ordinateur portable */}
      <path d="M198 132l13-28h42l13 28z" fill="none" stroke={LINE} strokeWidth="1.6" />
      <rect x="211" y="104" width="42" height="27" rx="2" fill="none" stroke={LINE} strokeWidth="1.6" />
      {/* dossiers */}
      <rect x="64" y="119" width="44" height="6" rx="2" fill={ACCENT} opacity="0.75" />
      <rect x="68" y="125" width="44" height="6" rx="2" fill={CLOTH_ALT} opacity="0.7" />
      {/* tasse */}
      <rect x="122" y="123" width="13" height="9" rx="2" fill="none" stroke={LINE} strokeWidth="1.6" />
    </g>
  );
}

function Warehouse() {
  return (
    <g>
      {/* rayonnage */}
      <rect x="18" y="26" width="116" height="108" fill="none" stroke={LINE} strokeWidth="1.8" />
      <path d="M18 62h116M18 98h116" stroke={LINE} strokeWidth="1.8" />
      <rect x="26" y="34" width="30" height="24" fill={WOOD} opacity="0.55" />
      <rect x="62" y="34" width="30" height="24" fill={WOOD} opacity="0.35" />
      <rect x="26" y="70" width="30" height="24" fill={WOOD} opacity="0.4" />
      {/* palette + cartons */}
      <rect x="160" y="128" width="88" height="7" fill={WOOD} />
      <rect x="166" y="98" width="36" height="30" fill={WOOD} opacity="0.6" stroke={LINE} strokeWidth="1.4" />
      <rect x="206" y="98" width="36" height="30" fill={WOOD} opacity="0.45" stroke={LINE} strokeWidth="1.4" />
      <rect x="186" y="68" width="36" height="30" fill={WOOD} opacity="0.55" stroke={LINE} strokeWidth="1.4" />
      {/* chariot élévateur à l'arrêt */}
      <rect x="262" y="94" width="40" height="28" rx="3" fill={ACCENT} opacity="0.55" />
      <path d="M256 72v50" stroke={ACCENT} strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <circle cx="274" cy="130" r="8" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="297" cy="130" r="8" fill="none" stroke={INK} strokeWidth="1.8" />
      {/* opérateur avec tablette */}
      <circle cx="120" cy="100" r="11" fill={SKIN} />
      <path d="M109 95a11 9 0 0 1 22 0z" fill={ACCENT} opacity="0.8" />
      <path d="M105 135c0-13 7-22 15-22s15 9 15 22z" fill={CLOTH_ALT} />
      <rect x="126" y="113" width="15" height="11" rx="2" fill={INK} />
      {/* sol */}
      <path d="M10 135h300" stroke={LINE} strokeWidth="1.6" />
    </g>
  );
}

function MeetingRoom() {
  return (
    <g>
      {/* écran de projection */}
      <rect x="198" y="22" width="100" height="62" rx="2" fill="none" stroke={LINE} strokeWidth="1.8" />
      <rect x="210" y="36" width="50" height="5" rx="2.5" fill={CLOTH_ALT} />
      <path d="M210 50h72M210 60h60" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
      {/* présentateur debout */}
      <circle cx="172" cy="64" r="12" fill={SKIN} />
      <path d="M159 122c0-21 6-34 13-34s13 13 13 34z" fill={ACCENT} opacity="0.75" />
      <path d="M185 93l16-9" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" opacity="0.75" />
      {/* table */}
      <ellipse cx="140" cy="150" rx="116" ry="25" fill={WOOD} opacity="0.5" />
      <ellipse cx="140" cy="147" rx="116" ry="25" fill="none" stroke={LINE} strokeWidth="1.6" />
      {/* trois personnes assises */}
      {[
        { x: 54, c: CLOTH },
        { x: 106, c: CLOTH_ALT },
        { x: 158, c: CLOTH },
      ].map((p) => (
        <g key={p.x}>
          <circle cx={p.x} cy="94" r="11" fill={SKIN} />
          <path d={`M${p.x - 15} 141c0-17 7-28 15-28s15 11 15 28z`} fill={p.c} />
        </g>
      ))}
      {/* documents */}
      <rect x="78" y="143" width="24" height="7" rx="1.5" fill={PAPER} stroke={LINE} strokeWidth="1.2" />
      <rect x="150" y="147" width="24" height="7" rx="1.5" fill={PAPER} stroke={LINE} strokeWidth="1.2" />
    </g>
  );
}

function Generic() {
  return (
    <g>
      <rect x="32" y="32" width="256" height="136" rx="6" fill="none" stroke={LINE} strokeWidth="1.8" />
      <circle cx="110" cy="88" r="20" fill={SKIN} />
      <path d="M80 150c0-25 13-42 30-42s30 17 30 42z" fill={CLOTH} />
      <rect x="182" y="72" width="76" height="56" rx="3" fill="none" stroke={LINE} strokeWidth="1.8" />
    </g>
  );
}

const SCENES: Record<SceneId, () => ReactElement> = {
  'office-desk': OfficeDesk,
  warehouse: Warehouse,
  'meeting-room': MeetingRoom,
  'cafe-street': Generic,
  airport: Generic,
};

export function Scene({ scene }: { scene: ScenePicture }) {
  const [imageFailed, setImageFailed] = useState(false);
  const Drawing = SCENES[scene.id ?? 'office-desk'] ?? Generic;
  const showPhoto = Boolean(scene.image) && !imageFailed;

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      {showPhoto ? (
        <img
          src={scene.image}
          alt={scene.alt}
          // Ratio 16/10 recadré : cohérent d'une photo à l'autre, et l'image
          // reste au-dessus de la ligne de flottaison sur un écran de téléphone.
          className="block aspect-[16/10] w-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <svg viewBox="0 0 320 190" role="img" aria-label={scene.alt} className="block w-full">
          <rect width="320" height="190" fill={PAPER} />
          <Drawing />
        </svg>
      )}
      {showPhoto && scene.credit && (
        <figcaption className="px-3 py-2 text-[11px] text-faint">{scene.credit}</figcaption>
      )}
    </figure>
  );
}
