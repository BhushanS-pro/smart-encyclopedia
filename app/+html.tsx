import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Required First */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Mobile Viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://smartencyclopedia.uk" />

        {/* SEO Meta */}
        <meta
          name="description"
          content="Smart Encyclopedia: Explore original, high-quality knowledge across science, space, technology, history & more."
        />
        <meta
          name="keywords"
          content="encyclopedia, learning, facts, articles, science, space, technology, biology, history"
        />
        <meta name="author" content="Smart Encyclopedia" />
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph (Social Preview) */}
        <meta property="og:title" content="Smart Encyclopedia" />
        <meta
          property="og:description"
          content="A modern encyclopedia with high-quality original articles."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smartencyclopedia.uk" />
        <meta
          property="og:image"
          content="https://smartencyclopedia.uk/preview.png"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Smart Encyclopedia" />
        <meta
          name="twitter:description"
          content="Explore factual, researched and human-written articles."
        />
        <meta name="twitter:image" content="https://smartencyclopedia.uk/preview.png" />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Smart Encyclopedia",
              legalName: "Smart Encyclopedia",
              url: "https://smartencyclopedia.uk",
              logo: "https://smartencyclopedia.uk/icon.png",
              sameAs: [
                "https://instagram.com/smartencyclopedia",
                "https://x.com/smartencyclopedia",
                "https://facebook.com/smartencyclopedia",
              ],
            }),
          }}
        />

        {/* Prevent layout scroll jump */}
        <ScrollViewStyleReset />

        {/* System Theme Support */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              body { background-color: #ffffff; margin: 0; }
              @media (prefers-color-scheme: dark) {
                body { background-color: #000000; }
              }
            `,
          }}
        />

        {/* Google AdSense */}
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
