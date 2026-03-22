"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useState, useEffect } from "react";

const announcements = [
  "Sign up for 10% off your first order",
  "Free shipping on orders over $100",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-2 text-center border-b border-ink">
      <p className="text-[10px] tracking-[0.15em]">
        {announcements[index]}
      </p>
    </div>
  );
}

export function Header() {
  const { toggleCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F5F2ED]">
      <AnnouncementBar />
      <nav className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-ink">
        {/* Logo - left */}
        <Link href="/" className="tracking-[0.3em] text-sm font-normal">
          Maya
        </Link>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-[10px] tracking-[0.15em]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "Close" : "Menu"}
        </button>

        {/* Desktop nav right */}
        <div className="hidden lg:flex items-center gap-6">
          <Link
            href="/shop"
            className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
          >
            Contact
          </Link>
          <button
            onClick={toggleCart}
            className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
            aria-label="Open cart"
          >
            Cart{" "}
            <span className="inline-flex items-center justify-center w-4 h-4 border border-ink rounded-full text-[8px] ml-0.5" style={{ borderStyle: 'dotted' }}>
              {itemCount}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-ink px-4 py-4 space-y-3">
          <Link
            href="/shop"
            className="block text-[10px] tracking-[0.15em]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="block text-[10px] tracking-[0.15em]"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block text-[10px] tracking-[0.15em]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          <button
            onClick={() => { toggleCart(); setMobileMenuOpen(false); }}
            className="block text-[10px] tracking-[0.15em]"
          >
            Cart {itemCount}
          </button>
        </div>
      )}
    </header>
  );
}
