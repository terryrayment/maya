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
    <div className="collection-filter">
      {COLLECTIONS.map((col) => (
        <button
          key={col.value}
          onClick={() => handleFilter(col.value)}
          className="button collection-filter-btn"
          style={{
            minWidth: "auto",
            height: "auto",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            background: active === col.value ? "var(--black)" : "transparent",
            color: active === col.value ? "var(--ivory)" : "var(--black)",
          }}
        >
          {col.label}
          <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
            <rect
              width="198" height="48" x="1" y="1" rx="0" ry="0"
              fill="none"
              stroke={active === col.value ? "var(--ivory)" : "var(--black)"}
              strokeWidth="1"
              strokeDasharray="2"
            />
          </svg>
        </button>
      ))}

      <style jsx>{`
        .collection-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .collection-filter-btn {
          position: relative;
        }
      `}</style>
    </div>
  );
}
