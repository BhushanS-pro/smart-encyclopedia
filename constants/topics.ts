/** -----------------------------------------------------
 *   CATEGORY SYSTEM (final clean version)
 * -----------------------------------------------------*/

export const CATEGORIES = [
  "Science",
  "History",
  "Technology",
  "Space",
  "Biology",
  "People",
  "Places",
  "Events"
] as const;

export type EncyclopediaCategory = typeof CATEGORIES[number];

/** -----------------------------------------------------
 *   FEATURED HOME CONTENT (local content only)
 *   → This will later be dynamically replaced
 *     using curated article metadata.
 * -----------------------------------------------------*/

export interface CuratedTopic {
  title: string;
  subtitle: string;
  image: string;   // Must match /public/images path or CDN path
  summary: string;
  category: EncyclopediaCategory;
}

/** -----------------------------------------------------
 *   Placeholder content (will be replaced with article data)
 * -----------------------------------------------------*/

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    title: "Black Holes Explained",
    subtitle: "Mystery of Space-Time Collapse",
    image: "/images/black-holes-thumb.jpg", 
    summary:
      "Black holes form when massive stars collapse, creating intense gravity that bends space and time.",
    category: "Space",
  },
  {
    title: "DNA & Genetics",
    subtitle: "The Blueprint of Life",
    image: "/images/dna-genetics-thumb.jpg",
    summary:
      "Genetics explains how organisms inherit traits and how DNA provides the foundation for life.",
    category: "Biology",
  },
  {
    title: "Marie Curie",
    subtitle: "Pioneer of Radioactivity",
    image: "/images/marie-curie.jpg",
    summary:
      "Marie Curie's discoveries changed science and medicine, influencing modern radiation therapy.",
    category: "People",
  },
  {
    title: "The Renaissance",
    subtitle: "Rebirth of Knowledge",
    image: "/images/renaissance-thumb.jpg",
    summary:
      "A revolutionary cultural movement that reshaped art, science, philosophy, and human progress.",
    category: "History",
  },
  {
    title: "Artificial Intelligence",
    subtitle: "Technology Shaping Tomorrow",
    image: "/images/ai-everyday-life-thumb.jpg",
    summary:
      "From phones to cities, AI powers decision-making systems and automates complex real-world tasks.",
    category: "Technology",
  }
];
