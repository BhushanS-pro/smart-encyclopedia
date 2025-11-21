export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // HEALTH CHECK
    if (url.pathname === "/api/health" || url.pathname === "/api/_health") {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: defaultHeaders(),
      });
    }

    // WIKI SUMMARY
    if (url.pathname === "/api/wiki-summary") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsPreflightHeaders(),
        });
      }

      try {
        const title = url.searchParams.get("title");
        if (!title) {
          return new Response(
            JSON.stringify({ error: "Missing title parameter" }),
            {
              status: 400,
              headers: defaultHeaders(),
            }
          );
        }

        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            title
          )}?redirect=true`,
          {
            headers: {
              Accept: "application/json",
              "User-Agent":
                "Mozilla/5.0 (compatible; SmartEncyclopedia/1.0; +https://smartencyclopedia.uk)",
            },
          }
        );

        const bodyText = await wikiResponse.text();

        if (!wikiResponse.ok) {
          return new Response(
            JSON.stringify({
              error: `Wikipedia API returned ${wikiResponse.status}`,
              body: bodyText.slice(0, 200),
            }),
            {
              status: wikiResponse.status,
              headers: defaultHeaders(),
            }
          );
        }

        let json;
        try {
          json = JSON.parse(bodyText);
        } catch (err) {
          return new Response(
            JSON.stringify({
              error: "Failed to parse Wikipedia response as JSON",
              detail: String(err?.message ?? err),
              body: bodyText.slice(0, 200),
            }),
            {
              status: 502,
              headers: defaultHeaders(),
            }
          );
        }

        return new Response(JSON.stringify(json), {
          status: 200,
          headers: defaultHeaders(),
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
          headers: defaultHeaders(),
        });
      }
    }

    // FALLBACK TO STATIC FILES
    return env.ASSETS.fetch(request, ctx);
  },
};

function defaultHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };
}

function corsPreflightHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
  };
}
