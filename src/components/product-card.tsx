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
    <div className="collection-product">
      <Link href={`/products/${product.handle}`} className="collection-product-link">
        <div className="collection-product-image">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="collection-product-img"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="collection-product-placeholder">
              <span>{product.title}</span>
            </div>
          )}
        </div>
        <div className="collection-product-data">
          <div className="collection-product-title">{product.title}</div>
          <div className="collection-product-price">
            {formatPrice(price.amount, price.currencyCode)}
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="button collection-product-add"
      >
        Add to Cart
        <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
          <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
        </svg>
      </button>

      <style jsx>{`
        .collection-product {
          width: calc((100% - var(--column-gap, 1.4285714285714286rem)) / 2);
          position: relative;
        }
        @media (min-width: 768px) {
          .collection-product {
            width: calc((100% - var(--column-gap, 2.5rem) * 2) / 3);
          }
        }
        @media (min-width: 1024px) {
          .collection-product {
            width: calc((100% - var(--column-gap, 2.5rem) * 5) / 6);
          }
        }
        .collection-product-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }
        .collection-product-image {
          width: 100%;
          aspect-ratio: 0.74;
          position: relative;
          overflow: hidden;
          background: #e8e4de;
        }
        .collection-product-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          user-select: none;
        }
        .collection-product-data {
          margin-top: 0.5rem;
        }
        @media (min-width: 1024px) {
          .collection-product-data {
            display: none;
          }
        }
        .collection-product-title {
          letter-spacing: 0.01em;
          line-height: 1.3;
        }
        .collection-product-price {
          opacity: 0.5;
          margin-top: 0.2em;
        }
        .collection-product-add {
          margin-top: 0.5rem;
          width: 100%;
          font-size: 1rem;
        }
        @media (min-width: 1024px) {
          .collection-product-add {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
