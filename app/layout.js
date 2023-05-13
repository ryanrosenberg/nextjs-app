import { Metadata } from "next";
import Script from "next/script";
import "./global.css";
import {
  alegreya_sans,
  signika_neg,
  inter,
  sourceCodePro400,
} from "../styles/fonts";

export const metadata = {
  title: "College Quizbowl Stats",
  description: "Welcome to College Quizbowl Stats",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html
      className={`${signika_neg.variable} ${alegreya_sans.variable} ${inter.variable} ${sourceCodePro400.variable}`}
      lang="en"
    >
      <body data-bs-spy="scroll" data-bs-target="#toc">
        {children}
      </body>
      <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js" />
      <Script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
    </html>
  );
}
