import { RESPIRE_MODULES } from "@/lib/formations";

// Ajouter ici les formations publiées avec leur fiche détaillée.
export const FORMATIONS = [
  {
    slug: "respire-bf",
    title: "RESPIRE-BF",
    subtitle: "Formation en recherche et méthodologie",
    category: "Recherche en santé",
    description: "De la conception d’un protocole à la publication scientifique et au montage de projets : développez votre pratique de la recherche.",
    format: "Hybride · En ligne et présentiel",
    modules: RESPIRE_MODULES.length,
    hours: RESPIRE_MODULES.reduce((total, module) => total + module.hours, 0),
    schedule: "Dates à venir",
  },
];
