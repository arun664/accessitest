import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* You can add custom global meta tags, CSS links, fonts, etc. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-gray-100 w-full">
        {/* The Main component renders the page's content */}
        <Main />
        {/* NextScript injects Next.js scripts */}
        <NextScript />
      </body>
    </Html>
  );
}
