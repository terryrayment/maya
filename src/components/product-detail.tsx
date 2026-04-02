"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

const FAQS = [
  {
    q: "How long before I see results?",
    a: "Most dogs show improvement within 2-4 weeks of daily use.",
  },
  {
    q: "Is it safe for daily use?",
    a: "Yes. Formulated for daily use with natural, vet-grade ingredients.",
  },
  {
    q: "What size dog is this for?",
    a: "Suitable for all breeds and sizes. Adjust serving based on weight.",
  },
];

export function ProductDetail({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = variants[selectedVariantIndex];
  const basePrice = parseFloat(selectedVariant?.price.amount || "0");
  const subscriptionPrice = basePrice * 0.8;
  const displayPrice = isSubscription ? subscriptionPrice : basePrice;

  const isSupplement =
    product.productType?.toLowerCase().includes("supplement") ||
    product.title.toLowerCase().includes("supplement") ||
    product.tags?.some((t) => t.toLowerCase().includes("supplement")) ||
    product.tags?.some((t) => t.toLowerCase().includes("wellness"));

  function handleAddToCart() {
    if (!selectedVariant) return;
    const image = images[0]?.url || "";

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      title: product.title,
      variantTitle: selectedVariant.title,
      price: displayPrice,
      quantity: 1,
      image,
      handle: product.handle,
      isSubscription,
    });
  }

  function toggleAccordion(key: string) {
    setOpenAccordion(openAccordion === key ? null : key);
  }

  return (
    <div className="product">
      <div className="product-columns">
        {/* Left: Images */}
        <div className="product-column product-column--images">
          {images.map((img, i) => (
            <div
              key={i}
              className={`product-images-item ${i === 0 ? "product-images-item--first" : ""}`}
            >
              <Image
                src={img.url}
                alt={img.altText || product.title}
                width={800}
                height={800}
                className="product-images-media"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={i === 0}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
          {images.length === 0 && (
            <div className="product-images-item product-images-item--first">
              <div style={{ aspectRatio: "1", background: "#e8e4de", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ opacity: 0.3 }}>{product.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Product info */}
        <div className="product-column product-column--info">
          <div className="product-column-inner">
            <div>
              {/* Title & price */}
              <div className="product-form">
                <div className="product-form-details">
                  <span>{product.title}</span>
                  <span className="product-price">
                    {formatPrice(displayPrice.toFixed(2))}
                  </span>
                </div>
              </div>

              {/* Variant selector */}
              {variants.length > 1 && variants[0].title !== "Default Title" && (
                <div className="product-variants">
                  <p style={{ opacity: 0.5, marginBottom: "0.5rem" }}>
                    {variants[0].selectedOptions?.[0]?.name || "Option"}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIndex(i)}
                        disabled={!v.availableForSale}
                        className="button"
                        style={{
                          minWidth: "auto",
                          height: "auto",
                          padding: "0.5rem 1rem",
                          fontSize: "1rem",
                          opacity: !v.availableForSale ? 0.3 : 1,
                          background: i === selectedVariantIndex ? "var(--black)" : "transparent",
                          color: i === selectedVariantIndex ? "var(--ivory)" : "var(--black)",
                        }}
                      >
                        {v.title}
                        <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
                          <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscribe & Save */}
              {isSupplement && (
                <div className="product-subscribe">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className="product-subscribe-option"
                    style={{ opacity: !isSubscription ? 1 : 0.4 }}
                  >
                    <span>One-Time Purchase</span>
                    <span>{formatPrice(basePrice.toFixed(2))}</span>
                  </button>
                  <button
                    onClick={() => setIsSubscription(true)}
                    className="product-subscribe-option"
                    style={{ opacity: isSubscription ? 1 : 0.4 }}
                  >
                    <div>
                      <span>Subscribe &amp; Save 20%</span>
                      <br />
                      <span style={{ opacity: 0.5, fontSize: "0.857rem" }}>
                        Never Run Out &middot; Cancel Anytime
                      </span>
                    </div>
                    <span>{formatPrice(subscriptionPrice.toFixed(2))}</span>
                  </button>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="button product-add-button"
                style={{
                  width: "100%",
                  opacity: !selectedVariant?.availableForSale ? 0.3 : 1,
                  cursor: !selectedVariant?.availableForSale ? "not-allowed" : "pointer",
                }}
              >
                {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
                <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
                  <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
                </svg>
              </button>

              {/* Accordion: Details, Ingredients, FAQ */}
              <div className="product-info-accordion">
                {/* Details */}
                <div className={`product-info-row ${openAccordion === "details" ? "product-info-row--active" : ""}`}>
                  <button className="product-info-title" onClick={() => toggleAccordion("details")}>
                    Details
                    <span className="product-info-plus" />
                  </button>
                  {openAccordion === "details" && (
                    <div className="product-info-value">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.descriptionHtml || product.description,
                        }}
                        style={{ textTransform: "none", lineHeight: 1.6 }}
                      />
                    </div>
                  )}
                </div>

                {/* Ingredients */}
                <div className={`product-info-row ${openAccordion === "ingredients" ? "product-info-row--active" : ""}`}>
                  <button className="product-info-title" onClick={() => toggleAccordion("ingredients")}>
                    Ingredients
                    <span className="product-info-plus" />
                  </button>
                  {openAccordion === "ingredients" && (
                    <div className="product-info-value">
                      <p style={{ textTransform: "none", lineHeight: 1.6 }}>
                        See product packaging for full ingredient list. All
                        ingredients are natural, non-GMO, and sourced responsibly.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ */}
                <div className={`product-info-row ${openAccordion === "faq" ? "product-info-row--active" : ""}`}>
                  <button className="product-info-title" onClick={() => toggleAccordion("faq")}>
                    FAQ
                    <span className="product-info-plus" />
                  </button>
                  {openAccordion === "faq" && (
                    <div className="product-info-value">
                      {FAQS.map((faq, i) => (
                        <div key={i} style={{ marginBottom: "1rem" }}>
                          <p style={{ marginBottom: "0.3em" }}>{faq.q}</p>
                          <p style={{ opacity: 0.6, textTransform: "none", lineHeight: 1.6 }}>{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .product {
          padding: 5.357rem var(--side-padding) 6.071rem;
          background-color: var(--ivory);
        }
        @media (min-width: 1024px) {
          .product {
            padding: 0;
          }
        }
        .product-columns {
          display: block;
        }
        @media (min-width: 1024px) {
          .product-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--side-padding);
          }
        }
        .product-column--images {
          overflow: hidden;
          margin-bottom: 2rem;
        }
        @media (max-width: 1023px) {
          .product-column--images {
            margin: 0 calc(var(--side-padding) * -1) 4.071rem;
            padding-bottom: 0.714rem;
          }
        }
        .product-images-item--first {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        .product-images-media {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
        }

        @media (min-width: 1024px) {
          .product-column-inner {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100vh;
            overflow: auto;
            padding-top: 7rem;
            padding-right: var(--side-padding);
            padding-bottom: 1.143rem;
            position: sticky;
            top: 0;
          }
        }

        .product-form {
          margin-bottom: 1.5rem;
        }
        .product-form-details {
          flex: 1;
          display: flex;
          justify-content: space-between;
          gap: 1em;
          padding-bottom: 0.143rem;
          font-size: 1.1428571428571428rem;
          line-height: 1.1;
        }
        .product-price {
          white-space: nowrap;
        }

        .product-variants {
          margin-bottom: 1.5rem;
        }

        .product-subscribe {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .product-subscribe-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.714rem;
          text-align: left;
          background: linear-gradient(to right, #000 50%, transparent 50%);
          background-size: 4px 1px;
          background-repeat: repeat-x;
          background-position: 0 100%;
          transition: opacity 0.2s;
        }

        .product-add-button {
          margin-bottom: 2rem;
        }

        .product-info-accordion {
          background: linear-gradient(to right, #000 50%, transparent 50%) top;
          background-size: 4px 1px;
          background-repeat: repeat-x;
          display: flex;
          flex-direction: column;
          gap: 0.19em;
          line-height: 1;
        }
        .product-info-row {
          background: linear-gradient(to right, #000 50%, transparent 50%) bottom;
          background-size: 4px 1px;
          background-repeat: repeat-x;
        }
        .product-info-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.679rem 0;
          position: relative;
          user-select: none;
          cursor: pointer;
          letter-spacing: 0.01em;
          text-align: left;
        }
        .product-info-plus {
          display: block;
          width: 0.571rem;
          height: 0.571rem;
          position: relative;
        }
        .product-info-plus::before,
        .product-info-plus::after {
          content: "";
          width: 0.571rem;
          height: 1px;
          position: absolute;
          top: 50%;
          left: 0;
          background-color: currentColor;
        }
        .product-info-plus::after {
          transform: rotate(90deg);
        }
        .product-info-row--active .product-info-plus::after {
          opacity: 0;
        }
        .product-info-value {
          padding-bottom: 1rem;
          font-size: 0.857rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
