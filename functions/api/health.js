export async function onRequest() {
  return new Response(
    JSON.stringify({ ok: true, status: "healthy", timestamp: Date.now() }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
