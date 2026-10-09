import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ma mà má mả mã mạ — one syllable, six voices",
    short_name: "Vở tập nói",
    description:
      "One syllable, six tones, six different words. A notebook-page tour of Vietnamese tones: listen, draw your voice, say it back.",
    start_url: "/",
    display: "standalone",
    background_color: "#d6c49b",
    theme_color: "#35299a",
    lang: "en",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
