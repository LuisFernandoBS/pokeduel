import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { HistoricoDuelContext } from "../context/HistoricoDuelContext";
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
  title: "PokeDuel",
  description: "Projeto PokeDuel",
  icons: {
    icon: "/icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  let historicoDuel:any = [];

  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HistoricoDuelContext lista={historicoDuel}>
          {children}
        </HistoricoDuelContext>
      </body>
    </html>
  );
}
