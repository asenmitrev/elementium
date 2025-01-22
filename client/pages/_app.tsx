import Head from "next/head";
import Header from "@/components/header";
import "../styles/global.css";
import { AppProps } from "next/app";
import AuthWrapper from "../components/auth-wrapper";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Elementium - Strategic Fantasy Game</title>
        <meta
          name="description"
          content="Join Elementium, a strategic fantasy game where you command heroes and armies with elemental powers. Build your castle, train your heroes, and conquer the realm."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elementium.game/" />
        <meta
          property="og:title"
          content="Elementium - Strategic Fantasy Game"
        />
        <meta
          property="og:description"
          content="Join Elementium, a strategic fantasy game where you command heroes and armies with elemental powers."
        />
        <meta property="og:image" content="/images/elementium-og.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://elementium.game/" />
        <meta
          property="twitter:title"
          content="Elementium - Strategic Fantasy Game"
        />
        <meta
          property="twitter:description"
          content="Join Elementium, a strategic fantasy game where you command heroes and armies with elemental powers."
        />
        <meta property="twitter:image" content="/images/elementium-og.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Additional SEO */}
        <meta
          name="keywords"
          content="elementium, fantasy game, strategy game, elemental powers, online game"
        />
        <meta name="author" content="Elementium Game" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={true}
        themes={["light", "dark", "system"]}
      >
        <AuthWrapper>
          <Header />
          <Component {...pageProps} />
        </AuthWrapper>
      </ThemeProvider>
    </>
  );
}
