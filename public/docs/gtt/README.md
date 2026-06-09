# Ressources téléchargeables des GTT

Déposez ici les fichiers (PDF, DOCX, XLSX…) accessibles depuis les pages `/gtt/<slug>`.

## Arborescence

```
public/docs/gtt/
├── tuberculose/
│   ├── guide-technique-2025.pdf
│   ├── guide-tb-enfant.pdf
│   └── ...
├── asthme-allergologie/
├── infections-non-tb/
└── ...
```

## Brancher un fichier sur une ressource

Dans `apps/web/src/app/gtt/[slug]/page.tsx`, ajoutez `file`, `size` et éventuellement `format` :

```ts
{
  title: "Guide technique de lutte contre la tuberculose (10ème éd., 2025)",
  icon: "📋",
  file: "/docs/gtt/tuberculose/guide-technique-2025.pdf",
  size: "2.4 Mo",
}
```

## Autres options du type `resources`

| Champ    | Description                                                          |
| -------- | -------------------------------------------------------------------- |
| `file`   | Chemin local dans `/public` → bouton **Télécharger** (`<a download>`) |
| `url`    | Lien externe (Drive, OMS…) → ouvre dans un nouvel onglet              |
| `size`   | Taille lisible affichée sous le titre (ex: `"2.4 Mo"`)               |
| `format` | Override du format affiché (sinon déduit de l'extension du `file`)   |

Si ni `file` ni `url` n'est fourni, la ressource s'affiche grisée avec la mention **« Bientôt disponible »**.

## Conventions

- **Nommage** : `kebab-case`, sans accents (`guide-tb-enfant.pdf`)
- **Taille** : compresser les PDF au-dessus de 5 Mo avant commit
- **Git** : commit normal pour les documents publics (guides OMS, PNT…). Pour des fichiers volumineux, envisager Git LFS ou bascule vers l'API NestJS (option 3).
