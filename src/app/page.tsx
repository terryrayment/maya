import Link from "next/link";
import Image from "next/image";
import { getAllProducts, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { ProductGrid } from "@/components/product-grid";
import { EmailCapture } from "@/components/email-capture";
import { ProductSlider } from "@/components/product-slider";
import { VideoBar } from "@/components/video-bar";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getAllProducts();

  // Separate supplements from other products
  const supplements = products.filter(
    (p) =>
      p.productType?.toLowerCase().includes("supplement") ||
      p.title.toLowerCase().includes("supplement") ||
      p.tags?.some((t) => t.toLowerCase().includes("supplement")) ||
      p.tags?.some((t) => t.toLowerCase().includes("wellness"))
  );

  // Find the allergy supplement as the featured product
  const featuredProduct =
    supplements.find(
      (p) =>
        p.handle.includes("allergy") ||
        p.title.toLowerCase().includes("allergy")
    ) || supplements[0] || products[0];

  // Use supplements if we found them, otherwise show first 4 products
  const wellnessProducts =
    supplements.length > 0 ? supplements.slice(0, 4) : products.slice(0, 4);

  const featuredImage = featuredProduct?.images.edges[0]?.node;

  // Build product image map for slider
  const productImages: Record<string, string> = {};
  for (const p of products) {
    const img = p.images.edges[0]?.node?.url;
    if (!img) continue;
    const h = p.handle.toLowerCase();
    const t = p.title.toLowerCase();
    if (h.includes("brush") || t.includes("brush")) productImages["dog brush"] = img;
    if (h.includes("gift") || t.includes("gift")) productImages["gift card"] = img;
  }
  // For collections, use first matching product image
  for (const p of products) {
    const img = p.images.edges[0]?.node?.url;
    if (!img) continue;
    if (
      p.productType?.toLowerCase().includes("supplement") ||
      p.tags?.some((t) => t.toLowerCase().includes("wellness"))
    ) {
      if (!productImages["supplements"]) productImages["supplements"] = img;
    }
    if (
      p.productType?.toLowerCase().includes("apparel") ||
      p.tags?.some((t) => t.toLowerCase().includes("apparel"))
    ) {
      if (!productImages["apparel"]) productImages["apparel"] = img;
    }
  }

  return (
    <>
      {/* Product Slider */}
      <ProductSlider productImages={productImages} />

      {/* Video Bar */}
      <VideoBar />

      {/* Hero */}
      <section className="px-6 lg:px-12 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-6">
                Los Angeles &middot; Ciudad de M&eacute;xico
              </p>
              <h1 className="text-4xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-6">
                Care and wellness
                <br />
                for dogs.
              </h1>
              <p className="text-ink-light text-lg leading-relaxed mb-8 max-w-md">
                Vet-formulated supplements and essentials designed for the dogs
                who deserve more. Natural ingredients, real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-ink text-cream px-8 py-3.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors"
                >
                  Shop All
                </Link>
                <Link
                  href={
                    featuredProduct
                      ? `/products/${featuredProduct.handle}`
                      : "/shop"
                  }
                  className="inline-flex items-center justify-center border border-ink px-8 py-3.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-ink hover:text-cream transition-colors"
                >
                  Best Seller
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] bg-cream-dark relative overflow-hidden">
                {featuredImage ? (
                  <Image
                    src={featuredImage.url}
                    alt={featuredImage.altText || featuredProduct.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-mono text-2xl tracking-[0.3em] uppercase text-ink-muted">
                      MAYA
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Here — Featured */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-3">
              Start Here
            </h2>
            <p className="text-2xl lg:text-3xl font-light tracking-tight">
              The essentials for every dog
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Featured product */}
            {featuredProduct && (
              <Link
                href={`/products/${featuredProduct.handle}`}
                className="group block"
              >
                <div className="aspect-square bg-cream-dark relative overflow-hidden">
                  {featuredImage ? (
                    <Image
                      src={featuredImage.url}
                      alt={featuredImage.altText || featuredProduct.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-mono text-lg tracking-widest uppercase text-ink-muted">
                        {featuredProduct.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-ink text-cream font-mono text-[9px] tracking-[0.15em] uppercase px-3 py-1.5">
                      Best Seller
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium">{featuredProduct.title}</h3>
                  <p className="font-mono text-sm text-ink-light mt-1">
                    {formatPrice(
                      featuredProduct.priceRange.minVariantPrice.amount,
                      featuredProduct.priceRange.minVariantPrice.currencyCode
                    )}
                  </p>
                </div>
              </Link>
            )}

            {/* Wellness Stack CTA */}
            <div className="flex flex-col justify-center bg-cream-dark p-8 lg:p-12">
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-4">
                Complete Wellness
              </h3>
              <p className="text-2xl lg:text-3xl font-light tracking-tight mb-4">
                The Complete
                <br />
                Wellness Stack
              </p>
              <p className="text-ink-light leading-relaxed mb-8 max-w-sm">
                Build your dog&apos;s daily routine with our full range of
                vet-formulated supplements. Cover every base &mdash; from skin
                and coat to joints and digestion.
              </p>
              <Link
                href="/shop?collection=wellness"
                className="inline-flex items-center justify-center self-start bg-ink text-cream px-8 py-3.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors"
              >
                Shop Wellness
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Supplement Grid */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-3">
                Wellness
              </h2>
              <p className="text-2xl lg:text-3xl font-light tracking-tight">
                Daily supplements
              </p>
            </div>
            <Link
              href="/shop?collection=wellness"
              className="hidden sm:inline-flex font-mono text-[10px] tracking-[0.2em] uppercase border-b border-ink pb-0.5 hover:text-ink-muted transition-colors"
            >
              View All
            </Link>
          </div>

          <ProductGrid products={wellnessProducts} />

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/shop?collection=wellness"
              className="font-mono text-[10px] tracking-[0.2em] uppercase border-b border-ink pb-0.5"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted mb-6">
            Our Story
          </p>
          <p className="text-2xl lg:text-3xl font-light leading-relaxed tracking-tight mb-6">
            MAYA was born from a simple belief: every dog deserves the same
            quality of care we expect for ourselves.
          </p>
          <p className="text-ink-light leading-relaxed mb-8">
            We work with veterinarians and nutritional scientists to formulate
            supplements that actually work. No fillers, no gimmicks — just
            clean, effective ingredients sourced with intention.
          </p>
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-muted">
            All Furs &middot; Todos Pieles
          </p>
        </div>
      </section>

      {/* Email Capture */}
      <section className="px-6 lg:px-12 py-16 lg:py-24 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-light tracking-tight mb-3">
            Get 10% off your first order
          </h2>
          <p className="text-ink-light text-sm mb-8">
            Join the MAYA community for early access, wellness tips, and
            exclusive offers.
          </p>
          <EmailCapture />
        </div>
      </section>
    </>
  );
}
