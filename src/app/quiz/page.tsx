import { getAllProducts } from "@/lib/shopify";
import { QuizClient } from "@/components/quiz-client";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Find Your Dog's Formula — MAYA",
  description:
    "Answer 5 quick questions and we'll recommend the MAYA supplements best suited to your dog.",
};

export default async function QuizPage() {
  const products = await getAllProducts();

  // Only pass supplements to the quiz
  const supplements = products.filter(
    (p) =>
      p.productType?.toLowerCase().includes("supplement") ||
      p.title.toLowerCase().includes("supplement") ||
      p.tags?.some((t) => t.toLowerCase().includes("supplement")) ||
      p.tags?.some((t) => t.toLowerCase().includes("wellness"))
  );

  // Find bundle if present
  const bundle = products.find(
    (p) =>
      p.handle.includes("bundle") ||
      p.handle.includes("stack") ||
      p.title.toLowerCase().includes("bundle") ||
      p.title.toLowerCase().includes("stack")
  );

  // Simplify to plain objects for client component
  const quizProducts = supplements.map((p) => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    price: p.priceRange?.minVariantPrice?.amount || "0",
    currencyCode: p.priceRange?.minVariantPrice?.currencyCode || "USD",
    image: p.images.edges[0]?.node?.url || "",
    variantId: p.variants?.edges[0]?.node?.id || "",
    tags: p.tags || [],
  }));

  const bundleProduct = bundle
    ? {
        id: bundle.id,
        handle: bundle.handle,
        title: bundle.title,
        price: bundle.priceRange?.minVariantPrice?.amount || "0",
        currencyCode: bundle.priceRange?.minVariantPrice?.currencyCode || "USD",
        image: bundle.images.edges[0]?.node?.url || "",
        variantId: bundle.variants?.edges[0]?.node?.id || "",
      }
    : null;

  return <QuizClient products={quizProducts} bundle={bundleProduct} />;
}
