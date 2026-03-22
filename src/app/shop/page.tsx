import { Suspense } from "react";
import {
  getAllProducts,
  getCollectionByHandle,
  type ShopifyProduct,
} from "@/lib/shopify";
import { ProductGrid } from "@/components/product-grid";
import { CollectionFilter } from "@/components/collection-filter";

export const revalidate = 3600;

export const metadata = {
  title: "Shop — MAYA",
  description: "Shop all MAYA products. Supplements, care, apparel, and more for your dog.",
};

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const params = await searchParams;
  const collectionHandle = params.collection;

  let products: ShopifyProduct[];

  if (collectionHandle) {
    const collection = await getCollectionByHandle(collectionHandle);
    products = collection?.products.edges.map((e) => e.node) || [];
  } else {
    products = await getAllProducts();
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-ink-muted font-mono text-sm">
          No products found in this collection.
        </p>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  return (
    <div className="px-6 lg:px-12 py-12 lg:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 lg:mb-14">
          <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-2">
            Shop
          </h1>
          <p className="text-ink-muted text-sm">
            Everything your dog needs, nothing they don&apos;t.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10">
          <Suspense fallback={null}>
            <CollectionFilter />
          </Suspense>
        </div>

        {/* Products */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-cream-dark mb-4" />
                  <div className="h-4 bg-cream-dark w-3/4 mb-2" />
                  <div className="h-3 bg-cream-dark w-1/4" />
                </div>
              ))}
            </div>
          }
        >
          <ShopContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
