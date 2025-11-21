export function onRequest(context) {
  // Do NOT rewrite or block API routes
  return context.next();
}
