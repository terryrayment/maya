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
  "USDA Certified",
  "Vegan",
  "Responsibly Produced",
  "Made in USA",
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
    <div className="px-4 lg:px-10 py-6 lg:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left: Images */}
          <div>
            <div className="aspect-square bg-[#e8e4de] relative overflow-hidden mb-3 border border-ink" style={{ borderStyle: "dotted" }}>
              {images[activeImageIndex] ? (
                <Image
                  src={images[activeImageIndex].url}
                  alt={images[activeImageIndex].altText || product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl tracking-widest opacity-30">
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
                    className={`w-16 h-16 lg:w-20 lg:h-20 relative flex-shrink-0 overflow-hidden border transition-colors ${
                      i === activeImageIndex
                        ? "border-ink"
                        : "border-transparent"
                    }`}
                    style={{ borderStyle: i === activeImageIndex ? "dotted" : "none" }}
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

          {/* Right: Product info */}
          <div className="lg:py-2">
            <p className="text-[10px] tracking-[0.15em] opacity-50 mb-2">
              {product.productType || "MAYA"}
            </p>
            <h1 className="text-lg lg:text-xl tracking-[0.1em] mb-4">
              {product.title}
            </h1>

            {/* Variant selector */}
            {variants.length > 1 &&
              variants[0].title !== "Default Title" && (
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.15em] opacity-50 mb-3">
                    {variants[0].selectedOptions?.[0]?.name || "Option"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v, i) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantIndex(i)}
                        disabled={!v.availableForSale}
                        className={`px-4 py-2 border text-[10px] tracking-[0.15em] transition-colors ${
                          i === selectedVariantIndex
                            ? "bg-ink text-[#fdfbf7] border-ink"
                            : v.availableForSale
                            ? "border-ink hover:bg-ink hover:text-[#fdfbf7]"
                            : "border-ink opacity-30 cursor-not-allowed"
                        }`}
                        style={{ borderStyle: "dotted" }}
                      >
                        {v.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            {/* Subscribe & Save toggle */}
            {isSupplement && (
              <div className="mb-6 space-y-2">
                <button
                  onClick={() => setIsSubscription(false)}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    !isSubscription ? "border-ink" : "border-ink/30"
                  }`}
                  style={{ borderStyle: "dotted" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                        !isSubscription ? "border-ink" : "border-ink/40"
                      }`}
                      style={{ borderStyle: "dotted" }}
                    >
                      {!isSubscription && (
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" />
                      )}
                    </div>
                    <span className="text-[10px] tracking-[0.15em]">One-Time Purchase</span>
                  </div>
                  <span className="text-[10px] tracking-[0.15em]">
                    {formatPrice(basePrice.toFixed(2))}
                  </span>
                </button>

                <button
                  onClick={() => setIsSubscription(true)}
                  className={`w-full flex items-center justify-between p-3 border transition-colors ${
                    isSubscription ? "border-ink" : "border-ink/30"
                  }`}
                  style={{ borderStyle: "dotted" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                        isSubscription ? "border-ink" : "border-ink/40"
                      }`}
                      style={{ borderStyle: "dotted" }}
                    >
                      {isSubscription && (
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" />
                      )}
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] tracking-[0.15em]">Subscribe &amp; Save 20%</span>
                      <p className="text-[9px] tracking-[0.1em] opacity-50 mt-0.5">
                        Never Run Out &middot; Cancel Anytime
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] tracking-[0.15em]">
                    {formatPrice(subscriptionPrice.toFixed(2))}
                  </span>
                </button>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
              className="w-full flex items-center justify-between border border-ink py-3 px-4 hover:bg-ink hover:text-[#fdfbf7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed mb-6"
              style={{ borderStyle: "dotted" }}
            >
              <span className="text-[10px] tracking-[0.15em]">
                {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
              </span>
              <span className="text-[10px] tracking-[0.15em]">
                {formatPrice(displayPrice.toFixed(2))}
              </span>
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6 pb-6 border-b border-ink" style={{ borderStyle: "dotted" }}>
              {TRUST_BADGES.map((badge, i) => (
                <span key={badge} className="text-[9px] tracking-[0.1em] opacity-50 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {badge}
                  {i < TRUST_BADGES.length - 1 && <span className="ml-3">|</span>}
                </span>
              ))}
            </div>

            {/* Description tabs */}
            <div className="mb-6">
              <div className="flex gap-0 border-b border-ink mb-4" style={{ borderStyle: "dotted" }}>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 mr-6 text-[10px] tracking-[0.15em] transition-colors ${
                    activeTab === "details"
                      ? "border-b border-ink"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ borderStyle: activeTab === "details" ? "dotted" : "none" }}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`pb-2 text-[10px] tracking-[0.15em] transition-colors ${
                    activeTab === "ingredients"
                      ? "border-b border-ink"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ borderStyle: activeTab === "ingredients" ? "dotted" : "none" }}
                >
                  Ingredients
                </button>
              </div>
              <div className="text-[11px] tracking-[0.05em] leading-relaxed opacity-70">
                {activeTab === "details" ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.descriptionHtml || product.description,
                    }}
                    className="[&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-3"
                  />
                ) : (
                  <p>
                    See product packaging for full ingredient list. All
                    ingredients are natural, non-GMO, and sourced responsibly.
                  </p>
                )}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-[10px] tracking-[0.15em] opacity-50 mb-3">
                FAQ
              </h3>
              <div className="space-y-0">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-t border-ink" style={{ borderStyle: "dotted" }}>
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === i ? null : i)
                      }
                      className="w-full flex items-center justify-between py-3 text-left"
                    >
                      <span className="text-[10px] tracking-[0.1em] pr-4">
                        {faq.q}
                      </span>
                      <svg
                        width="12"
                        height="12"
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
                      <p className="text-[10px] tracking-[0.05em] leading-relaxed opacity-60 pb-3">
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
