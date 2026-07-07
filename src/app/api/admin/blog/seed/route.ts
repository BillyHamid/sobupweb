import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/supabase/adminAuth";

const SEED_POSTS = [
  {
    slug: "tournee-convivialite-24-avril",
    category: "Actualités",
    title: "Tournée de convivialité : le Bureau visite les structures de la capitale",
    excerpt: "Après le CHU-YO, le CNLAT et le SP/CNLST, le Bureau exécutif a poursuivi sa tournée en visitant plusieurs structures de Ouagadougou.",
    content: "Chers tous,\n\nAprès le CHU-YO, le CNLAT, le SP/CNLST, et l'OST, le Bureau exécutif de la SOBUP a poursuivi sa tournée de convivialité le 24 avril 2026 dans plusieurs structures de la capitale.\n\nUne délégation s'est rendue :\n\n• au CHU Bogodogo\n• au CHU Tengandogo\n• au CHU Pédiatrique Charles De Gaulle\n• à l'Hôpital de district de Bogodogo\n• à l'hôpital militaire Capitaine Halassane Coulibaly\n\nDans toutes ces structures, ladite délégation a reçu un accueil très chaleureux de la part des chefs de service et de l'ensemble des équipes. Des échanges ont mis en lumière de très belles perspectives pour le rayonnement de la Pneumologie au Burkina Faso.\n\nMerci à tous nos collègues et membres pour leur disponibilité et leur engagement.\n\nBien à vous,\nPrésident SOBUP",
    image_url: "/actualiteSobup/actu1.jpeg",
    gtt: null,
    display_date: "24 Avr 2026",
    featured: true,
  },
  {
    slug: "visites-convivialite-bureau",
    category: "Actualités",
    title: "Le Bureau exécutif débute ses visites de convivialité",
    excerpt: "Le 8 avril, le Bureau exécutif a débuté ses visites au CHU-YO pour renforcer la cohésion au sein de la SOBUP.",
    content: "Chers tous,\n\nCe 8 avril, le Bureau exécutif a débuté ses visites de convivialité pour renforcer la cohésion, en commençant par le berceau : le service de pneumologie du CHU-YO.\n\nAu menu :\n• Présentation du bureau\n• Précieux conseils des aînés et Maîtres\n• Remise des cartes de membre au Président d'honneur ainsi qu'à tous les membres à jour de cotisation\n\nRappel : Le Bureau prévoit de rendre visite à l'ensemble des pneumologues sur tout le territoire.\n\nNB : Les cartes de membre sont disponibles pour tous les membres à jour de leur cotisation.\n\nBien à vous,\nPrésident SOBUP",
    image_url: "/actualiteSobup/actu2.jpeg",
    gtt: null,
    display_date: "8 Avr 2026",
    featured: true,
  },
  {
    slug: "8eme-congres-2025",
    category: "Congrès",
    title: "8ème Congrès SOBUP — Pneumologie à l'ère des technologies nouvelles",
    excerpt: "Édition 2025 du Congrès de la Société Burkinabè de Pneumologie à l'Azalaï Hôtel de Ouagadougou.",
    content: "Le 8ème Congrès de la SOBUP s'est tenu en décembre 2025 à l'Azalaï Hôtel de Ouagadougou, sur le thème « Pratique de la pneumologie au Burkina Faso à l'ère des technologies nouvelles ».\n\nCette édition a réuni pneumologues, internes, paramédicaux et partenaires autour des innovations diagnostiques et thérapeutiques en pneumologie : intelligence artificielle, télémédecine, imagerie de pointe, nouveaux protocoles de prise en charge.\n\nPlusieurs sessions plénières et ateliers pratiques ont permis aux participants d'échanger sur les défis de la pratique quotidienne au Burkina Faso, dans un contexte où les outils numériques transforment progressivement la médecine respiratoire.\n\nLa SOBUP remercie tous les intervenants, partenaires et participants qui ont fait le succès de cette 8ème édition.",
    image_url: "/congresobup/congres-6.jpeg",
    gtt: null,
    display_date: "Décembre 2025",
    featured: false,
  },
  {
    slug: "7eme-congres-2023",
    category: "Congrès",
    title: "7ème Congrès SOBUP — Pathologies respiratoires professionnelles",
    excerpt: "Édition 2023 consacrée aux pathologies respiratoires liées au travail, au Bravia Hôtel de Ouagadougou.",
    content: "Le 7ème Congrès de la SOBUP s'est tenu en décembre 2023 au Bravia Hôtel de Ouagadougou, autour du thème « Pathologies respiratoires professionnelles ».\n\nCette édition a mis en lumière les enjeux de santé respiratoire liés aux conditions de travail : pneumoconioses, asthme professionnel, BPCO du travailleur, expositions aux poussières et vapeurs toxiques.\n\nLe congrès a notamment réuni :\n\n• Le Pr Martial OUÉDRAOGO, Président fondateur\n• Le Ministre de la Santé Dr KARGOUGOU, intervenu sur la politique nationale de santé au travail\n• Le jury de soutenance de la 4ème promotion du DES de pneumologie\n• Des délégations régionales et internationales\n\nLes échanges ont posé les bases du référentiel des maladies respiratoires indemnisables au Burkina Faso, projet désormais porté par le GT Environnement & Travail.",
    image_url: "/7econgres/photo-1.jpeg",
    gtt: "GT Environnement & Travail",
    display_date: "Décembre 2023",
    featured: false,
  },
  {
    slug: "6eme-congres-2021",
    category: "Congrès",
    title: "6ème Congrès SOBUP — Pathologies respiratoires et situation de crise",
    excerpt: "Édition 2021 organisée à Bobo-Dioulasso, dans un contexte marqué par la pandémie de Covid-19.",
    content: "Le 6ème Congrès de la SOBUP s'est tenu en décembre 2021 à l'Hôtel Sissiman de Bobo-Dioulasso, sur le thème « Pathologies respiratoires et situation de crise ».\n\nCette édition particulière, organisée en pleine pandémie de Covid-19, a permis à la communauté pneumologique burkinabè de partager les enseignements tirés de cette crise sanitaire majeure :\n\n• Prise en charge des formes graves de Covid-19\n• Séquelles respiratoires post-Covid\n• Organisation des services en situation d'urgence sanitaire\n• Vaccination et stratégies de prévention\n\nLe choix de Bobo-Dioulasso comme ville hôte a aussi marqué l'engagement de la SOBUP à décentraliser ses activités scientifiques. Le congrès a coïncidé avec la sortie conjointe des 2ème et 3ème promotions du DES de pneumologie.",
    image_url: "/6econgres/photo-1.jpeg",
    gtt: null,
    display_date: "Décembre 2021",
    featured: false,
  },
  {
    slug: "5eme-congres-2019",
    category: "Congrès",
    title: "5ème Congrès SOBUP — Innovation en pratique pneumologique au Burkina Faso",
    excerpt: "Édition 2019 au Bravia Hôtel de Ouagadougou, sur les innovations en pneumologie.",
    content: "Le 5ème Congrès de la SOBUP s'est tenu en décembre 2019 au Bravia Hôtel de Ouagadougou, sur le thème « Innovation en pratique pneumologique au Burkina Faso ».\n\nCette édition a marqué un tournant pour la pneumologie burkinabè avec l'introduction de nouvelles pratiques cliniques et de nouveaux outils diagnostiques. Elle a également été l'occasion de célébrer la sortie de la 1ère promotion du DES de pneumologie du Burkina Faso, un jalon historique pour la formation locale des spécialistes.\n\nUn hommage particulier a été rendu au Pr Hilaire TIENDRÉBÉOGO, figure emblématique de la médecine burkinabè, dont l'héritage continue d'inspirer les générations actuelles.",
    image_url: "/5econgres/photo-1.jpeg",
    gtt: null,
    display_date: "Décembre 2019",
    featured: false,
  },
  {
    slug: "4eme-congres-2017",
    category: "Congrès",
    title: "4ème Congrès SOBUP — Pneumologie tropicale et approches thérapeutiques nouvelles",
    excerpt: "Édition 2017 au CHU Blaise Compaoré de Ouagadougou.",
    content: "Le 4ème Congrès de la SOBUP s'est tenu en décembre 2017 au CHU Blaise Compaoré de Ouagadougou, sur le thème « Pneumologie tropicale et approches thérapeutiques nouvelles ».\n\nCette édition a abordé les spécificités africaines de la médecine respiratoire : tuberculose et co-infection VIH, infections fongiques tropicales, parasitoses pulmonaires, et nouvelles classes thérapeutiques.\n\nLes échanges ont également permis d'approfondir les particularités épidémiologiques et cliniques des maladies respiratoires en zone tropicale, indispensables à une prise en charge adaptée au contexte burkinabè et sous-régional.",
    image_url: "/4econgres/photo-1.jpg",
    gtt: null,
    display_date: "Décembre 2017",
    featured: false,
  },
  {
    slug: "3eme-congres-2015",
    category: "Congrès",
    title: "3ème Congrès SOBUP — Poumon et environnement",
    excerpt: "Édition 2015 au Palm Beach Hôtel de Ouagadougou.",
    content: "Le 3ème Congrès de la SOBUP s'est tenu en décembre 2015 au Palm Beach Hôtel de Ouagadougou, sur le thème « Poumon et environnement ».\n\nCette édition s'est concentrée sur l'impact des facteurs environnementaux sur la santé respiratoire : pollution atmosphérique, expositions domestiques (fumées de cuisson), poussières du Sahel, et leurs conséquences sur les pathologies pulmonaires.\n\nLes communications ont ouvert le débat sur les politiques publiques de prévention environnementale et la nécessité d'études épidémiologiques nationales pour mieux quantifier l'impact réel de ces expositions.",
    image_url: "/3econgres/photo-1.jpg",
    gtt: null,
    display_date: "Décembre 2015",
    featured: false,
  },
  {
    slug: "2eme-congres-2013",
    category: "Congrès",
    title: "2ème Congrès SOBUP — Asthme, Allergologie et Antibiothérapie",
    excerpt: "Édition 2013 au Palm Beach Hôtel de Ouagadougou.",
    content: "Le 2ème Congrès de la SOBUP s'est tenu en décembre 2013 au Palm Beach Hôtel de Ouagadougou, sur le thème « Asthme, Allergologie et Antibiothérapie ».\n\nCette édition a posé les bases d'une approche structurée de la prise en charge de l'asthme et des allergies respiratoires au Burkina Faso, ainsi que des recommandations sur l'usage rationnel des antibiotiques en pneumologie.\n\nLe livre des résumés de cette édition est consultable sur la page Événements.",
    image_url: "/baniercongres/congres-2-v2.jpg",
    gtt: null,
    display_date: "Décembre 2013",
    featured: false,
  },
  {
    slug: "1er-congres-2011",
    category: "Congrès",
    title: "1er Congrès SOBUP — Poumon et environnement",
    excerpt: "Première édition historique du Congrès SOBUP, à la Salle de conférences Ouaga 2000.",
    content: "Le 1er Congrès de la SOBUP s'est tenu en décembre 2011 à la Salle de conférences de Ouaga 2000, sur le thème « Poumon et environnement ».\n\nCette édition fondatrice a posé les bases scientifiques et organisationnelles des congrès biennaux de la Société Burkinabè de Pneumologie. Sous l'impulsion du Pr Martial OUÉDRAOGO, Président fondateur, les pneumologues burkinabè et leurs partenaires internationaux ont marqué le démarrage d'un cycle d'échanges scientifiques régulier au service de la santé respiratoire du pays.\n\nLes thèmes abordés incluaient les déterminants environnementaux des pathologies respiratoires, l'impact de la pollution intérieure et extérieure, et les premières orientations sur la prise en charge de la tuberculose et des pathologies pulmonaires chroniques au Burkina Faso.",
    image_url: "/1er_congres/photo-1.jpeg",
    gtt: null,
    display_date: "Décembre 2011",
    featured: false,
  },
];

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const supabase = createAdminClient();

  // Insertion avec ON CONFLICT (slug) : ne fait rien si le slug existe déjà
  const { data, error } = await supabase
    .from("blog_posts")
    .upsert(SEED_POSTS, { onConflict: "slug", ignoreDuplicates: true })
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, inserted: data?.length ?? 0, total: SEED_POSTS.length });
}
