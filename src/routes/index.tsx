import { createFileRoute } from "@tanstack/react-router";
import { CoreRentApp } from "@/components/core-rent-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CoreRent — High-Performance DePIN Compute" },
      { name: "description", content: "Deploy isolated GPU and CPU clusters from your Web3 wallet in under 45 seconds." },
      { property: "og:title", content: "CoreRent — High-Performance DePIN Compute" },
      { property: "og:description", content: "Rent secure GPU, node VPS, and high-performance CPU infrastructure with transparent USDC pricing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: CoreRentApp,
});
