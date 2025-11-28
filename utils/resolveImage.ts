import { imageMap } from "./imageMap";

export function resolveImage(slug: string, type: "hero" | "featured" | "thumbnail") {
  if (imageMap[slug] && imageMap[slug][type]) {
    return imageMap[slug][type];
  }

  console.warn(`⚠️ Missing image for: ${slug} → (${type})`);
  return null;
}
