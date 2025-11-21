export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Log request info
  console.log("➡️ Request:", {
    path: url.pathname,
    method: context.request.method,
    ip: context.request.headers.get("cf-connecting-ip"),
    ua: context.request.headers.get("user-agent"),
  });

  return await context.next();
}
