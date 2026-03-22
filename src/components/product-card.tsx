"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const image = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!firstVariant) return;

    addItem({
      variantId: firstVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: firstVariant.title,
      price: parseFloat(firstVariant.price.amount),
      quantity: 1,
      image: image?.url || "",
      handle: product.handle,
    });
  }

  return (
    <div className="group">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="aspect-square bg-cream-dark relative overflow-hidden mb-4">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-xs text-ink-muted tracking-widest uppercase">
                {product.title}
              </span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium leading-tight">{product.title}</h3>
          <p className="font-mono text-sm text-ink-light">
            {formatPrice(price.amount, price.currencyCode)}
          </p>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="mt-3 w-full py-2.5 border border-ink text-ink font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-ink hover:text-cream transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
}
