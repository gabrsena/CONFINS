import type { Metadata } from "next";
import { Anton, Playfair_Display, IBM_Plex_Mono, Imperial_Script } from "next/font/google";
import AmbientAudioPlayer from "@/components/AmbientAudioPlayer";
import "./globals.css";

const anton = Anton({
  variable: "--font-next-anton",
  subsets: ["latin"],
  weight: "400",
});

const playfair = Playfair_Display({
  variable: "--font-next-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const script = Imperial_Script({
  variable: "--font-next-script",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-next-mono",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Confins — A Missão em Tempo Real",
  description: "Veja onde os missionários estão. Leia o que estão vivendo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${playfair.variable} ${plexMono.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full font-serif bg-paper text-ink selection:bg-rust selection:text-paper bg-topo-grid bg-[length:48px_48px] bg-fixed">
        {children}
        <AmbientAudioPlayer />
      </body>
    </html>
  );
}
