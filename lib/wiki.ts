// lib/wiki.ts — Local Content Mode (No External API Calls)

import articles from "@/content/articles.json";

// ---------------------- TYPES (unchanged so UI works) ---------------------- //

export interface WikiThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface WikiSearchItem {
  id: number;
  key: string;
  title: string;
  excerpt: string;
  description?: string;
  thumbnail?: WikiThumbnail;
}

export interface EncyclopediaSection {
  id: number;
  title: string;
  content: string;
}

export interface EncyclopediaEntry {
  title: string;
  description?: string;
  extract: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sections: EncyclopediaSection[];
  url?: string;
}

// ---------------------- HELPERS ---------------------- //

function normalize(text?: string): string {
  return text?.toLowerCase().trim() ?? "";
}

function safeExcerpt(text: string, limit = 150): string {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

// ---------------------- SEARCH ENGINE ---------------------- //

export async function searchEncyclopedia(
  query: string,
  limit = 20
): Promise<WikiSearchItem[]> {

  if (!query.trim()) return [];

  const q = normalize(query);

  const results = articles
    .filter((a: any) =>
      normalize(a.title).includes(q) ||
      normalize(a.description).includes(q) ||
      normalize(a.category).includes(q)
    )
    .slice(0, limit)
    .map((article: any, index: number): WikiSearchItem => ({
      id: index,
      key: article.slug || normalize(article.title),
      title: article.title,
      excerpt: article.description || safeExcerpt(article.extract),
      description: article.description,
      thumbnail: article.imageUrl ? { url: article.imageUrl } : undefined,
    }));

  return results;
}

// ---------------------- ARTICLE LOADER ---------------------- //

export async function getEncyclopediaEntry(
  title: string
): Promise<EncyclopediaEntry> {

  const match = articles.find(
    (a: any) => normalize(a.title) === normalize(title)
  );

  if (!match) {
    throw new Error(`❌ Article "${title}" not found in local database.`);
  }

  return {
    title: match.title,
    description: match.description,
    extract: match.extract,
    imageUrl: match.imageUrl,
    thumbnailUrl: match.thumbnailUrl,
    sections: match.sections || [],
    url: `https://smartencyclopedia.uk/article/${match.slug || normalize(match.title)}`,
  };
}
