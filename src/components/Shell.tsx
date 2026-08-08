/**
 * Coquille de navigation.
 *
 * Deux formes pour le même contenu :
 *  - ≥ 768 px : barre haute fixe, logo à gauche, liens icône + texte à droite,
 *    sur le même crème que la page (aucun contraste de fond) ;
 *  - < 768 px : barre d'onglets en bas. L'app sert surtout sur téléphone, à une
 *    main : le haut de l'écran est hors de portée du pouce.
 */

import type { ReactNode } from 'react';
import { Chart, Home, Journal, Notebook, Sliders } from './Icons';

export type Tab = 'home' | 'dashboard' | 'journal' | 'vocab' | 'settings';

export const TABS: { id: Tab; label: string; icon: (p: { size?: number }) => ReactNode }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'dashboard', label: 'Progrès', icon: Chart },
  { id: 'journal', label: 'Journal', icon: Journal },
  { id: 'vocab', label: 'Carnet', icon: Notebook },
  { id: 'settings', label: 'Réglages', icon: Sliders },
];

export function TopNav({ active, onNavigate }: { active: Tab; onNavigate: (t: Tab) => void }) {
  return (
    <nav className="sticky top-0 z-30 hidden border-b border-line-soft bg-cream/90 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-8">
        <button onClick={() => onNavigate('home')} className="flex items-baseline gap-2">
          <span className="font-display text-[21px] tracking-tight text-navy">TOEIC Sprint</span>
          <span className="eyebrow">L&amp;R</span>
        </button>

        <div className="flex items-center gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const on = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                aria-current={on ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] transition ${
                  on ? 'bg-surface text-navy' : 'text-muted hover:text-navy'
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function BottomNav({ active, onNavigate }: { active: Tab; onNavigate: (t: Tab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line-soft bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const on = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              aria-current={on ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] transition ${
                on ? 'text-navy' : 'text-faint'
              }`}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Conteneur commun : marge confortable, largeur de lecture contenue. */
export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div
      className={`mx-auto w-full px-5 pb-28 pt-8 md:pb-16 md:pt-12 ${wide ? 'max-w-5xl md:px-8' : 'max-w-3xl md:px-8'}`}
    >
      {children}
    </div>
  );
}
