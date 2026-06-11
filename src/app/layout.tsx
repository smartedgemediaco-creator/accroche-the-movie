import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ACCROCHE — Laocoe Productions",
  description: "Experience the vision. A curated cinematic showcase.",
  openGraph: {
    title: "ACCROCHE — Laocoe Productions",
    description: "Experience the vision. A curated cinematic showcase.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-[#050505] text-[#fafafa] font-sans">
        <div className="film-grain" />
        {children}
      </body>
    </html>
  );
}
