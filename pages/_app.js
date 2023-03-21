import "../styles/global.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <main>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro"
          rel="stylesheet"
          key="google-font-source-sans-pro"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Alegreya"
          rel="stylesheet"
          key="google-font-alegreya"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Signika+Negative"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
          integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
          crossorigin="anonymous"
        ></link>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossorigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
          integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
          crossorigin=""
        ></script>
      </Head>
      <Component {...pageProps} />
    </main>
  );
}
