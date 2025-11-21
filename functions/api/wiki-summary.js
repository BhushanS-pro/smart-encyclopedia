export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);

  const title = url.searchParams.get("title");
  if (!title) {
    return new Response(JSON.stringify({ error: "Missing title parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Wikipedia requires a real descriptive User-Agent
  const userAgent = "SmartEncyclopediaBot/1.0 (https://smartencyclopedia.uk/contact)";

  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}?redirect=true`;

  const wikiResponse = await fetch(apiUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": userAgent,
    },
  });

  if (!wikiResponse.ok) {
    const text = await wikiResponse.text();
    return new Response(
      JSON.stringify({
        error: `Wikipedia returned ${wikiResponse.status}`,
        body: text.substring(0, 200),
      }),
      {
        status: wikiResponse.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const data = await wikiResponse.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
