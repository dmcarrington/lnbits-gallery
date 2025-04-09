import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="LNBits Gallery"
          />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta
            property="og:description"
            content="LNBits Gallery"
          />
          <meta property="og:title" content="LNBits Gallery" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="LNBits Gallery" />
          <meta
            name="twitter:description"
            content="LNBits Gallery"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
