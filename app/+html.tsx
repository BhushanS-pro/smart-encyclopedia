import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Mobile responsive meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* SEO Meta */}
        <link rel="canonical" href="https://smartencyclopedia.uk" />

        <meta
          name="description"
          content="Smart Encyclopedia: AI-powered knowledge search across science, history, space, technology, biology & more."
        />
        <meta
          name="keywords"
          content="encyclopedia, science facts, space, knowledge, history, biology, technology, learning, AI encyclopedia"
        />

        <meta name="theme-color" content="#ffffff" />

        {/* OG Social Sharing */}
        <meta property="og:title" content="Smart Encyclopedia" />
        <meta
          property="og:description"
          content="Explore facts, history, science, technology, biology and more using AI-powered knowledge search."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smartencyclopedia.uk" />
        <meta property="og:image" content="https://smartencyclopedia.uk/preview.png" />

        {/* Twitter Meta */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smart Encyclopedia" />
        <meta
          name="twitter:description"
          content="A modern AI-powered encyclopedia for fast learning and research."
        />
        <meta name="twitter:image" content="https://smartencyclopedia.uk/preview.png" />

        {/* JSON-LD Structured Organization Schema (Required for Google) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Smart Encyclopedia",
              url: "https://smartencyclopedia.uk",
              logo: "https://smartencyclopedia.uk/icon.png",
              sameAs: [
                "https://www.instagram.com",
                "https://x.com",
                "https://facebook.com"
              ]
            }),
          }}
        />

        {/* Prevent layout flicker */}
        <ScrollViewStyleReset />

        {/* Background scheme (light/dark) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { background-color: #fff; }
              @media (prefers-color-scheme: dark) {
                body { background-color: #000; }
              }
            `,
          }}
        />

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8947922622346274"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body>{children}</body>
    </html>
  );
}
