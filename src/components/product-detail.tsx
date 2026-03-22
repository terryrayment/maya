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

const TRUST_BADGES = [
  "Vet Formulated",
  "Made in USA",
  "Natural Ingredients",
  "30-Day Guarantee",
];

export function ProductDetail({ product }: { product: ShopifyProduct }) {
  const { addItem } = useCart();
  const images = product.images.edges.map((e) => e.node);
  const variants = product.variants.edges.map((e) => e.node);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isSubscription, setIsSubscription] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "ingredients">(
    "details"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedVariant = variants[selectedVariantIndex];
  const basePrice = parseFloat(selectedVariant?.price.amount || "0");
  const subscriptionPrice = basePrice * 0.8;
  const displayPrice = isSubscription ? subscriptionPrice : basePrice;

  // Check if product is a supplement (show subscription toggle)
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

  return (
    <div className="px-6 lg:px-12 py-8 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div>
            <div className="aspect-square bg-cream-dark relative overflow-hidden mb-3">
              {images[activeImageIndex] ? (
                <Image
                  src={images[activeImageIndex].url}
                  alt={
                    images[activeImageIndex].altText || product.title
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-mono text-xl tracking-widest uppercase text-ink-muted">
                    {product.title}
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 relative flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      i === activeImageIndex
                        ? "border-ink"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText || `${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:py-4">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-2">
              {product.productType || "MAYA"}
            </p>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-3">
              {product.title}
            </h1>
            <p className="font-mono text-lg mb-6">
              {formatPrice(displayPrice.toFixed(2))}
              {isSubscription && (
                <span className="text-ink-muted text-sm ml-2 line-through">
                  {formatPrice(basePrice.toFixed(2))}
                </span>
              )}
            </p>

            {/* Variant selector */}
            {variants.length > 1 &&
              variants[0].title !== "Default Title" && (
                <div className="mb-6">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-muted mb-3">
                    {variants[0].selectedOptions?.[0]?.name || "Option"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIndex(i)}
                        disabled={!v.availableForSale}
                        className={`px-4 py-2 border font-mono text-xs tracking-wide transition-colors ${
                          i === selectedVariantIndex
                            ? "bg-ink text-cream border-ink"
                            : v.availableForSale
                            ? "border-border hover:border-ink"
                            : "border-border text-ink-muted opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Subscribe & Save toggle */}
            {isSupplement && (
              <div className="mb-8 space-y-2">
                <button
                  onClick={() => setIsSubscription(false)}
                  className={`w-full flex items-center justify-between p-4 border transition-colors ${
                    !isSubscription ? "border-ink" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        !isSubscription ? "border-ink" : "border-ink-muted"
                      }`}
                    >
                      {!isSubscription && (
                        <div className="w-2 h-2 rounded-full bg-ink" />
                      )}
                    </div>
                    <span className="text-sm">One-time purchase</span>
                  </div>
                  <span className="font-mono text-sm">
                    {formatPrice(basePrice.toFixed(2))}
                  </span>
                </button>

                <button
                  onClick={() => setIsSubscription(true)}
                  className={`w-full flex items-center justify-between p-4 border transition-colors ${
                    isSubscription ? "border-ink" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSubscription ? "border-ink" : "border-ink-muted"
                      }`}
                    >
                      {isSubscription && (
                        <div className="w-2 h-2 rounded-full bg-ink" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-sm">Subscribe &amp; Save 20%</span>
                      <p className="text-[11px] text-ink-muted mt-0.5">
                        Never Run Out &middot; Cancel anytime
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-sm">
                    {formatPrice(subscriptionPrice.toFixed(2))}
                  </span>
                </button>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className="w-full bg-ink text-cream py-4 font-mono text-[11px] tracking-[0.2em] uppercase hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
            >
              {selectedVariant?.availableForSale
                ? "Add to Cart"
                : "Sold Out"}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 pb-8 border-b border-border">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="font-mono text-[9px] tracking-[0.15em] uppercase text-ink-muted"
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Description tabs */}
            <div className="mb-8">
              <div className="flex gap-6 border-b border-border mb-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    activeTab === "details"
                      ? "border-b-2 border-ink text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors ${
                    activeTab === "ingredients"
                      ? "border-b-2 border-ink text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  Ingredients
                </button>
              </div>
              <div className="text-sm text-ink-light leading-relaxed">
                {activeTab === "details" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionHtml || product.description,
                    }}
                    className="prose prose-sm max-w-none [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-3"
                  />
                ) : (
                  <p className="text-ink-muted">
                    See product packaging for full ingredient list. All
                    ingredients are natural, non-GMO, and sourced responsibly.
                  </p>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-4">
                FAQ
              </h3>
              <div className="space-y-0">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-t border-border">
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === i ? null : i)
                      }
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <span className="text-sm font-medium pr-4">
                        {faq.q}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className={`flex-shrink-0 transition-transform ${
                          openFaq === i ? "rotate-45" : ""
                        }`}
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                    {openFaq === i && (
                      <p className="text-sm text-ink-light leading-relaxed pb-4">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
