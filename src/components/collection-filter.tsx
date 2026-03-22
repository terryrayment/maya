"use client";

import { useRouter, useSearchParams } from "next/navigation";

const COLLECTIONS = [
  { label: "All", value: "" },
  { label: "Wellness", value: "wellness" },
  { label: "Apparel", value: "apparel" },
  { label: "Care", value: "care" },
  { label: "Gift Card", value: "gift-card" },
];

export function CollectionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("collection") || "";

  function handleFilter(value: string) {
    if (value) {
      router.push(`/shop?collection=${value}`, { scroll: false });
    } else {
      router.push("/shop", { scroll: false });
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {COLLECTIONS.map((col) => (
        <button
          key={col.value}
          onClick={() => handleFilter(col.value)}
          className={`font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
            active === col.value
              ? "bg-ink text-cream border-ink"
              : "border-border text-ink-light hover:border-ink hover:text-ink"
          }`}
        >
          {col.label}
        </button>
      ))}
    </div>
  );
}
