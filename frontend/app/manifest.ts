import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SmartStore Copilot - Franchise Operations Dashboard",
    short_name: "SmartStore",
    description:
      "Real-time franchise operations copilot with AI-powered insights for inventory, drivers, and sentiment analysis",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    categories: ["business", "productivity", "utilities"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "SmartStore Dashboard Overview",
      },
      {
        src: "/screenshot-narrow.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "SmartStore Mobile Dashboard",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View operations dashboard",
        url: "/dashboard",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Inventory",
        short_name: "Inventory",
        description: "Check inventory levels",
        url: "/inventory",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
      {
        name: "AI Chat",
        short_name: "Chat",
        description: "Ask AI assistant",
        url: "/chat",
        icons: [{ src: "/icon-192x192.png", sizes: "192x192" }],
      },
    ],
  }
}
