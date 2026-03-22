"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="border-t border-ink" style={{ borderStyle: 'dotted' }}>
      {/* Giant MAYA display text */}
      <div className="px-4 lg:px-6 py-8 lg:py-12">
        <div className="font-display text-[18vw] leading-[0.85] tracking-[0.05em] select-none">
          MAYA
        </div>
      </div>

      {/* Email signup */}
      <div className="px-4 lg:px-6 py-5 border-t border-ink" style={{ borderStyle: 'dotted' }}>
        <p className="text-[10px] tracking-[0.15em] mb-3">
          Join the community.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
          className="flex items-center gap-2 max-w-md"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 bg-transparent border-b border-ink py-1 text-[10px] tracking-[0.15em] outline-none placeholder:opacity-40"
            style={{ borderStyle: 'dotted' }}
          />
          <button
            type="submit"
            className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
          >
            Join the community &rarr;
          </button>
        </form>
      </div>

      {/* Bottom bar */}
      <div className="px-4 lg:px-6 py-3 border-t border-ink flex flex-col lg:flex-row justify-between gap-3" style={{ borderStyle: 'dotted' }}>
        <div className="flex items-center gap-3 text-[9px] tracking-[0.1em] opacity-50">
          <span>&copy; 2026 Maya</span>
          <span>&middot;</span>
          <span>All Furs &middot; Todos Pieles</span>
          <span>&middot;</span>
          <a href="https://officeb.org" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">Credits</a>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[9px] tracking-[0.1em]">
          <Link href="/shop" className="hover:opacity-50 transition-opacity">Shop</Link>
          <Link href="/about" className="hover:opacity-50 transition-opacity">About</Link>
          <Link href="/contact" className="hover:opacity-50 transition-opacity">Contact</Link>
          <Link href="/shipping" className="hover:opacity-50 transition-opacity">Shipping &amp; Returns</Link>
          <Link href="/faqs" className="hover:opacity-50 transition-opacity">FAQs</Link>
          <Link href="/terms" className="hover:opacity-50 transition-opacity">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
