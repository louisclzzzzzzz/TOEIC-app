import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './store';
import { probeServerKey } from './lib/mistralApi';
import './index.css';

// Lancé au plus tôt : détermine si l'hébergeur fournit la clé Mistral, et donc
// si les voix naturelles sont disponibles sans rien saisir dans les réglages.
void probeServerKey();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
