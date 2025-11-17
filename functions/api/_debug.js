export default async function (request) {
  try {
    const headersObj = {};
    for (const [key, value] of request.headers) {
      headersObj[key] = value;
    }

    const body = {
      ok: true,
      now: new Date().toISOString(),
      url: request.url,
      headers: headersObj,
      note: 'This is a debug function to verify Pages Functions are running.',
    };

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(JSON.stringify(body), { status: 200, headers });
  } catch (err) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers });
  }
}

export const handler = async function (event) {
  try {
    const headersObj = event?.headers || {};
    const body = {
      ok: true,
      now: new Date().toISOString(),
      headers: headersObj,
      note: 'Netlify-style handler debug endpoint',
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(body),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: false, error: String(err) }),
    };
  }
};
