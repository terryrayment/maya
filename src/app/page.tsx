import Link from "next/link";
import { getAllProducts } from "@/lib/shopify";
import { pickPrimaryProductImage } from "@/lib/product-images";
import { ProductGrid } from "@/components/product-grid";
import { EmailCapture } from "@/components/email-capture";
import { ProductSlider } from "@/components/product-slider";
import { VideoBar } from "@/components/video-bar";
import { CameraRoll } from "@/components/camera-roll";

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

  // Build product image map for slider
  const productImages: Record<string, string> = {};
  for (const p of products) {
    const img = pickPrimaryProductImage(p.images.edges.map((e) => e.node))?.url;
    if (!img) continue;
    const h = p.handle.toLowerCase();
    const t = p.title.toLowerCase();
    if (h.includes("brush") || t.includes("brush")) productImages["dog brush"] = img;
    if (h.includes("gift") || t.includes("gift")) productImages["gift card"] = img;
  }
  for (const p of products) {
    const img = pickPrimaryProductImage(p.images.edges.map((e) => e.node))?.url;
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
      {/* 1. Product Slider (full viewport, 4 slides) */}
      <ProductSlider productImages={productImages} />

      {/* 2. Video Bar (fixed position overlay) */}
      <VideoBar />

      {/* 3. Hero / Start Here section */}
      <section style={{ padding: "0 var(--side-padding)", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            <div>
              <p style={{ letterSpacing: "0.01em", marginBottom: "0.5rem", opacity: 0.5 }}>
                Los Angeles &middot; Ciudad de M&eacute;xico
              </p>
              <h1 style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.1, marginBottom: "1rem" }}>
                Care and wellness
                <br />
                for dogs.
              </h1>
              <p style={{ opacity: 0.6, lineHeight: 1.6, marginBottom: "2rem", maxWidth: "30rem", textTransform: "none" }}>
                Vet-formulated supplements and essentials designed for the dogs
                who deserve more. Natural ingredients, real results.
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link
                  href="/shop"
                  className="button"
                  style={{ position: "relative" }}
                >
                  Shop All
                  <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                    <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
                  </svg>
                </Link>
                {featuredProduct && (
                  <Link
                    href={`/products/${featuredProduct.handle}`}
                    className="button"
                    style={{ position: "relative" }}
                  >
                    Best Seller
                    <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
                      <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Supplement Grid */}
      <section style={{ padding: "0 var(--side-padding)", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem" }}>
            <div>
              <p style={{ letterSpacing: "0.01em", opacity: 0.5, marginBottom: "0.3rem" }}>
                Wellness
              </p>
              <p style={{ fontSize: "1.5rem" }}>
                Daily supplements
              </p>
            </div>
            <Link
              href="/shop?collection=wellness"
              style={{ letterSpacing: "0.01em" }}
            >
              View All
            </Link>
          </div>

          <ProductGrid products={wellnessProducts} />
        </div>
      </section>

      {/* 5. Brand Story */}
      <section style={{ padding: "4rem var(--side-padding)" }}>
        <div style={{ maxWidth: "40rem", margin: "0 auto", textAlign: "center" }}>
          <p style={{ letterSpacing: "0.01em", opacity: 0.5, marginBottom: "1.5rem" }}>
            Our Story
          </p>
          <p style={{ fontSize: "1.5rem", lineHeight: 1.4, marginBottom: "1.5rem" }}>
            MAYA was born from a simple belief: every dog deserves the same
            quality of care we expect for ourselves.
          </p>
          <p style={{ opacity: 0.6, lineHeight: 1.6, marginBottom: "2rem", textTransform: "none" }}>
            We work with veterinarians and nutritional scientists to formulate
            supplements that actually work. No fillers, no gimmicks — just
            clean, effective ingredients sourced with intention.
          </p>
          <p style={{ letterSpacing: "0.01em", opacity: 0.5 }}>
            All Furs &middot; Todos Pieles
          </p>
        </div>
      </section>

      {/* 6. Email Capture */}
      <section style={{ padding: "4rem var(--side-padding)" }}>
        <div style={{ maxWidth: "30rem", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.5rem" }}>
            Get 10% off your first order
          </h2>
          <p style={{ opacity: 0.5, marginBottom: "2rem", textTransform: "none" }}>
            Join the MAYA community for early access, wellness tips, and
            exclusive offers.
          </p>
          <EmailCapture />
        </div>
      </section>

      {/* 7. Camera Roll */}
      <CameraRoll />
    </>
  );
}
