import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nouka Baich — Rhythm Boat Racing",
  description:
    "Strike the water on the beat, chain PERFECT combos, and out-row your rival in this rhythm-based boat racing game.",
  applicationName: "Nouka Baich",
  keywords: [
    "rhythm game",
    "boat racing",
    "nouka baich",
    "music game",
    "bangladesh",
    "browser game",
  ],
  authors: [{ name: "Shyhoon" }],
  openGraph: {
    title: "Nouka Baich — Rhythm Boat Racing",
    description:
      "Strike the water on the beat, chain PERFECT combos, and out-row your rival in this rhythm-based boat racing game.",
    type: "website",
    siteName: "Nouka Baich",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nouka Baich — Rhythm Boat Racing",
    description: "A rhythm-based boat racing game. Row on the beat, win the race.",
  },
  appleWebApp: {
    capable: true,
    title: "Nouka Baich",
    statusBarStyle: "black-translucent",
  },
};


export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#05070f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
