// utils/imageMap.ts
import type { ImageSourcePropType } from "react-native";

// ✅ ONE real placeholder that definitely exists
const placeholder = require("../assets/images/placeholder.png");

export type ImageVariant = "hero" | "featured" | "thumbnail";

type VariantMap = {
  hero: ImageSourcePropType;
  featured: ImageSourcePropType;
  thumbnail: ImageSourcePropType;
};

// 🆕 Updated Black Holes section – now using actual image files
export const imageMap: Record<string, VariantMap> = {
  "science-of-sleep": {
    hero: require("../assets/images/topics/science-of-sleep/hero.png"),
    featured: require("../assets/images/topics/science-of-sleep/featured.png"),
    thumbnail: require("../assets/images/topics/science-of-sleep/thumbnail.png"),
  },

  "black-holes-explained": {
    hero: require("../assets/images/topics/black-holes-explained/hero.png"),
    featured: require("../assets/images/topics/black-holes-explained/featured.png"),
    thumbnail: require("../assets/images/topics/black-holes-explained/thumbnail.png"),
  },

  "ai-in-everyday-life": {
       hero: require("../assets/images/topics/ai-in-everyday-life/hero.png"),
    featured: require("../assets/images/topics/ai-in-everyday-life/featured.png"),
    thumbnail: require("../assets/images/topics/ai-in-everyday-life/thumbnail.png"),
  },

  "climate-change-basics": {
    hero: require("../assets/images/topics/climate-change-basics/hero.png"),
    featured: require("../assets/images/topics/climate-change-basics/featured.png"),
    thumbnail: require("../assets/images/topics/climate-change-basics/thumbnail.png"),
  },

  "solar-system-guide": {
    hero: require("../assets/images/topics/solar-system-guide/hero.png"),
    featured: require("../assets/images/topics/solar-system-guide/featured.png"),
    thumbnail: require("../assets/images/topics/solar-system-guide/thumbnail.png"),
  },

  "dna-and-genetics-basics": {
    hero: require("../assets/images/topics/dna-and-genetics-basics/hero.png"),
    featured: require("../assets/images/topics/dna-and-genetics-basics/featured.png"),
    thumbnail: require("../assets/images/topics/dna-and-genetics-basics/thumbnail.png"),
  },

  "how-the-internet-works": {
    hero: require("../assets/images/topics/how-the-internet-works/hero.png"),
    featured: require("../assets/images/topics/how-the-internet-works/featured.png"),
    thumbnail: require("../assets/images/topics/how-the-internet-works/thumbnail.png"),
  },

  "world-war-2-overview": {
     hero: require("../assets/images/topics/world-war-2-overview/hero.png"),
    featured: require("../assets/images/topics/world-war-2-overview/featured.png"),
    thumbnail: require("../assets/images/topics/world-war-2-overview/thumbnail.png"),
  },

  "renewable-energy-technologies": {
    hero: require("../assets/images/topics/renewable-energy-technologies/hero.png"),
    featured: require("../assets/images/topics/renewable-energy-technologies/featured.png"),
    thumbnail: require("../assets/images/topics/renewable-energy-technologies/thumbnail.png"),
  },

  "photosynthesis-explained": {
    hero: require("../assets/images/topics/photosynthesis-explained/hero.png"),
    featured: require("../assets/images/topics/photosynthesis-explained/featured.png"),
    thumbnail: require("../assets/images/topics/photosynthesis-explained/thumbnail.png"),
  },

   "albert-einstein": {
    hero: require("../assets/images/topics/albert-einstein/hero.png"),
    featured: require("../assets/images/topics/albert-einstein/featured.png"),
    thumbnail: require("../assets/images/topics/albert-einstein/thumbnail.png"),
  },
  
   "marie-curie": {
    hero: require("../assets/images/topics/marie-curie/hero.png"),
    featured: require("../assets/images/topics/marie-curie/featured.png"),
    thumbnail: require("../assets/images/topics/marie-curie/thumbnail.png"),
  },

  "nikola-tesla": {
    hero: require("../assets/images/topics/nikola-tesla/hero.png"),
    featured: require("../assets/images/topics/nikola-tesla/featured.png"),
    thumbnail: require("../assets/images/topics/nikola-tesla/thumbnail.png"),
  },

   "great-wall-of-china": {
    hero: require("../assets/images/topics/great-wall-of-china/hero.png"),
    featured: require("../assets/images/topics/great-wall-of-china/featured.png"),
    thumbnail: require("../assets/images/topics/great-wall-of-china/thumbnail.png"),
  },

  "taj-mahal": {
    hero: require("../assets/images/topics/taj-mahal/hero.png"),
    featured: require("../assets/images/topics/taj-mahal/featured.png"),
    thumbnail: require("../assets/images/topics/taj-mahal/thumbnail.png"),
  },

  "apollo-11-moon-landing": {
    hero: require("../assets/images/topics/apollo-11-moon-landing/hero.png"),
    featured: require("../assets/images/topics/apollo-11-moon-landing/featured.png"),
    thumbnail: require("../assets/images/topics/apollo-11-moon-landing/thumbnail.png"),
  },

  "discovery-of-penicillin": {
    hero: require("../assets/images/topics/discovery-of-penicillin/hero.png"),
    featured: require("../assets/images/topics/discovery-of-penicillin/featured.png"),
    thumbnail: require("../assets/images/topics/discovery-of-penicillin/thumbnail.png"),
  },


};

// ⬇ Final fallback logic stays unchanged
export function getImage(slug: string, variant: ImageVariant): ImageSourcePropType {
  const entry = imageMap[slug];
  if (entry && entry[variant]) {
    return entry[variant];
  }
  return placeholder;
}
