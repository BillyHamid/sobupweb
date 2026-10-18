import { ECHOT_DATES, RESPIRE_DATES, RESPIRE_MODULES, RESPIRE_PEDAGOGICAL_DIRECTOR, THORACOSCOPY_DATES } from "@/lib/formations";

type FormationCard = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  description: string;
  format: string;
  schedule: string;
  modules?: number;
  hours?: number;
  practicalSessions?: string;
  pedagogicalDirector?: string;
  pedagogicalDirectorRole?: string;
};

// Ajouter ici les formations publiées avec leur fiche détaillée.
export const FORMATIONS: FormationCard[] = [
  {
    slug: "respire-bf",
    title: "RESPIRE-BF",
    subtitle: "Formation en recherche et méthodologie",
    category: "Recherche en santé",
    image: "/affiches/respire-bf-affiche-101h.png",
    description: "De la conception d’un protocole à la publication scientifique et au montage de projets : développez votre pratique de la recherche.",
    pedagogicalDirector: RESPIRE_PEDAGOGICAL_DIRECTOR.name,
    pedagogicalDirectorRole: RESPIRE_PEDAGOGICAL_DIRECTOR.role,
    format: "Hybride · En ligne et présentiel",
    modules: RESPIRE_MODULES.length,
    hours: RESPIRE_MODULES.reduce((total, module) => total + module.hours, 0),
    schedule: `En ligne : ${RESPIRE_DATES.online} · Présentiel : ${RESPIRE_DATES.inPerson}`,
  },
  {
    slug: "echographie-thoracique",
    title: "Échographie thoracique",
    subtitle: "Formation hybride pour pneumologues et médecins en formation",
    category: "Pratique clinique",
    image: "/affiches/echographie-thoracique.png",
    description: "Apprenez à réaliser et interpréter une échographie thoracique de base, avec quatre jours de pratique supervisée et un mentorat après la formation.",
    format: "Hybride · Théorie en ligne et pratique en présentiel",
    schedule: `Théorie : dès le ${ECHOT_DATES.onlineStart} · Pratique : dès le ${ECHOT_DATES.practiceStart}`,
    practicalSessions: "5 sessions de 4 jours · 25 places maximum",
  },
  {
    slug: "thoracoscopie-medicale",
    title: "Thoracoscopie médicale",
    subtitle: "Formation en trois phases avec pratique supervisée",
    category: "Pratique clinique",
    image: "/affiches/thoracoscopie-medicale.png",
    description: "Préparation en ligne, initiation à Ouagadougou et séminaires pratiques de consolidation dans deux CHU.",
    format: "Hybride · Préparation en ligne et formation en présentiel",
    schedule: `Préparation : ${THORACOSCOPY_DATES.preparation} · Initiation : du ${THORACOSCOPY_DATES.initiation}`,
    practicalSessions: "5 séminaires pratiques de 5 jours · 10 places",
  },
];
