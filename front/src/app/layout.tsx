"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Providers";
import "@/styles/globals.css";
import { CursorsLayer } from "@/components/layout/CursorsLayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <CursorsLayer>{children}</CursorsLayer>
        </Providers>
      </body>
    </html>
  );
}
