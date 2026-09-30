# SOBUP online — application web

Application Next.js du site public, de l’espace membre et de l’administration SOBUP.

## Démarrage

Depuis la racine du dépôt, installez les dépendances avec `npm install`, puis lancez `npm run dev:web`. L’application est accessible sur `http://localhost:3000`.

La configuration serveur requiert notamment les variables Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). Les fonctions d’envoi d’e-mails requièrent `RESEND_API_KEY` et un expéditeur autorisé. Gardez les clés serveur hors du navigateur et du dépôt.

## Vérifications

Depuis la racine : `npm run build`, `npm run lint` et `node --test apps/web/tests/*.test.cjs`. Les tests couvrent les candidatures RESPIRE-BF et la création des sondages. Ils utilisent un substitut Supabase. Depuis `apps/web`, `npm run check:backend` vérifie en lecture seule la présence des tables nécessaires et du bucket privé dans le Supabase configuré. Avant la mise en ligne, vérifiez aussi les formulaires et les accès sur ce projet Supabase.

## Formations et sondages

Le catalogue public des formations est défini dans `src/data/formations.ts`. Chaque formation publiée doit posséder une fiche dédiée. Le programme RESPIRE-BF et ses candidatures sont décrits dans `tests/README-formations.md` ; les sondages dans `tests/README-sondages.md`. Appliquez les scripts SQL correspondants à la racine du dépôt avant de tester ces parcours avec la base réelle.

Les candidatures et les votes n’apparaissent pas dans « Mes formations » : cet écran présente actuellement les formations disponibles et renvoie vers leurs fiches publiques.
