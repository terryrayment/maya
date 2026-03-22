import Link from "next/link";

const PLACEHOLDER_COUNT = 20;

export function CameraRoll() {
  return (
    <section className="border-t border-ink" style={{ borderStyle: "dotted" }}>
      {/* Heading */}
      <div className="px-4 lg:px-6 py-4 border-b border-ink" style={{ borderStyle: "dotted" }}>
        <Link
          href="https://instagram.com/officeofmaya"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
        >
          @officeofmaya
        </Link>
      </div>

      {/* Scrolling row */}
      <div className="overflow-x-auto">
        <div className="flex" style={{ width: "max-content" }}>
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <div
              key={i}
              className="w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] bg-[#e0ddd7] flex-shrink-0 border-r border-ink flex items-center justify-center"
              style={{ borderStyle: "dotted" }}
            >
              <span className="text-[9px] tracking-[0.1em] opacity-20 select-none">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Giant MAYA text */}
      <div className="px-4 lg:px-6 py-6 lg:py-8 border-t border-ink" style={{ borderStyle: "dotted" }}>
        <div className="font-display text-[18vw] leading-[0.85] tracking-[0.05em] select-none">
          MAYA
        </div>
      </div>
    </section>
  );
}
