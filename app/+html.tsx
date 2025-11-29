import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Required */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://smartencyclopedia.uk" />

        {/* Favicon + Web App Icons */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#0f172a" />

        {/* SEO Meta */}
        <meta name="description" content="Smart Encyclopedia: Simple, accurate learning across science, history, space, technology and biology." />
        <meta name="keywords" content="encyclopedia, learning, facts, articles, science, space, technology, biology, history, knowledge" />
        <meta name="author" content="Smart Encyclopedia Team" />

        {/* Open Graph */}
        <meta property="og:title" content="Smart Encyclopedia" />
        <meta property="og:description" content="Learn from beginner-friendly and accurate educational articles across many topics." />
        <meta property="og:url" content="https://smartencyclopedia.uk" />
        <meta property="og:image" content="/favicon.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Smart Encyclopedia" />
        <meta name="twitter:description" content="Trusted educational knowledge: science, space, technology, biology & history." />
        <meta name="twitter:image" content="/favicon.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Smart Encyclopedia",
              url: "https://smartencyclopedia.uk",
              logo: "https://smartencyclopedia.uk/favicon.png",
              sameAs: []
            }),
          }}
        />

        {/* Reset Scroll Jumps */}
        <ScrollViewStyleReset />

        {/* Theme Style */}
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

        {/* Google AdSense Auto Ads */}
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
