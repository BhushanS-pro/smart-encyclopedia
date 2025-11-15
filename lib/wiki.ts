import { Platform } from 'react-native';

const WIKI_API_HOST = 'https://en.wikipedia.org/api/rest_v1';
const WIKI_SEARCH_HOST = 'https://en.wikipedia.org/w/rest.php/v1/search/page';

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

export interface WikiSearchResponse {
  pages: WikiSearchItem[];
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

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, '\'')
    .trim();
}

export function cleanExcerpt(excerpt: string): string {
  return stripHtml(excerpt.replace(/\s+/g, ' '));
}

async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'SmartEncyclopedia/1.0 (Educational Encyclopedia App; https://github.com/your-repo)',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function searchEncyclopedia(query: string, limit = 20): Promise<WikiSearchItem[]> {
  if (!query.trim()) {
    return [];
  }

  const parameters = new URLSearchParams({
    q: query.trim(),
    limit: `${limit}`,
  });

  const { pages } = await fetchJson<WikiSearchResponse>(`${WIKI_SEARCH_HOST}?${parameters.toString()}`);

  return pages ?? [];
}

interface MobileSectionNode {
  id: number;
  anchor?: string;
  text?: string;
  heading?: string;
  items?: MobileSectionNode[];
  sections?: MobileSectionNode[];
}

interface MobileSectionsResponse {
  lead: {
    displaytitle: string;
    description?: string;
    text: string;
    image?: { source: string };
  };
  remaining?: MobileSectionNode[];
}

interface SummaryResponse {
  title: string;
  description?: string;
  extract: string;
  extract_html: string;
  content_urls?: {
    desktop?: { page: string };
    mobile?: { page: string };
  };
  originalimage?: { source: string };
  thumbnail?: { source: string };
}

function flattenSections(nodes: MobileSectionNode[] = []): EncyclopediaSection[] {
  const sections: EncyclopediaSection[] = [];

  const traverse = (items: MobileSectionNode[]) => {
    items.forEach((node) => {
      if (node.text) {
        const content = stripHtml(node.text);
        if (content) {
          sections.push({
            id: node.id,
            title: node.heading ?? node.anchor ?? 'Details',
            content,
          });
        }
      }

      if (node.sections && node.sections.length > 0) {
        traverse(node.sections);
      }

      if (node.items && node.items.length > 0) {
        traverse(node.items);
      }
    });
  };

  traverse(nodes);

  return sections;
}

export async function getEncyclopediaEntry(title: string): Promise<EncyclopediaEntry> {
  const encodedTitle = encodeURIComponent(title);

  try {
    const summary = await fetchJson<SummaryResponse>(
      `${WIKI_API_HOST}/page/summary/${encodedTitle}?redirect=true`,
    );

    let mobileSections: MobileSectionsResponse | null = null;

    // Skip mobile-sections on web due to CORS restrictions
    // The summary endpoint works fine, mobile-sections is just for extra detail
    // Note: mobile-sections may return 403 on some articles, but that's okay - we have summary
    if (Platform.OS !== 'web') {
      try {
        mobileSections = await fetchJson<MobileSectionsResponse>(
          `${WIKI_API_HOST}/page/mobile-sections/${encodedTitle}?redirect=true`,
        );
      } catch (error: any) {
        // 403 errors are common for mobile-sections API - Wikipedia has rate limiting/access restrictions
        // This is expected behavior and not a problem - the summary endpoint provides sufficient content
        // Only log if it's not a 403 (which we expect) or in development mode
        if (error?.message?.includes('403')) {
          // Expected - Wikipedia restricts access to mobile-sections for some articles
          // No need to warn, the summary endpoint has all the content we need
        } else {
          console.warn('Failed to load mobile sections for', title, error);
        }
      }
    }

    const leadText =
      summary.extract_html ?? summary.extract ?? mobileSections?.lead.text ?? summary.title;

    const leadSection: EncyclopediaSection = {
      id: 0,
      title: summary.title,
      content: stripHtml(leadText),
    };

    const remainingSections = mobileSections ? flattenSections(mobileSections.remaining ?? []) : [];

    return {
      title: summary.title,
      description: summary.description ?? mobileSections?.lead.description,
      extract: stripHtml(leadText),
      imageUrl: summary.originalimage?.source ?? mobileSections?.lead.image?.source,
      thumbnailUrl: summary.thumbnail?.source,
      sections: [leadSection, ...remainingSections],
      url: summary.content_urls?.desktop?.page ?? summary.content_urls?.mobile?.page,
    };
  } catch (error: any) {
    console.error('Error loading encyclopedia entry:', title, error);
    // Re-throw with more context
    throw new Error(`Failed to load article "${title}": ${error?.message || 'Unknown error'}`);
  }
