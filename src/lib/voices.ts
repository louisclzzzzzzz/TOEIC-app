/**
 * Voix Mistral fixes utilisées pour la synthèse audio.
 *
 * L'audio de la banque est pré-synthétisé hors-ligne (`scripts/synthesize-audio.ts`)
 * et livré comme fichiers statiques : il n'y a donc plus de sélection de voix ni de
 * modèle en direct dans l'app, une seule voix par rôle, fixée une fois pour toutes.
 *
 * Le catalogue Mistral ne propose qu'une voix masculine américaine (Paul) et aucune
 * voix féminine américaine ; la voix féminine est donc britannique (Jane). Ce n'est
 * pas un pis-aller : le TOEIC alterne délibérément les accents américain,
 * britannique, canadien et australien, ce mélange rapproche donc l'entraînement des
 * conditions réelles. Les variantes « neutral » sont préférées aux variantes
 * émotionnelles, plus proches du ton posé des enregistrements d'examen.
 */

import type { VoiceRole } from '../types';

export const TTS_MODEL = 'voxtral-mini-tts-2603';

export const DEFAULT_VOICES: Record<VoiceRole, string> = {
  male: 'en_paul_neutral',
  female: 'gb_jane_neutral',
  narrator: 'gb_oliver_neutral',
};
