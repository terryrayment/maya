"use client";

import { ProductCard } from "@/components/product-card";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  return (
    <div className="collection-products">
      <div className="collection-products-inner">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <style jsx>{`
        .collection-products {
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        .collection-products-inner {
          --column-gap: 1.4285714285714286rem;
          --row-gap: 1.4285714285714286rem;
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          gap: var(--row-gap) var(--column-gap);
        }
        @media (min-width: 1024px) {
          .collection-products-inner {
            --column-gap: 2.5rem;
            --row-gap: 0.714rem;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
