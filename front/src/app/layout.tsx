import { Geist, Geist_Mono } from "next/font/google";
// import { APP_CONFIG } from "@/config/constants";
import "@/styles/globals.css";
// import { AppProvider } from "@/providers/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata = {
//   title: APP_CONFIG.name,
//   description: APP_CONFIG.description,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <AppProvider>{children}</AppProvider> */}
      </body>
    </html>
  );
}
