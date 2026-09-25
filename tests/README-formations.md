# RESPIRE-BF

## Activation

1. Exécuter `supabase-formations.sql` (racine du dépôt) dans le SQL Editor du projet Supabase associé au site. Le script crée une table protégée par RLS et un bucket privé ; il ne modifie pas les autres tables.
2. Vérifier les variables serveur existantes `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sur l’environnement de déploiement. La clé service_role ne doit jamais être exposée au navigateur.
3. Déployer les modifications et vérifier le catalogue `/formations`, la fiche et son formulaire `/formations/respire-bf`, puis `/admin/formations`.
4. Dans un environnement de test, déposer un CV fictif, avec et sans lettre, puis télécharger les documents depuis l’administration. Vérifier que le téléchargement sans session admin renvoie 401 et que les fichiers ne sont pas accessibles par une URL publique.

La candidature ne déclenche ni email, ni paiement, ni admission automatique. Une référence est affichée uniquement après enregistrement confirmé. Les dates et le lieu restent à renseigner. Les tarifs et le programme proviennent de `RESPIRE_BF_V0_VSPE.docx` fourni par le porteur du projet.

## Vérifications locales

Depuis la racine : `node --test apps/web/tests/formations.test.cjs`.

Ces tests exécutent les véritables routes avec un substitut Supabase en mémoire : choix de modules, CV obligatoire, lettre facultative, validations, rejouabilité, nettoyage après échec et protection du téléchargement. Ils ne remplacent pas un test d’intégration sur le Supabase configuré.

Fichiers acceptés : PDF, DOC et DOCX, maximum 2 Mo par fichier. Les signatures de fichiers sont contrôlées ; ce contrôle ne constitue pas une analyse antivirus. Les téléchargements administrateur sont servis en pièces jointes avec un cache désactivé.
