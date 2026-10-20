import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Syne } from "next/font/google";
import Boot from "@/components/Boot";
import Console from "@/components/Console";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import Starfield from "@/components/Starfield";
import { profile } from "@/lib/data";
import "./globals.css";

const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-syne" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const plex = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono" });

const title = `${profile.name} · ${profile.role}`;
const description =
  "Reenav Hemaria designs and builds production systems: data models, Kafka event pipelines, PostgreSQL/Redis architecture, search infrastructure and deployment. Stooky, Juugo and JamJam.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Reenav Hemaria", "Backend Engineer", "NestJS", "PostgreSQL", "Kafka", "Redis", "System Design", "Search", "Weaviate", "Full Stack"],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#04050c" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${plex.variable}`}>
      <body>
        <SmoothScroll />
        <Starfield />
        <Boot />
        <Cursor />
        <Console />
        {children}
      </body>
    </html>
  );
}
