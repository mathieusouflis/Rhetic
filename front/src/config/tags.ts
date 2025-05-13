export type Tag = string;

export interface TagGroup {
  name: string;
  tags: Tag[];
}

export const TAG_LIST: TagGroup[] = [
  {
    name: "Vie étudiante & Campus",
    tags: [
      "Associations étudiantes",
      "BDE / BDS / BDA",
      "Événements (soirées, conférences, forums)",
      "Groupes de promos / classes",
      "Logement & entraide étudiante",
    ],
  },
  {
    name: "Cours & Apprentissage",
    tags: [
      "Aide aux devoirs / tutorat",
      "Partage de cours / ressources",
      "Sujets académiques (maths, dev, design...)",
      "Projets de groupe",
      "Préparation aux examens",
    ],
  },
  {
    name: "Projets & Hackathons",
    tags: [
      "Projets scolaires (site, appli, jeu, etc.)",
      "Hackathons & concours",
      "Side projects entre étudiants",
      "Espaces de collaboration",
      "Présentations & retours",
    ],
  },
  {
    name: "Stages & Vie Pro",
    tags: [
      "Offres de stages / alternances / jobs",
      "Préparation CV / portfolio",
      "Coaching / mentoring",
      "Entrepreneuriat / startup",
      "Networking entre promos / alumni",
    ],
  },
  {
    name: "Développement Personnel",
    tags: [
      "Organisation & productivité",
      "Santé mentale & équilibre",
      "Motivation & objectifs",
      "Mindfulness / méditation",
      "Journaling, routine",
    ],
  },
  {
    name: "Technologie & Code",
    tags: [
      "Programmation (par langage)",
      "Web / mobile / backend / UI/UX",
      "Intelligence artificielle",
      "Cybersécurité / cloud / DevOps",
      "Outils & ressources dev",
    ],
  },
  {
    name: "Création & Design",
    tags: [
      "Graphisme, UI/UX, motion",
      "Illustration / dessin",
      "Photo / vidéo / montage",
      "Musique & MAO",
      "Design produit / maquettes",
    ],
  },
  {
    name: "Jeux & Détente",
    tags: [
      "Jeux vidéo (LoL, Valorant, etc.)",
      "Jeux de rôle / RP",
      "Soirées jeux / tournois",
      "Dév de jeux étudiants",
      "Serveurs communautaires chill",
    ],
  },
  {
    name: "Culture & Médias",
    tags: [
      "Cinéma, séries, documentaires",
      "Anime / manga / BD",
      "Musique / playlists",
      "Livres, articles, podcasts",
      "Actu & débats",
    ],
  },
  {
    name: "Langues & International",
    tags: [
      "Pratique de langues (anglais, espagnol…)",
      "Échanges linguistiques",
      "Étudiants internationaux",
      "Séjours à l'étranger",
      "Aides & ressources Erasmus",
    ],
  },
  {
    name: "Associations & Engagement",
    tags: [
      "Associations solidaires, humanitaires",
      "Écologie & développement durable",
      "Actions citoyennes",
      "Clubs thématiques (féminisme, diversité, tech4good…)",
      "Projets associatifs étudiants",
    ],
  },
  {
    name: "Expérimental & Innovation",
    tags: [
      "Espaces de tests & bêtas",
      "IA & bots",
      "Prototypes, concepts, labs",
      "Techno créative / artistique",
      "Explorations personnelles",
    ],
  },
];
