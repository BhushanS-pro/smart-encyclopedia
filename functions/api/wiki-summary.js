// Cloudflare Pages Function: proxy Wikipedia summary endpoint
// Path: /.netlify/functions/wiki-summary OR /api/wiki-summary depending on Pages setup
// For Cloudflare Pages, this will be available at '/api/wiki-summary'

export default async function (request) {
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get('title');
    if (!title) {
      return new Response(JSON.stringify({ error: 'Missing title parameter' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;

    const resp = await fetch(wikiUrl, {
      headers: {
        'Accept': 'application/json',
        // Use a common browser UA to avoid unwanted blocks
        'User-Agent': 'Mozilla/5.0 (compatible; SmartEncyclopedia/1.0; +https://smartencyclopedia.uk)'
      }
    });

    const body = await resp.arrayBuffer();

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    // Allow all origins (Pages + local dev). For production consider restricting to your domain.
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

    return new Response(body, { status: resp.status, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
