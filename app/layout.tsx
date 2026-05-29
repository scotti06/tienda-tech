import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Techstylebv — Accesorios para celulares",
  description:
    "Cargadores originales Apple, fundas, vidrios templados y AirPods para iPhone. Consultá modelos y disponibilidad en Techstylebv.",
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[var(--void)] font-sans text-[var(--foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
