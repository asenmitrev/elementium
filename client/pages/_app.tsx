import Header from "@/components/header";
import "../styles/global.css";
import { AppProps } from "next/app";
import AuthWrapper from "../components/auth-wrapper";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthWrapper>
        <Header />
        <Component {...pageProps} />
      </AuthWrapper>
    </ThemeProvider>
  );
}
