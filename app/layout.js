import Script from "next/script";
import "./global.css";
import {
  alegreya_sans,
  signika_neg,
  inter
} from "../styles/fonts";
import styles from "./layout.module.css";
import Navbar from "./navbar.js";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "College Quizbowl Stats",
  description: "Welcome to College Quizbowl Stats",
  icon: '/favicon.ico'
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html
      className={`${signika_neg.variable} ${alegreya_sans.variable} ${inter.variable}`}
      lang="en"
    >
      <SpeedInsights />
      <body data-bs-spy="scroll" data-bs-target="#toc">
        <div className={styles.container}>
          <header className={styles.header}>
            <Navbar />
          </header>
          <main>{children}</main>
        </div>
      </body>
      <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" />
      <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    </html>
  );
}
