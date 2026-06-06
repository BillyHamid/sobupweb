/**
 * Liste des membres SOBUP avec leurs identifiants de connexion.
 * Mot de passe de démo unique : "sobup2026"
 * Dans une vraie application : hashage côté serveur + JWT.
 */

export interface SobupMember {
  email: string;
  password: string; // démo seulement
  name: string;
  avatar: string;
  role: string;
  specialite?: string;
  etablissement?: string;
  ville?: string;
  joinedAt: string;
  isBureau: boolean;
  gtt?: string[];
}

export const MEMBERS: SobupMember[] = [
  // ───────── BUREAU EXÉCUTIF ─────────
  {
    email: "abdoul.ouedraogo@sobup.bf",
    password: "sobup2026",
    name: "Dr Abdoul Risgou OUEDRAOGO",
    avatar: "AO",
    role: "Président de la SOBUP",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2010",
    isBureau: true,
    gtt: [],
  },
  {
    email: "maiga.soumaila@sobup.bf",
    password: "sobup2026",
    name: "Dr Soumaila MAIGA",
    avatar: "SM",
    role: "Secrétaire Général",
    specialite: "Pneumologie",
    etablissement: "CHR de Gaoua",
    ville: "Gaoua",
    joinedAt: "2018",
    isBureau: true,
    gtt: [],
  },
  {
    email: "damoue.sandrine@sobup.bf",
    password: "sobup2026",
    name: "Dr Sandrine Nadège DAMOUE",
    avatar: "SD",
    role: "Secrétaire Générale Adjointe",
    specialite: "Pneumologie",
    etablissement: "CHU de Bogodogo",
    ville: "Ouagadougou",
    joinedAt: "2019",
    isBureau: true,
    gtt: [],
  },
  {
    email: "siambo.eleonore@sobup.bf",
    password: "sobup2026",
    name: "Dr Éléonore SIAMBO / SENI",
    avatar: "ES",
    role: "Trésorière",
    specialite: "Pneumologie",
    etablissement: "CHU de Tengandogo",
    ville: "Ouagadougou",
    joinedAt: "2017",
    isBureau: true,
    gtt: [],
  },
  {
    email: "sourabie.adama@sobup.bf",
    password: "sobup2026",
    name: "Dr Adama SOURABIE",
    avatar: "AS",
    role: "Secrétaire aux Activités Scientifiques",
    specialite: "Pneumologie",
    etablissement: "CHU Souro Sanou",
    ville: "Bobo-Dioulasso",
    joinedAt: "2016",
    isBureau: true,
    gtt: [],
  },
  {
    email: "bougma.ghislain@sobup.bf",
    password: "sobup2026",
    name: "Dr Ghislain BOUGMA",
    avatar: "GB",
    role: "Secrétaire Adjoint aux Activités Scientifiques",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2020",
    isBureau: true,
    gtt: [],
  },
  {
    email: "tiendrebeogo.arnaud@sobup.bf",
    password: "sobup2026",
    name: "Dr Arnaud TIENDREBEOGO",
    avatar: "AT",
    role: "Secrétaire à la Formation & à la Recherche",
    specialite: "Physiologie / Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2015",
    isBureau: true,
    gtt: [],
  },
  {
    email: "nikiema.tanguy@sobup.bf",
    password: "sobup2026",
    name: "Dr Tanguy NIKIEMA",
    avatar: "TN",
    role: "Secrétaire Adjoint à la Formation & à la Recherche",
    specialite: "Pneumologie",
    etablissement: "CHU de Bogodogo",
    ville: "Ouagadougou",
    joinedAt: "2021",
    isBureau: true,
    gtt: [],
  },
  {
    email: "koumbem.boureima@sobup.bf",
    password: "sobup2026",
    name: "Dr Boureima KOUMBEM",
    avatar: "BK",
    role: "Secrétaire à la Mobilisation des Ressources",
    specialite: "Pneumologie",
    etablissement: "CHR de Ouahigouya",
    ville: "Ouahigouya",
    joinedAt: "2019",
    isBureau: true,
    gtt: [],
  },
  {
    email: "coulibaly.aly@sobup.bf",
    password: "sobup2026",
    name: "Dr Aly COULIBALY",
    avatar: "AC",
    role: "Secrétaire à la Communication",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2018",
    isBureau: true,
    gtt: [],
  },
  {
    email: "kunakey.edem@sobup.bf",
    password: "sobup2026",
    name: "Dr Edem KUNAKEY",
    avatar: "EK",
    role: "Rédacteur en Chef — Newsletter SOBUP",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2022",
    isBureau: true,
    gtt: [],
  },
  {
    email: "soubeiga.dimitri@sobup.bf",
    password: "sobup2026",
    name: "Dr Dimitri SOUBEIGA",
    avatar: "DS",
    role: "Rédacteur en Chef Adjoint",
    specialite: "Pneumologie",
    etablissement: "CHR de Banfora",
    ville: "Banfora",
    joinedAt: "2023",
    isBureau: true,
    gtt: [],
  },
  {
    email: "batiebo.nouria@sobup.bf",
    password: "sobup2026",
    name: "Dr Nouria BATIEBO / YAO",
    avatar: "NB",
    role: "Représentante des Résidents en Pneumologie",
    specialite: "DES Pneumologie (en cours)",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2024",
    isBureau: true,
    gtt: [],
  },

  // ───────── AUTRES MEMBRES (exemples) ─────────
  {
    email: "ouedraogo.martial@sobup.bf",
    password: "sobup2026",
    name: "Pr Martial OUÉDRAOGO",
    avatar: "MO",
    role: "Président fondateur · Coordinateur national DES",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2007",
    isBureau: false,
    gtt: [],
  },
  {
    email: "boncoungou.kadiatou@sobup.bf",
    password: "sobup2026",
    name: "Pr Kadiatou BONCOUNGOU",
    avatar: "KB",
    role: "Membre — Coordinatrice GT Tuberculose",
    specialite: "Pneumologie",
    etablissement: "CHU Yalgado Ouédraogo",
    ville: "Ouagadougou",
    joinedAt: "2012",
    isBureau: false,
    gtt: [],
  },
];

/**
 * Vérifier les identifiants. Retourne le membre si OK, sinon null.
 */
export function authenticate(email: string, password: string): SobupMember | null {
  const cleanEmail = email.trim().toLowerCase();
  const found = MEMBERS.find(
    (m) => m.email.toLowerCase() === cleanEmail && m.password === password
  );
  return found || null;
}
