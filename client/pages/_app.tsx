import Header from "@/components/header";
import "../styles/global.css";
import { AppProps } from "next/app";
import AuthWrapper from "../components/auth-wrapper";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthWrapper>
      <Header />
      <Component {...pageProps} />
    </AuthWrapper>
  );
}
