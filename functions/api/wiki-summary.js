export async function onRequestGet(ctx) {
  const url = new URL(ctx.request.url);
  const title = url.searchParams.get("title");

  if (!title) {
    return new Response(JSON.stringify({ error: "Missing title" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const apiURL = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;

  // Wikipedia requires a real User-Agent
  const userAgent =
    "SmartEncyclopediaBot/1.0 (https://smartencyclopedia.pages.dev; contact: support@smartencyclopedia.uk)";

  const wikiResponse = await fetch(apiURL, {
    headers: {
      "Accept": "application/json",
      "User-Agent": userAgent
    }
  });

  if (!wikiResponse.ok) {
    const text = await wikiResponse.text();
    return new Response(
      JSON.stringify({
        error: `Wikipedia error: ${wikiResponse.status}`,
        detail: text.slice(0, 200)
      }),
      {
        status: wikiResponse.status,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const json = await wikiResponse.json();

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
