import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/index.css";

export default function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
