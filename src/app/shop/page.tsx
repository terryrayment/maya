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
      <div style={{ textAlign: "center", padding: "5rem 0" }}>
        <p style={{ opacity: 0.5 }}>
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
    <div
      style={{
        paddingTop: "7.071428571428571rem",
        backgroundColor: "var(--ivory)",
        minHeight: "100vh",
        paddingLeft: "var(--side-padding)",
        paddingRight: "var(--side-padding)",
        paddingBottom: "6rem",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <Suspense fallback={null}>
          <CollectionFilter />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div style={{ padding: "5rem 0", textAlign: "center", opacity: 0.3 }}>
            Loading...
          </div>
        }
      >
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
