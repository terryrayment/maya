import { getAllProducts } from "@/lib/shopify";
import { ThankYouClient } from "@/components/thank-you-client";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Thank you — MAYA",
  description: "Your MAYA order is confirmed.",
};

/**
 * Post-purchase thank-you page with one-click upsell.
 *
 * This page is linked from:
 *  - Shopify Additional Scripts (Order Status page redirect)
 *  - Direct checkout.order.thank_you callback
 *
 * Query params we care about:
 *  - order_id (optional): display order reference
 *  - purchased: comma-separated product handles they just bought (used to
 *    exclude those products from the upsell)
 */
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; purchased?: string }>;
}) {
  const params = await searchParams;
  const products = await getAllProducts();

  const supplements = products.filter(
    (p) =>
      p.productType?.toLowerCase().includes("supplement") ||
      p.title.toLowerCase().includes("supplement") ||
      p.tags?.some((t) => t.toLowerCase().includes("supplement")) ||
      p.tags?.some((t) => t.toLowerCase().includes("wellness"))
  );

  // Exclude anything already purchased
  const purchasedHandles = (params.purchased || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  const upsellPool = supplements.filter(
    (p) => !purchasedHandles.includes(p.handle.toLowerCase())
  );

  // Rank: skin & coat first (highest attach rate), then digestive, then joint, then allergy
  const priorityOrder = ["skin", "coat", "digestive", "joint", "allergy"];
  const ranked = [...upsellPool].sort((a, b) => {
    const ai = priorityOrder.findIndex(
      (k) => a.handle.includes(k) || a.title.toLowerCase().includes(k)
    );
    const bi = priorityOrder.findIndex(
      (k) => b.handle.includes(k) || b.title.toLowerCase().includes(k)
    );
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const primaryUpsell = ranked[0];
  const alsoConsider = ranked.slice(1, 3);

  const simplify = (p: (typeof products)[0]) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    price: p.priceRange?.minVariantPrice?.amount || "0",
    currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "USD",
    image: p.images.edges[0]?.node?.url || "",
    variantId: p.variants?.edges[0]?.node?.id || "",
  });

  return (
    <ThankYouClient
      orderId={params.order_id}
      primaryUpsell={primaryUpsell ? simplify(primaryUpsell) : null}
      alsoConsider={alsoConsider.map(simplify)}
    />
  );
}
