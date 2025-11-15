// Cloudflare Pages Function: proxy Wikipedia summary endpoint
// Path: /.netlify/functions/wiki-summary OR /api/wiki-summary depending on Pages setup
// For Cloudflare Pages, this will be available at '/api/wiki-summary'

async function fetchWikiSummary(title) {
  const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;

  const resp = await fetch(wikiUrl, {
    headers: {
      'Accept': 'application/json',
      // Use a common browser UA to avoid unwanted blocks
      'User-Agent': 'Mozilla/5.0 (compatible; SmartEncyclopedia/1.0; +https://smartencyclopedia.uk)'
    }
  });

  const json = await resp.json();
  return { status: resp.status, body: json };
}

// Cloudflare Pages / Functions (Request -> Response)
export default async function (request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname || url.pathname || '';

    // Handle health check quickly
    if (pathname.endsWith('/api/_health') || pathname.endsWith('/api/health')) {
      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // Preflight
    if (request.method === 'OPTIONS') {
      const headers = new Headers();
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      headers.set('Access-Control-Allow-Headers', 'Content-Type');
      return new Response(null, { status: 204, headers });
    }

    const title = url.searchParams.get('title');
    if (!title) {
      return new Response(JSON.stringify({ error: 'Missing title parameter' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    const { status, body } = await fetchWikiSummary(title);

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    // Allow all origins (Pages + local dev). For production consider restricting to your domain.
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

    return new Response(JSON.stringify(body), { status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}

// Netlify Functions compatibility: export `handler(event, context)` which Netlify expects.
export const handler = async function (event) {
  try {
    const title = (event?.queryStringParameters && event.queryStringParameters.title) || (event?.query && event.query.title);
    if (!title) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing title parameter' }),
      };
    }

    const { status, body } = await fetchWikiSummary(title);

    return {
      statusCode: status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(body),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
