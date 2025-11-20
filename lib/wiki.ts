import { Platform } from 'react-native';

const WIKI_API_HOST = 'https://en.wikipedia.org/api/rest_v1';
const WIKI_SEARCH_HOST = 'https://en.wikipedia.org/w/rest.php/v1/search/page';
const DEFAULT_WIKI_PROXY_PATH = '/api/wiki-summary';
const DEFAULT_API_BASE =
  typeof process !== 'undefined'
    ? process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? ''
    : '';
const DEFAULT_PROXY_ENDPOINT =
  typeof process !== 'undefined' && process.env.EXPO_PUBLIC_WIKI_SUMMARY_PATH
    ? process.env.EXPO_PUBLIC_WIKI_SUMMARY_PATH
    : DEFAULT_WIKI_PROXY_PATH;

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
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Request failed with status ${response.status}${text ? ` — ${text.slice(0,200)}` : ''}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    // Provide a helpful error if the server returned HTML (common when a route is rewritten)
    const text = await response.text().catch(() => '');
    throw new Error(`Expected JSON response but received content-type="${contentType}" body="${String(text).slice(0,200)}"`);
  }

  return response.json() as Promise<T>;
}

function isProbablyLocalhost(hostname?: string): boolean {
  if (!hostname) {
    return true;
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }

  if (hostname.endsWith('.local')) {
    return true;
  }

  if (/^10\./.test(hostname) || /^192\.168\./.test(hostname) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) {
    return true;
  }

  return false;
}

function shouldUseWikiProxy(): boolean {
  if (Platform.OS !== 'web') {
    return false;
  }

  const locationObject =
    typeof globalThis !== 'undefined' && 'location' in globalThis
      ? (globalThis as { location?: { hostname?: string } }).location
      : undefined;

  const host = locationObject?.hostname;
  return !isProbablyLocalhost(host);
}

function buildProxyUrl(encodedTitle: string): string {
  const proxyBase = DEFAULT_API_BASE || '';
  const proxyPath = DEFAULT_PROXY_ENDPOINT.startsWith('http')
    ? DEFAULT_PROXY_ENDPOINT
    : `${proxyBase}${DEFAULT_PROXY_ENDPOINT}`;
  return `${proxyPath}?title=${encodedTitle}`;
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
  const summaryUrl = `${WIKI_API_HOST}/page/summary/${encodedTitle}?redirect=true`;
  const useProxy = shouldUseWikiProxy();
  const attempts: string[] = [];

  const tryFetchSummary = async (url: string, label: string): Promise<SummaryResponse | null> => {
    try {
      return await fetchJson<SummaryResponse>(url);
    } catch (err: any) {
      const message = err instanceof Error ? err.message : String(err);
      attempts.push(`${label} failed: ${message}`);
      return null;
    }
  };

  let summary: SummaryResponse | null = null;

  if (useProxy) {
    summary = await tryFetchSummary(buildProxyUrl(encodedTitle), 'proxy');
  }

  if (!summary) {
    summary = await tryFetchSummary(summaryUrl, 'direct');
  }

  if (!summary) {
    const detail = attempts.join(' | ') || 'Unknown error';
    throw new Error(`Failed to load article "${title}": ${detail}`);
  }

  let mobileSections: MobileSectionsResponse | null = null;

  // Skip mobile-sections on web due to CORS restrictions
  if (Platform.OS !== 'web') {
    try {
      mobileSections = await fetchJson<MobileSectionsResponse>(
        `${WIKI_API_HOST}/page/mobile-sections/${encodedTitle}?redirect=true`,
      );
    } catch (error: any) {
      console.warn('Failed to load mobile sections for', title, '—continuing with summary only');
      // It's okay if this fails, we have the summary
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
}
