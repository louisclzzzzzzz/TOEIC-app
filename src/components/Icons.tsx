/**
 * Jeu d'icônes en trait fin, dessinées ici.
 *
 * Aucune librairie : une vingtaine de tracés suffit, et cela garantit une
 * épaisseur de trait et une grille identiques partout — ce qu'un mélange de
 * paquets d'icônes ne donne jamais.
 *
 * Convention : viewBox 24, trait 1.5, pas de remplissage, `currentColor`.
 */

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

/** Streak — flamme. */
export const Flame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3c.6 2.4 2 3.5 3.2 4.9A6.6 6.6 0 0 1 17 12.3a5 5 0 0 1-10 0c0-1.6.7-2.8 1.6-3.8.3 1 .9 1.6 1.6 1.9-.3-2.5.3-4.6 1.8-7.4Z" />
    <path d="M12 20.5a3 3 0 0 1-3-3c0-1.3.9-2.2 1.6-3 .5.8 1 1.1 1.6 1.3-.1-1.3.3-2.2 1-3.1.6 1.1 1.8 2.2 1.8 4a3 3 0 0 1-3 3.8Z" />
  </Svg>
);

/** Précision — cible. */
export const Target = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
);

/** Maîtrisé — coche dans un cercle. */
export const CheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.4 4.6-4.9" />
  </Svg>
);

/** En révision — flèches circulaires. */
export const Recycle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3L20 9" />
    <path d="M20 4.5V9h-4.5" />
    <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3L4 15" />
    <path d="M4 19.5V15h4.5" />
  </Svg>
);

export const Headphones = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <path d="M4 13.5A1.5 1.5 0 0 1 5.5 12h1A1.5 1.5 0 0 1 8 13.5v3A1.5 1.5 0 0 1 6.5 18h-1A1.5 1.5 0 0 1 4 16.5Z" />
    <path d="M16 13.5a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 20 13.5v3a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5Z" />
  </Svg>
);

export const Document = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5Z" />
    <path d="M14 3v4.5h4.5" />
    <path d="M9 12.5h6M9 16h4" />
  </Svg>
);

export const Notebook = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 3.5h11A1.5 1.5 0 0 1 19 5v14a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z" />
    <path d="M9 3.5v17" />
    <path d="M12 8.5h4M12 12h4" />
  </Svg>
);

export const Home = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.8V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.8" />
    <path d="M10 20v-5.5h4V20" />
  </Svg>
);

export const Chart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h16" />
    <path d="M7 20v-6M12 20V6M17 20v-9" />
  </Svg>
);

export const Journal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 5.5A2 2 0 0 1 7 3.5h10.5a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2Z" />
    <path d="M5 17.5h13.5" />
    <path d="M8.5 8h6" />
  </Svg>
);

export const Sliders = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="10" cy="16" r="2" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
);

export const Layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="m12 3.5 8 4-8 4-8-4Z" />
    <path d="m4 12 8 4 8-4" />
    <path d="m4 16.5 8 4 8-4" />
  </Svg>
);

export const Play = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.5 5.8v12.4a.6.6 0 0 0 .92.5l9.4-6.2a.6.6 0 0 0 0-1l-9.4-6.2a.6.6 0 0 0-.92.5Z" />
  </Svg>
);

export const Pause = (p: IconProps) => (
  <Svg {...p} strokeWidth={2}>
    <path d="M9.5 5.5v13M14.5 5.5v13" />
  </Svg>
);

export const Stop = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6.5" y="6.5" width="11" height="11" rx="2" />
  </Svg>
);

/** Reprendre le passage en cours — flèche circulaire antihoraire. */
export const Rewind = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
    <path d="M4.2 4.8v3.9h3.9" />
  </Svg>
);

export const Sound = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 5.5 6.8 9H4a.5.5 0 0 0-.5.5v5A.5.5 0 0 0 4 15h2.8l4.2 3.5a.5.5 0 0 0 .8-.4V5.9a.5.5 0 0 0-.8-.4Z" />
    <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
    <path d="M18 7a7 7 0 0 1 0 10" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5.5v13M5.5 12h13" />
  </Svg>
);

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </Svg>
);

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </Svg>
);

export const Spark = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v5M12 15v5M4 12h5M15 12h5" />
    <path d="m6.8 6.8 3 3M14.2 14.2l3 3M17.2 6.8l-3 3M9.8 14.2l-3 3" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v10.5" />
    <path d="m8 11 4 4 4-4" />
    <path d="M4.5 19.5h15" />
  </Svg>
);

export const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 6.5h15" />
    <path d="M9.5 6.5V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5" />
    <path d="M6.5 6.5 7.3 19a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9l.8-12.5" />
  </Svg>
);
