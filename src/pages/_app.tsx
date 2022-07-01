import { AppProps } from "next/app";
import { Header } from "../components/Header";
import "../styles/global.scss";

import { SessionProvider as NextAuthProvider } from "next-auth/react";

import { PrismicProvider } from "@prismicio/react";
import { getPrismicClient } from "../services/prismic";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider client={getPrismicClient()}>
      <NextAuthProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </NextAuthProvider>
    </PrismicProvider>
  );
}

export default MyApp;
