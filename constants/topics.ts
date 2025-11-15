export type EncyclopediaCategory = 'Concepts' | 'People' | 'Places' | 'Events' | 'Science & Nature';

export interface CuratedTopic {
  title: string;
  subtitle: string;
  image: string;
  summary: string;
  category: EncyclopediaCategory;
}

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    title: "Quantum Mechanics",
    subtitle: "How the smallest particles behave",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6f/QM_Planck_scale_graph-crop.svg",
    summary: "Dive into the counterintuitive world that powers lasers, semiconductors, and modern physics.",
    category: 'Concepts',
  },
  {
    title: "Photosynthesis",
    subtitle: "Sunlight into chemical energy",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Photosynthesis.png",
    summary: "Understand the process that sustains life on Earth by turning light into fuel.",
    category: 'Science & Nature',
  },
  {
    title: "Theory of Relativity",
    subtitle: "Einstein's revolution of space and time",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Relativity.JPG",
    summary: "Explore how gravity bends space-time and why nothing outruns light.",
    category: 'Concepts',
  },
  {
    title: "Ada Lovelace",
    subtitle: "The visionary of computing",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Ada_Lovelace_portrait.jpg",
    summary: "Meet the mathematician who envisioned computers more than a century before they existed.",
    category: 'People',
  },
  {
    title: "Nelson Mandela",
    subtitle: "From prisoner to president",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Nelson_Mandela-2008_%28edit%29.jpg",
    summary: "Trace the life of the activist who helped end apartheid and inspire reconciliation.",
    category: 'People',
  },
  {
    title: "Marie Curie",
    subtitle: "Pioneer of radioactivity",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg",
    summary: "Learn about the Nobel laureate whose discoveries transformed physics and medicine.",
    category: 'People',
  },
  {
    title: "Machu Picchu",
    subtitle: "The Incan citadel in the clouds",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
    summary: "Uncover the mysteries of the ancient lost city perched in the Andes.",
    category: 'Places',
  },
  {
    title: "Great Barrier Reef",
    subtitle: "A living marine wonder",
    image: "https://upload.wikimedia.org/wikipedia/commons/8/81/Great_Barrier_Reef.jpg",
    summary: "Discover the vast coral ecosystem visible from space and the threats it faces.",
    category: 'Science & Nature',
  },
  {
    title: "Taj Mahal",
    subtitle: "Love immortalized in marble",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
    summary: "Study the Mughal masterpiece and the story behind its construction.",
    category: 'Places',
  },
  {
    title: "The Renaissance",
    subtitle: "Rebirth of art and ideas",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/09/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg",
    summary: "Follow the cultural movement that bridged the Middle Ages and modernity.",
    category: 'Events',
  },
  {
    title: "Apollo 11",
    subtitle: "The first Moon landing",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Aldrin_Apollo_11.jpg",
    summary: "Relive the mission that placed humans on the Moon and changed our perspective.",
    category: 'Events',
  },
  {
    title: "Human Genome Project",
    subtitle: "Mapping our genetic blueprint",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DNA_Overview.png",
    summary: "Learn how international collaboration decoded human DNA and transformed medicine.",
    category: 'Science & Nature',
  },
];

export const CATEGORIES: EncyclopediaCategory[] = [
  'Concepts',
  'People',
  'Places',
  'Events',
  'Science & Nature',
];
