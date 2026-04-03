import type { ShopifyImage } from "./shopify";

/**
 * Supplement shots on Shopify use "_Vet" / "_VET" in the filename for the
 * corner seal graphic baked into the file.
 */
export function isVetSealProductImageUrl(url: string): boolean {
  try {
    const pathname = new URL(url).pathname;
    return (
      /_vet([._0-9-]|\.jpe?g)/i.test(pathname) || /_VET_/i.test(pathname)
    );
  } catch {
    return false;
  }
}

/** Grids and cards: use a non-seal asset when the product has one. */
export function pickPrimaryProductImage(
  images: ShopifyImage[]
): ShopifyImage | undefined {
  if (images.length === 0) return undefined;
  const nonVet = images.find((img) => !isVetSealProductImageUrl(img.url));
  return nonVet ?? images[0];
}

/** Clip bottom-right when this URL is the vet-seal variant (no clean file available). */
export function vetSealImageClass(url: string | undefined): string {
  if (!url || !isVetSealProductImageUrl(url)) return "";
  return "product-photo--hide-vet-seal";
}
