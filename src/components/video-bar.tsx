import Link from "next/link";

export function VideoBar() {
  return (
    <section className="border-t border-b border-ink">
      <div className="px-4 lg:px-6 py-6 lg:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.15em] mb-1">Watch Now</p>
          <p className="text-[10px] tracking-[0.15em] opacity-50">
            &ldquo;A Portrait of My Dog&rdquo; &mdash; A Film by Danny Geritz
          </p>
        </div>
        <Link
          href="https://vimeo.com/944612214"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] tracking-[0.15em] border border-ink px-5 py-2 hover:bg-ink hover:text-[#fdfbf7] transition-colors flex-shrink-0"
          style={{ borderStyle: "dotted" }}
        >
          Watch &rarr;
        </Link>
      </div>
    </section>
  );
}
