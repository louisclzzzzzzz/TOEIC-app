# TOEIC Trainer

App perso de révision TOEIC **Listening & Reading**, pensée pour un mois de prépa
intensive à raison de 20-30 min par jour, en local, sans backend.

Vite + React 19 + TypeScript + Tailwind v4. Persistance en `localStorage`, audio
pré-synthétisé par l'API Mistral et livré comme fichiers statiques avec le build
(avec repli sur la Web Speech API du navigateur). L'app ne parle jamais à Mistral
en direct : pas de clé, pas de backend, un pur site statique. Une sauvegarde
cloud optionnelle (Supabase) peut être branchée pour ne pas perdre sa
progression entre appareils — voir [Synchronisation cloud](#synchronisation-cloud-supabase-optionnelle).

## Identité visuelle

Dashboard calme, plus proche d'une app de suivi personnel que d'un outil
scolaire. Contraste doux : ni noir pur ni blanc pur.

| Rôle | Valeur |
| --- | --- |
| Fond | crème `#F5F1E8` |
| Cartes | blanc cassé `#FCFAF5`, bordure `#E5DFD2`, rayon 20 px |
| Titres | bleu marine `#1A2238` |
| Texte secondaire | gris `#6B7280` |
| Série (flamme) | ambre `#C2740C` |
| En révision | bleu `#2563EB` |
| Maîtrisé | vert `#0F8A5F` |
| Précision | indigo `#4F46E5` |

**Typographie** — Playfair Display pour les titres et les textes de lecture
(passages de Part 6/7, phrases de Part 5 : c'est de la lecture suivie, pas de
l'interface), Inter pour tout le reste. Les deux sont **auto-hébergées** via npm :
aucune requête réseau, l'app démarre et fonctionne hors ligne. Les **valeurs
numériques restent toujours en Inter** — le « % » de Playfair est démesuré et se
désaligne des chiffres.

**Icônes** — dessinées dans [Icons.tsx](src/components/Icons.tsx), trait de 1,5,
sans remplissage, posées dans un cercle pastel. Aucune librairie : une vingtaine
de tracés garantissent une grille et une épaisseur identiques partout.

**Signature** — l'échine des sept parties (`PartSpine`) : sept segments, un par
partie de l'examen, remplis selon la précision. Elle encode la forme du TOEIC
plutôt que de décorer, et un creux se repère sans lire un chiffre.

**Navigation** — barre haute à partir de 768 px, barre d'onglets en bas en
dessous. L'app sert surtout sur téléphone, à une main : le haut de l'écran est
hors de portée du pouce. Les écrans de flux (session, examen, flashcards)
masquent les deux — pas d'échappatoire à un clic pendant un examen chronométré.

Une seule couleur par **section** (listening bleu, reading indigo) plutôt qu'une
par partie : sept teintes en aplat fatigueraient la page, alors que la
distinction listening / reading est la seule qui porte du sens à l'écran.

## Démarrer

```bash
npm install && npm run dev
```

Puis <http://localhost:5173>. L'app est **mobile-first** : le mieux est de l'ouvrir
sur le téléphone (même Wi-Fi, `npm run dev -- --host` puis l'IP affichée).

| Commande | Effet |
| --- | --- |
| `npm run dev` | serveur de dev |
| `npm run build` | build de production dans `dist/` |
| `npm run check` | vérifie la logique métier et l'intégrité de la banque |
| `npm run typecheck` | TypeScript strict |
| `MISTRAL_API_KEY=... npm run synthesize` | synthétise l'audio manquant dans `public/audio/` |

## Synchronisation cloud (Supabase, optionnelle)

Par défaut l'app reste ce qu'elle a toujours été : un pur site statique, état
persisté en `localStorage`. Brancher Supabase ajoute une sauvegarde cloud
(compte par email, lien magique) pour retrouver sa progression après une
réinstallation ou sur un autre appareil — sans rien changer si les variables
d'environnement sont absentes.

1. Créer un projet sur [supabase.com](https://supabase.com) (compte gratuit).
2. Dans le dashboard du projet → **SQL Editor**, exécuter le contenu de
   [`scripts/supabase-schema.sql`](scripts/supabase-schema.sql) : ça crée la
   table `progress` (une ligne par utilisateur, l'état complet en `jsonb`) et
   les policies RLS qui isolent chaque compte.
3. Dans **Authentication → Providers**, l'auth par email (lien magique) est
   activée par défaut — rien à faire. Dans **Authentication → URL
   Configuration**, ajouter l'URL de déploiement (et `http://localhost:5173`
   en dev) aux *Redirect URLs*.
4. Récupérer l'URL du projet et la clé `anon public` dans **Project Settings →
   API**, et les renseigner :
   - en local, dans un fichier `.env` (voir `.env.example`, jamais commité) ;
   - sur Vercel, dans **Settings → Environment Variables** (`VITE_SUPABASE_URL`,
     `VITE_SUPABASE_ANON_KEY`), puis redéployer.

Une fois configuré, un bloc **Compte** apparaît en haut des Réglages. À la
connexion, la progression locale de l'appareil est fusionnée avec celle du
cloud (jamais écrasée — `src/lib/sync.ts`), puis chaque changement est
repoussé vers Supabase en arrière-plan.

## Les 5 modes

| Mode | Ce que ça fait |
| --- | --- |
| **Practice ciblé** | une ou plusieurs parties au choix, 5 à 20 questions |
| **Mixte pondéré** | tirage pondéré : poids = `0.5 + 3 × taux d'erreur` de la partie (`1.6` si jamais travaillée) — les parties les plus ratées sortent ~4× plus souvent |
| **Révision espacée** | rejoue uniquement les items échus du journal d'erreurs |
| **Vocabulaire** | flashcards des mots ratés ou signalés (voir plus bas) |
| **Examen blanc** | ~32 questions, chronométré par section, aucune correction avant la fin |

Dans tous les modes, une session s'ouvre en moins d'une seconde : la banque est
codée en dur dans le bundle, et l'état est lu en synchrone depuis `localStorage`.

## Respect du format d'examen

- **Part 1** : illustration + 4 descriptions **uniquement audio** — à l'écran, seules
  les lettres A-D sont visibles avant la réponse.
- **Part 2** : question et 3 réponses **100 % audio**, rien d'imprimé.
- **Part 3 / 4** : audio diffusé, questions et propositions imprimées (comme à
  l'examen) ; la transcription n'apparaît **qu'après** avoir répondu.
- **Part 5** : phrase à trou, 4 propositions.
- **Part 6** : passage à 4 trous, dont une **phrase entière à insérer**.
- **Part 7** : passages simples et doubles, avec au moins une question qui oblige à
  **croiser les deux documents**.

Chronométrage de l'examen blanc : dérivé du rythme réel (45 min / 100 questions en
listening → 27 s par question ; 75 min / 100 en reading → 45 s). Le temps est
décompté **par section** ; celui qui reste en listening n'est pas reporté sur le
reading, et quand une section expire on passe directement à la suivante.

## Révision espacée (Leitner)

| Boîte | Prochaine révision |
| --- | --- |
| 0 | le lendemain |
| 1 | dans 3 jours |
| 2 | dans 7 jours |

- Un item entre dans la file **à la première faute**, avec énoncé, bonne réponse,
  réponse choisie, explication, partie, catégorie et timestamp.
- Bonne réponse → montée d'une boîte. **2 bonnes réponses consécutives → maîtrisé**,
  l'item sort de la file active.
- Une faute renvoie en boîte 0 et annule la maîtrise.
- Les échéances tombent à **minuit du jour cible** : un item raté à 23 h est
  disponible dès le lendemain matin, pas 24 h plus tard.

## Carnet de vocabulaire

Onglet **Vocab** — l'endroit unique où atterrit tout le lexique à revoir.

Il se remplit de deux façons :

- **automatiquement** : chaque question porte 1 à 3 mots clés (`vocab` dans la
  banque). Quand tu rates la question, ces mots entrent au carnet, avec leur
  traduction, une phrase d'exemple et la note d'usage. La correction te le dit
  explicitement (« 2 mots ajoutés au carnet automatiquement »), pour que
  l'automatisme reste visible ;
- **manuellement** : bouton **📓 Vocabulaire** sur chaque correction. Il liste
  les mots clés de la question — ceux déjà versés apparaissent cochés — et
  permet d'en saisir un autre. Le bouton **＋ Mot** du carnet fait la même chose
  hors session.

Ce qui est capté n'est pas du vocabulaire transparent, mais ce qui fait
réellement trébucher : la collocation figée (*to be promoted **to***), le faux
ami (*actually* ≠ actuellement, *extra* = supplémentaire), et surtout la
**paraphrase testée** par le TOEIC (*out of stock* → *unavailable*).

**Révision** : flashcards anglais → français, dans ce sens parce que le TOEIC est
un test de reconnaissance et non de production. Chaque carte peut être écoutée
(même moteur audio que les sessions). L'auto-évaluation « je savais » / « à
revoir » alimente **les mêmes boîtes Leitner** que le journal d'erreurs : deux
« je savais » consécutifs et le mot passe en *acquis*.

Une différence assumée avec le journal d'erreurs : un mot fraîchement capté est
**révisable immédiatement** (et non à J+1). Un mot qu'on vient de rater ou de
signaler doit pouvoir se travailler dans la foulée.

Les mots oubliés au moins deux fois sont comptés à part dans le carnet : ce sont
ceux qui méritent une fiche dédiée.

## Audio : deux moteurs

Réglable dans **Réglages → Audio**. L'app ne parle **jamais** à Mistral au
runtime — ni pour la voix, ni pour générer des questions. Tout le contenu et
son audio sont produits hors-ligne, en dev, puis committés dans le dépôt : le
site déployé est entièrement statique.

### Voix Mistral (moteur par défaut)

Les clips sont pré-synthétisés par `POST /v1/audio/speech` (modèle
`voxtral-mini-tts-2603`) via `scripts/synthesize-audio.ts`, puis livrés comme
fichiers statiques dans `public/audio/`. Nettement plus naturel que les voix
système, et surtout **identique d'un appareil à l'autre** — ce que la Web
Speech API ne garantit pas du tout, et sans le moindre appel réseau vers
Mistral une fois le build fait.

Voix fixes, une par rôle (`src/lib/voices.ts`) :

| Rôle | Voix | Accent |
| --- | --- | --- |
| féminine | `gb_jane_neutral` | britannique |
| masculine | `en_paul_neutral` | américain |
| narrateur | `gb_oliver_neutral` | britannique |

Le catalogue Mistral ne propose qu'une voix masculine américaine (Paul) et aucune
voix féminine américaine. Ce n'est pas gênant : **le TOEIC alterne délibérément
les accents** américain, britannique, canadien et australien, donc ce mélange
rapproche l'entraînement des conditions réelles. Les variantes émotionnelles
(Sad, Angry, Excited…) sont écartées au profit des variantes `neutral`, plus
proches du ton des enregistrements d'examen.

**Résolution des clips** : le nom de fichier est un hash SHA-256 du couple
`voix|texte` (`src/lib/staticAudio.ts` côté client, même calcul côté script).
Pas de manifeste à tenir à jour — le client retrouve le fichier tout seul, et un
même texte relu par la même voix retombe sur le même clip. Les navigateurs
mettent ces fichiers en cache HTTP normalement (`vercel.json` les sert en
`immutable`, le hash change si le texte change).

### Voix système (Web Speech API)

Repli hors ligne et gratuit. Les voix **en-US** sont choisies par liste de
préférence (Samantha, Alex, Ava, Eddy…) en écartant explicitement les voix
« nouveauté » de macOS (Zarvox, Bouffon, Cloches…), qui sont majoritaires dans la
liste système — sans ce filtre, l'app tombait sur une voix de fantaisie.

### Navigation dans l'audio

Avec les voix Mistral, le lecteur affiche une **barre de position** : glisser
n'importe où, **−5 s / +5 s**, et **« Ce passage »** qui reprend la réplique en
cours depuis son début. Une fois la réponse validée, chaque ligne de la
transcription devient cliquable et rejoue exactement ce passage ; la réplique en
cours de lecture est surlignée.

Les clips sont **un fichier par réplique** : une conversation arrive en quatre ou
cinq fichiers, pas en un seul. Plutôt que de les concaténer — l'en-tête du
premier MP3 annoncerait alors une durée fausse, donc une barre fausse —
`lib/blockPlayer.ts` mesure chaque clip et tient une **timeline virtuelle**
par-dessus : chercher la seconde 42, c'est trouver le clip qui la contient et s'y
positionner. Effet de bord utile : les frontières entre répliques sont connues au
clip près, donc elles sont **marquées sur la barre** et on reprend une phrase
sans viser au pixel. Les silences entre répliques ne comptent pas dans la
timeline — elle mesure l'audio entendu, pas les blancs de mise en scène.

La barre n'existe **pas** avec les voix du système : la Web Speech API ne sait ni
se positionner ni donner une durée. Plutôt qu'un curseur inerte, l'app l'omet et
le dit dans le message de repli.

### Règles communes

- **Aucune erreur audio ne bloque une session** : clip manquant, réseau coupé →
  bascule automatique sur la voix système, avec un message.
- La première lecture demande un **appui sur ▶** (les navigateurs bloquent l'audio
  sans geste utilisateur). Les suivantes démarrent seules si la lecture auto est active.
- La vitesse (0.95× ≈ rythme examen) s'applique aux deux moteurs.
- Le nombre d'écoutes est affiché pour rappeler qu'à l'examen on n'entend l'audio
  qu'**une seule fois**.

## Synthétiser l'audio (`scripts/synthesize-audio.ts`)

```bash
MISTRAL_API_KEY=... npm run synthesize
```

Parcourt toute la banque (`src/data/partN.ts`), déduplique les répliques par
`(voix, texte)`, et synthétise celles qui n'ont pas encore de fichier dans
`public/audio/` — idempotent, donc ajouter des questions à la banque puis
relancer la commande ne resynthétise que le nouveau contenu. Le script parle
directement à `api.mistral.ai` (un script Node n'a pas le problème CORS du
navigateur), écrit les `.mp3`, puis affiche un résumé (synthétisées / échecs /
déjà présentes, poids total). `public/audio/` est committé dans le dépôt : c'est
ce qui rend l'audio disponible dans l'app déployée, sans clé ni backend.

## Étendre la banque

La banque est découpée **par partie** : `src/data/part1.ts` … `part7.ts`, recollés
par [`src/data/questions.ts`](src/data/questions.ts), qui documente les conventions
de rédaction en tête de fichier. Pour étendre : ajouter un `QuestionSet` à la fin du
fichier de la partie concernée (un bloc = un stimulus + ses questions) — le contenu
se rédige directement dans le dépôt, il n'y a plus de génération en direct dans
l'app. `src/lib/seedExport.ts` reste utile pour produire ce littéral TypeScript
sans le retranscrire à la main (`setToSource`), avec la numérotation `pN-XX`
(`nextIndex`, `renumber`) — pratique pour coller le résultat d'une session de
rédaction assistée.

Puis, dans cet ordre :

```bash
npm run check                             # logique métier et intégrité de la banque
MISTRAL_API_KEY=... npm run synthesize    # audio des nouvelles répliques
```

`npm run check` vérifie l'unicité des ids, le nombre de propositions par partie, la
présence de la bonne réponse dans les choix, les scripts audio du listening,
l'absence d'énoncé imprimé en Part 1/2, la numérotation des trous de Part 6, etc.
Relis toujours le contenu avant de committer — c'est le cœur pédagogique de l'app,
et la validation ne juge que la forme.

## Structure

```
src/
  data/
    questions.ts        agrégateur + conventions de rédaction
    part1.ts … part7.ts banque par partie (117 blocs, 220 questions, 425 mots clés)
  lib/
    toeic.ts            métadonnées des 7 parties, rythme réel
    selection.ts        construction des sessions (ciblé, mixte, révision, examen)
    leitner.ts          boîtes, échéances, maîtrise (noyau partagé)
    vocab.ts            carnet de vocabulaire : capture, normalisation, révision
    stats.ts            précision par partie/catégorie, série 30 jours, streak
    tts.ts              point d'entrée audio : choix du moteur, repli
    blockPlayer.ts      timeline continue sur des clips séparés (barre de navigation)
    speech.ts           moteur système (Web Speech API) : voix, file, keep-alive Chrome
    staticAudio.ts      moteur Mistral : résout et récupère les clips pré-synthétisés
    voices.ts           voix Mistral fixes (une par rôle) et modèle TTS
    storage.ts          localStorage (chargement défensif, export JSON)
    seedExport.ts       QuestionSet → source TypeScript prête à coller dans partN.ts
  components/           Scene (SVG Part 1), AudioPlayer, Passage, chart, primitives
  screens/              Home, PracticeSetup, Session, Results, Dashboard, Journal,
                        Vocab, VocabReview, ExamIntro, Settings
  store.tsx             context + reducer, persistance automatique
public/audio/           clips MP3 pré-synthétisés, nommés par hash (voix + texte)
scripts/
  check.ts               vérifications de la logique et de la banque
  synthesize-audio.ts     synthèse Mistral → public/audio/ (hors-ligne, voir plus haut)
```

## Contenu et droits

Toutes les questions, transcriptions et passages ont été **écrits de zéro** pour
cette app, dans le style TOEIC (contextes professionnels). Aucun contenu ETS n'est
repris. Les illustrations de la Part 1 sont des SVG dessinés dans le code, sans
image externe.

TOEIC est une marque déposée d'ETS ; cette app n'est ni affiliée ni approuvée par ETS.
