import { notFound } from "next/navigation";
import { getProductByHandle, getAllProducts } from "@/lib/shopify";
import { ProductDetail } from "@/components/product-detail";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product Not Found — MAYA" };
  }

  return {
    title: `${product.title} — MAYA`,
    description:
      product.description?.slice(0, 160) ||
      `${product.title} from MAYA. Premium dog wellness.`,
    openGraph: {
      title: `${product.title} — MAYA`,
      description: product.description?.slice(0, 160),
      images: product.images.edges[0]?.node
        ? [{ url: product.images.edges[0].node.url }]
        : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
