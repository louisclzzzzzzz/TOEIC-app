/**
 * Racine de l'app : navigation (sans routeur, l'app tient en huit écrans) et
 * construction des sessions à partir des modes proposés sur l'accueil.
 */

import { useState } from 'react';
import type { PartId, Section, SessionMode } from './types';
import { useApp } from './store';
import type { SessionBlock } from './lib/selection';
import {
  buildMixedSession,
  buildPracticeSession,
  buildReviewSession,
  sectionDurationSec,
} from './lib/selection';
import type { Tab } from './components/Shell';
import { BottomNav, TABS, TopNav } from './components/Shell';
import { Home } from './screens/Home';
import { PracticeSetup } from './screens/PracticeSetup';
import { Session } from './screens/Session';
import type { SessionResult } from './screens/Session';
import { Results } from './screens/Results';
import { Dashboard } from './screens/Dashboard';
import { Journal } from './screens/Journal';
import { Settings } from './screens/Settings';
import { ExamIntro } from './screens/ExamIntro';
import { Vocab } from './screens/Vocab';
import { VocabReview } from './screens/VocabReview';
import { VocabBank } from './screens/VocabBank';

type View =
  | { t: Tab }
  | { t: 'practice' }
  | { t: 'exam-intro' }
  | { t: 'vocab-review' }
  | { t: 'vocab-bank' }
  | {
      t: 'session';
      blocks: SessionBlock[];
      mode: SessionMode;
      title: string;
      sectionLimits?: Record<Section, number>;
    }
  | { t: 'results'; results: SessionResult[]; planned: number; mode: SessionMode };

export function App() {
  const { state } = useApp();
  const [view, setView] = useState<View>({ t: 'home' });

  const countItems = (blocks: SessionBlock[]) => blocks.reduce((n, b) => n + b.items.length, 0);

  const startSession = (
    blocks: SessionBlock[],
    mode: SessionMode,
    title: string,
    sectionLimits?: Record<Section, number>,
  ) => {
    if (!countItems(blocks)) return;
    setView({ t: 'session', blocks, mode, title, sectionLimits });
  };

  const startMixed = () =>
    startSession(buildMixedSession(state, state.settings.sessionLength), 'mixed', 'Session mixte');

  const startPractice = (parts: PartId[], length: number) =>
    startSession(
      buildPracticeSession(state, parts, length),
      'practice',
      parts.length === 1 ? `Part ${parts[0]}` : 'Practice ciblé',
    );

  const startReview = () => {
    const blocks = buildReviewSession(state);
    if (!countItems(blocks)) return setView({ t: 'journal' });
    startSession(blocks, 'review', 'Révision');
  };

  const startExam = (blocks: SessionBlock[]) =>
    startSession(blocks, 'exam', 'Examen blanc', {
      listening: sectionDurationSec(blocks, 'listening'),
      reading: sectionDurationSec(blocks, 'reading'),
    });

  // Les écrans de flux (session, examen, flashcards) masquent la navigation :
  // on ne veut pas d'échappatoire à un clic pendant un examen chronométré.
  const tab = TABS.find((t) => t.id === view.t)?.id;
  const inFlow = !tab;

  return (
    <div className="min-h-dvh">
      {!inFlow && <TopNav active={tab!} onNavigate={(t) => setView({ t })} />}

      {view.t === 'home' && (
        <Home
          onMixed={startMixed}
          onPractice={() => setView({ t: 'practice' })}
          onReview={startReview}
          onExam={() => setView({ t: 'exam-intro' })}
          onVocab={() => setView({ t: 'vocab' })}
        />
      )}

      {view.t === 'practice' && (
        <PracticeSetup onStart={startPractice} onBack={() => setView({ t: 'home' })} />
      )}

      {view.t === 'exam-intro' && (
        <ExamIntro onStart={startExam} onBack={() => setView({ t: 'home' })} />
      )}

      {view.t === 'session' && (
        <Session
          blocks={view.blocks}
          mode={view.mode}
          title={view.title}
          sectionLimits={view.sectionLimits}
          onExit={() => setView({ t: 'home' })}
          onFinish={(results) =>
            setView({ t: 'results', results, planned: countItems(view.blocks), mode: view.mode })
          }
        />
      )}

      {view.t === 'results' && (
        <Results
          results={view.results}
          planned={view.planned}
          mode={view.mode}
          onHome={() => setView({ t: 'home' })}
          onReviewErrors={() => setView({ t: 'journal' })}
        />
      )}

      {view.t === 'dashboard' && <Dashboard />}
      {view.t === 'journal' && <Journal onReview={startReview} />}
      {view.t === 'vocab' && (
        <Vocab
          onReview={() => setView({ t: 'vocab-review' })}
          onBank={() => setView({ t: 'vocab-bank' })}
        />
      )}
      {view.t === 'vocab-review' && <VocabReview onDone={() => setView({ t: 'vocab' })} />}
      {view.t === 'vocab-bank' && <VocabBank onBack={() => setView({ t: 'vocab' })} />}
      {view.t === 'settings' && <Settings />}

      {!inFlow && <BottomNav active={tab!} onNavigate={(t) => setView({ t })} />}
    </div>
  );
}
