import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <ScrollViewStyleReset />

        <style
          dangerouslySetInnerHTML={{ __html: responsiveBackground }}
        />

        {/* Google AdSense (YOUR REAL PUBLISHER ID) */}
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

const responsiveBackground = `
body { background-color: #fff; }
@media (prefers-color-scheme: dark) {
  body { background-color: #000; }
}`;
