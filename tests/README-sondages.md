# Activation des sondages de cérémonie

1. Exécuter `supabase-sondages.sql` à la racine du dépôt dans le SQL Editor du projet Supabase relié au site.
2. Déployer le code. Dans `/admin/sondages`, créer le titre, la question et la liste des personnes, une par ligne, puis copier le lien généré.
3. Vérifier avec deux comptes de test : un membre ayant un profil Supabase peut voter une fois ; une personne sans compte ou sans profil membre ne le peut pas. L’administration voit les noms et les choix, tandis que les membres ne voient pas les votes des autres.

Le vote utilise la session Supabase Auth et une fonction SQL transactionnelle. Les comptes de démonstration affichés par l’ancien espace membre ne sont pas autorisés. Les tables de bulletins ne sont pas lisibles par les clients publics et les résultats détaillés sont servis uniquement dans l’administration existante.

Tests locaux : `node --test apps/web/tests/sondages.test.cjs`. Un vote réel demande la migration et un environnement Supabase de test ; il n’a pas été simulé sur les données de production.
