import Head from "next/head";
import { Fragment } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="img/favicon.ico" />
        <meta name="description" content="Mar Villarreal official web page" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        ></meta>
        <meta property="og:title" content="Mar Villarreal" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.marvillarreal.com/" />
        <meta
          property="og:image"
          content="https://www.marvillarreal.com/img/photo.jpg"
        />
        <meta
          property="og:description"
          content="Mar Villarreal official web page"
        />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
