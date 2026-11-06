export default function manifest() {
  return {
    name: "Nouka Baich — Rhythm Boat Racing",
    short_name: "Nouka Baich",
    description:
      "Strike the water on the beat, chain PERFECT combos, and out-row your rival in this rhythm-based boat racing game.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#05070f",
    theme_color: "#05070f",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
