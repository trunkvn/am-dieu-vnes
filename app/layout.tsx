import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Patrick_Hand, Playwrite_VN } from "next/font/google";
import "./globals.css";
import { LoadingScreen } from "@/app/_components/LoadingScreen/LoadingScreen";

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

const TITLE = "Âm Điệu — The Six Tones of Vietnamese";
const DESCRIPTION =
  "One syllable, six tones, six different words. A notebook-page tour of Vietnamese tones: listen, draw your voice, say it back.";

/** Where the site lives, so share images get full URLs. Set NEXT_PUBLIC_SITE_URL once it has a domain. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://am-dieu-vnese.vercel.app/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Âm Điệu",
  authors: [{ name: "Gnoud" }],
  creator: "Gnoud",
  category: "education",
  keywords: [
    "Vietnamese tones",
    "Vietnamese pronunciation",
    "learn Vietnamese",
    "thanh điệu",
    "sáu thanh",
    "ma mà má mả mã mạ",
    "Hanoi Vietnamese",
  ],
  openGraph: {
    type: "website",
    siteName: "Âm Điệu",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#d6c49b",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${beVietnam.variable} ${patrick.variable} ${playwrite.variable}`}
    >
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
