"use client";

import { ProductCard } from "@/components/product-card";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
