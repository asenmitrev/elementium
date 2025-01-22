import Header from "@/components/header";
import "../styles/global.css";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import AuthWrapper from "../components/AuthWrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Header />
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  );
}
