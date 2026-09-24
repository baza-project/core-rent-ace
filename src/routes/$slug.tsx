import { createFileRoute } from "@tanstack/react-router";
import { CoreRentApp } from "@/components/core-rent-app";

const serviceNames: Record<string, string> = {
  "gpu-rental": "GPU Rental", "ai-compute": "AI Compute", "secure-vpn": "Secure VPN",
  "fast-proxy": "Fast Proxy", "node-vps": "Node VPS", "high-performance-cpu": "High-Performance CPU",
};
const locationNames: Record<string, string> = { usa: "USA", germany: "Germany", uk: "UK", japan: "Japan", finland: "Finland" };

function getPage(service: string, location: string) {
  const serviceName = serviceNames[service] ?? service.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
  const locationName = locationNames[location] ?? location[0]?.toUpperCase() + location.slice(1);
  const title = `${serviceName} in ${locationName} — CoreRent`;
  const description = `Deploy secure ${serviceName.toLowerCase()} infrastructure in ${locationName} through CoreRent's decentralized compute network.`;
  return { serviceName, locationName, title, description };
}

export const Route = createFileRoute("/$slug")({
  head: ({ params }) => {
    const slug = params.slug.startsWith("rent-") ? params.slug.slice(5) : "gpu-rental-usa";
    const location = Object.keys(locationNames).find((key) => slug.endsWith(`-${key}`)) ?? "usa";
    const service = slug.slice(0, -(location.length + 1));
    const page = getPage(service, location);
    const path = `/rent-${service}-${location}`;
    return {
      meta: [
        { title: page.title }, { name: "description", content: page.description },
        { property: "og:title", content: page.title }, { property: "og:description", content: page.description },
        { property: "og:type", content: "product" }, { property: "og:url", content: path },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: path },
        { rel: "alternate", hrefLang: "en", href: path },
        { rel: "alternate", hrefLang: "de", href: `${path}?lang=de` },
        { rel: "alternate", hrefLang: "ja", href: `${path}?lang=ja` },
        { rel: "alternate", hrefLang: "fi", href: `${path}?lang=fi` },
        { rel: "alternate", hrefLang: "x-default", href: path },
      ],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({
        "@context": "https://schema.org", "@type": "Product", name: "CoreRent DePIN Compute",
        description: page.description, category: page.serviceName,
        offers: { "@type": "AggregateOffer", lowPrice: "0.05", highPrice: "0.85", priceCurrency: "USDC", availability: "https://schema.org/InStock" },
      }) }],
    };
  },
  component: DynamicRentPage,
});

function DynamicRentPage() {
  const { slug: routeSlug } = Route.useParams();
  const slug = routeSlug.startsWith("rent-") ? routeSlug.slice(5) : "gpu-rental-usa";
  const location = Object.keys(locationNames).find((key) => slug.endsWith(`-${key}`)) ?? "usa";
  const service = slug.slice(0, -(location.length + 1));
  const page = getPage(service, location);
  const initialTab = service.includes("gpu") || service.includes("ai") ? "gpu" : service.includes("node") || service.includes("cpu") ? "nodes" : "dashboard";
  return <CoreRentApp initialTab={initialTab} seoTitle={`${page.serviceName}. ${page.locationName}. Zero Friction.`} seoDescription={page.description} />;
}
