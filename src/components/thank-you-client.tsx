"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type UpsellProduct = {
  id: string;
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  image: string;
  variantId: string;
};

type Props = {
  orderId?: string;
  primaryUpsell: UpsellProduct | null;
  alsoConsider: UpsellProduct[];
};

const UPSELL_DISCOUNT = 0.2; // 20% off upsell

function formatPrice(amount: string | number, code: string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Builds a Shopify checkout permalink that pre-adds the upsell variant with a
 * 20% discount applied via the `discount` query param. The merchant must have
 * a code called UPSELL20 created in Shopify Discounts for this to work.
 */
function buildUpsellCheckoutUrl(variantId: string): string {
  // variantId looks like "gid://shopify/ProductVariant/12345"
  const id = variantId.split("/").pop();
  if (!id) return "#";
  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "officeofmaya.myshopify.com";
  return `https://${domain}/cart/${id}:1?discount=UPSELL20`;
}

export function ThankYouClient({ orderId, primaryUpsell, alsoConsider }: Props) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min urgency window
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const i = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(i);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleOneClickAdd = (product: UpsellProduct) => {
    setAdded(product.id);
    // Redirect to checkout permalink with discount applied
    window.location.href = buildUpsellCheckoutUrl(product.variantId);
  };

  return (
    <div className="ty-root">
      <div className="ty-container">
        {/* Confirmation */}
        <div className="ty-confirmation">
          <p className="ty-eyebrow">ORDER CONFIRMED</p>
          <h1 className="ty-title">Thank you.</h1>
          <p className="ty-subtitle">
            Your MAYA order is on its way.
            {orderId && <> Order #{orderId}.</>} We&apos;ll email you tracking
            as soon as it ships.
          </p>
        </div>

        {/* Primary upsell */}
        {primaryUpsell && (
          <div className="ty-upsell">
            <div className="ty-upsell-header">
              <p className="ty-upsell-eyebrow">WAIT — ONE MORE THING</p>
              <h2 className="ty-upsell-title">
                Add {primaryUpsell.title} for {Math.round(UPSELL_DISCOUNT * 100)}% off
              </h2>
              <p className="ty-upsell-desc">
                Most dog parents stack two formulas for best results. This
                offer is only available on this page.
              </p>
              {timeLeft > 0 && (
                <p className="ty-timer">
                  Offer expires in{" "}
                  <strong>
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </strong>
                </p>
              )}
            </div>

            <div className="ty-upsell-card">
              <div className="ty-upsell-image">
                {primaryUpsell.image && (
                  <Image
                    src={primaryUpsell.image}
                    alt={primaryUpsell.title}
                    width={400}
                    height={400}
                    className="ty-product-image"
                  />
                )}
              </div>
              <div className="ty-upsell-info">
                <h3 className="ty-product-title">{primaryUpsell.title}</h3>
                <div className="ty-pricing">
                  <span className="ty-price-original">
                    {formatPrice(primaryUpsell.price, primaryUpsell.currencyCode)}
                  </span>
                  <span className="ty-price-discount">
                    {formatPrice(
                      parseFloat(primaryUpsell.price) * (1 - UPSELL_DISCOUNT),
                      primaryUpsell.currencyCode
                    )}
                  </span>
                </div>
                <button
                  className="ty-btn-primary"
                  onClick={() => handleOneClickAdd(primaryUpsell)}
                  disabled={added === primaryUpsell.id}
                >
                  {added === primaryUpsell.id
                    ? "Adding..."
                    : "Yes — add to my order"}
                </button>
                <Link
                  href={`/products/${primaryUpsell.handle}`}
                  className="ty-link"
                >
                  No thanks, see product details
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Also consider */}
        {alsoConsider.length > 0 && (
          <div className="ty-also">
            <p className="ty-section-label">OR ADD ONE OF THESE</p>
            <div className="ty-also-grid">
              {alsoConsider.map((p) => (
                <div key={p.id} className="ty-also-card">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={200}
                      height={200}
                      className="ty-also-image"
                    />
                  )}
                  <h4 className="ty-also-title">{p.title}</h4>
                  <p className="ty-also-price">
                    <span className="ty-price-original">
                      {formatPrice(p.price, p.currencyCode)}
                    </span>{" "}
                    <span className="ty-price-discount">
                      {formatPrice(
                        parseFloat(p.price) * (1 - UPSELL_DISCOUNT),
                        p.currencyCode
                      )}
                    </span>
                  </p>
                  <button
                    className="ty-btn-ghost"
                    onClick={() => handleOneClickAdd(p)}
                    disabled={added === p.id}
                  >
                    {added === p.id ? "Adding..." : `Add for 20% off`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skip link */}
        <div className="ty-skip">
          <Link href="/" className="ty-link">
            Continue shopping
          </Link>
        </div>

        {/* Social proof / footer */}
        <div className="ty-footer">
          <p className="ty-footer-text">
            Share MAYA with a friend — tag @officeofmaya for a chance to be
            featured.
          </p>
        </div>
      </div>
      <ThankYouStyles />
    </div>
  );
}

function ThankYouStyles() {
  return (
    <style>{`
      .ty-root {
        min-height: 80vh;
        padding: 4rem var(--side-padding, 1.5rem);
        background: var(--ivory, #fdfbf7);
      }
      .ty-container {
        max-width: 720px;
        margin: 0 auto;
      }
      .ty-confirmation {
        text-align: center;
        padding-bottom: 3rem;
        border-bottom: 1px dotted rgba(0, 0, 0, 0.2);
        margin-bottom: 3rem;
      }
      .ty-eyebrow {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        opacity: 0.5;
        margin-bottom: 1rem;
      }
      .ty-title {
        font-size: 3rem;
        font-weight: 400;
        line-height: 1;
        margin-bottom: 1rem;
      }
      .ty-subtitle {
        opacity: 0.7;
        line-height: 1.5;
        max-width: 400px;
        margin: 0 auto;
      }
      .ty-upsell {
        margin-bottom: 3rem;
      }
      .ty-upsell-header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .ty-upsell-eyebrow {
        font-size: 0.7rem;
        letter-spacing: 0.2em;
        background: #1a1a1a;
        color: #fdfbf7;
        padding: 0.3rem 0.6rem;
        display: inline-block;
        margin-bottom: 1rem;
      }
      .ty-upsell-title {
        font-size: 1.75rem;
        font-weight: 400;
        line-height: 1.2;
        margin-bottom: 0.5rem;
      }
      .ty-upsell-desc {
        opacity: 0.6;
        max-width: 440px;
        margin: 0 auto 1rem;
        line-height: 1.5;
      }
      .ty-timer {
        font-size: 0.875rem;
        opacity: 0.7;
      }
      .ty-timer strong {
        color: #1a1a1a;
      }
      .ty-upsell-card {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 2rem;
        border: 1px dotted rgba(0, 0, 0, 0.3);
        align-items: center;
      }
      @media (min-width: 640px) {
        .ty-upsell-card {
          grid-template-columns: 1fr 1fr;
        }
      }
      .ty-upsell-image { display: flex; justify-content: center; }
      .ty-product-image {
        width: 100%;
        height: auto;
        max-width: 280px;
      }
      .ty-product-title {
        font-size: 1.5rem;
        font-weight: 400;
        margin-bottom: 1rem;
      }
      .ty-pricing {
        margin-bottom: 1.5rem;
      }
      .ty-price-original {
        text-decoration: line-through;
        opacity: 0.4;
        margin-right: 0.5rem;
      }
      .ty-price-discount {
        font-size: 1.125rem;
        font-weight: 500;
      }
      .ty-btn-primary {
        width: 100%;
        padding: 1rem 1.5rem;
        background: #1a1a1a;
        color: #fdfbf7;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.875rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        transition: opacity 150ms ease;
      }
      .ty-btn-primary:hover:not(:disabled) { opacity: 0.85; }
      .ty-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .ty-btn-ghost {
        padding: 0.75rem 1rem;
        background: transparent;
        border: 1px dotted rgba(0, 0, 0, 0.3);
        cursor: pointer;
        font-family: inherit;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        width: 100%;
      }
      .ty-btn-ghost:hover:not(:disabled) {
        background: #1a1a1a;
        color: #fdfbf7;
      }
      .ty-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }
      .ty-link {
        display: inline-block;
        margin-top: 0.75rem;
        font-size: 0.875rem;
        opacity: 0.6;
        text-decoration: underline;
      }
      .ty-section-label {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        opacity: 0.5;
        margin-bottom: 1rem;
        text-align: center;
      }
      .ty-also {
        margin-bottom: 3rem;
      }
      .ty-also-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .ty-also-card {
        padding: 1.25rem;
        border: 1px dotted rgba(0, 0, 0, 0.15);
        text-align: center;
      }
      .ty-also-image {
        width: 100%;
        height: auto;
        max-width: 120px;
        margin: 0 auto 0.75rem;
      }
      .ty-also-title {
        font-size: 0.875rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
      }
      .ty-also-price {
        font-size: 0.8rem;
        margin-bottom: 0.75rem;
      }
      .ty-skip {
        text-align: center;
        margin-bottom: 3rem;
      }
      .ty-footer {
        text-align: center;
        padding-top: 2rem;
        border-top: 1px dotted rgba(0, 0, 0, 0.2);
        font-size: 0.875rem;
        opacity: 0.6;
      }
    `}</style>
  );
}
