import type { Metadata } from "next";
import { Be_Vietnam_Pro, Patrick_Hand, Playwrite_VN } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "600", "800"],
});

// Red-pen margin notes.
const patrick = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

// The words themselves, in schoolbook handwriting. Publishes no subsets, so it isn't preloaded.
const playwrite = Playwrite_VN({
  variable: "--font-playwrite",
});

export const metadata: Metadata = {
  title: "ma mà má mả mã mạ — one syllable, six voices",
  description:
    "One syllable, six tones, six different words. A notebook-page tour of Vietnamese tones: listen, draw your voice, say it back.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${beVietnam.variable} ${patrick.variable} ${playwrite.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
