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
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="anc-banner">
      <div className="anc-banner-inner">
        {announcements.map((text, i) => (
          <div
            key={i}
            className="anc-banner-item"
            style={{
              visibility: i === index ? "visible" : "hidden",
              opacity: i === index ? 1 : 0,
            }}
          >
            <p>{text}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .anc-banner {
          width: 100%;
          height: var(--anc-banner-height);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9;
          background-color: var(--ivory);
          font-size: 1rem;
        }
        .anc-banner-inner {
          background: linear-gradient(to right, #000 50%, transparent 50%) bottom;
          background-size: 4px 1px;
          background-repeat: repeat-x;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
        }
        .anc-banner-item {
          width: 100%;
          padding: 0 var(--side-padding);
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.5s;
          transition-property: visibility, opacity;
        }
        .anc-banner-item p {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}

export function Header() {
  const { toggleCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <AnnouncementBar />
      <header className="header">
        {/* Desktop: full nav bar */}
        <div className="header-menu">
          {/* Logo - on desktop, this is the first menu item */}
          <div className="header-menu-item header-menu-item--logo">
            <Link href="/" className="header-menu-link">
              Maya
            </Link>
          </div>

          {/* Mobile: hamburger toggle */}
          <div className="header-menu-toggle-wrapper">
            <button
              className="header-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
          </div>

          {/* Mobile: centered logo */}
          <div className="header-logo-wrapper">
            <Link href="/">
              <span className="header-logo-text">Maya</span>
            </Link>
          </div>

          {/* Nav links */}
          <div className="header-menu-item header-menu-item--nav">
            <Link href="/shop" className="header-menu-link">
              Shop
            </Link>
          </div>
          <div className="header-menu-item header-menu-item--nav">
            <Link href="/quiz" className="header-menu-link">
              Quiz
            </Link>
          </div>
          <div className="header-menu-item header-menu-item--nav">
            <Link href="/about" className="header-menu-link">
              About
            </Link>
          </div>
          <div className="header-menu-item header-menu-item--nav">
            <Link href="/contact" className="header-menu-link">
              Contact
            </Link>
          </div>
          <div className="header-menu-item header-menu-item--cart">
            <button onClick={toggleCart} className="header-menu-link">
              Cart
              <span className="header-cart-count">
                <svg className="button-border" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect width="98" height="98" rx="50" ry="50" />
                </svg>
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="header-mobile-menu">
            <Link href="/shop" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Shop
            </Link>
            <Link href="/quiz" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Quiz
            </Link>
            <Link href="/about" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="header-mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <button onClick={() => { toggleCart(); setMobileMenuOpen(false); }} className="header-mobile-link">
              Cart ({itemCount})
            </button>
          </div>
        )}

        <style jsx>{`
          .header {
            width: 100%;
            position: fixed;
            top: var(--anc-banner-height);
            left: 0;
            z-index: 10;
            transition: top 0.5s;
          }
          .header::before {
            content: "";
            width: 100%;
            height: 4rem;
            background: var(--ivory);
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
            box-shadow: 0 0.714rem 0.714rem var(--ivory);
          }
          .header-menu {
            display: flex;
            justify-content: space-between;
            line-height: 1;
            pointer-events: all;
          }
          .header-menu-link {
            position: relative;
            letter-spacing: 0.01em;
            color: inherit;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
          }

          /* Mobile layout (<1024px) */
          @media (max-width: 1023px) {
            .header {
              display: flex;
              align-items: center;
              padding: 1.5rem var(--side-padding) 0;
            }
            .header-menu {
              width: 100%;
              align-items: center;
            }
            .header-menu-toggle-wrapper {
              width: 35%;
            }
            .header-logo-wrapper {
              flex: 1;
              text-align: center;
            }
            .header-logo-text {
              font-size: inherit;
              letter-spacing: 0.01em;
            }
            .header-menu-item--logo {
              display: none;
            }
            .header-menu-item--nav {
              display: none;
            }
            .header-menu-item--cart {
              width: 35%;
              display: flex;
              justify-content: flex-end;
            }
          }

          /* Desktop layout (>=1024px) */
          @media (min-width: 1024px) {
            .header {
              padding-top: 1.4285714285714286rem;
              pointer-events: none;
            }
            .header::before {
              height: 4.357142857142857rem;
              box-shadow: 0 1.0714285714285714rem 1.0714285714285714rem var(--ivory);
            }
            .header-menu-toggle-wrapper {
              display: none;
            }
            .header-logo-wrapper {
              display: none;
            }
            .header-menu {
              padding: 0 var(--side-padding);
              font-size: 1.5rem;
            }
            .header-menu-item--logo {
              margin-right: auto;
            }
            .header-menu-item--nav,
            .header-menu-item--cart {
              margin-left: 2.5rem;
            }
          }

          .header-menu-toggle {
            position: relative;
            letter-spacing: 0.01em;
          }

          .header-cart-count {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            min-width: 1.5rem;
            margin-left: 0.357rem;
            height: 1.5rem;
            position: relative;
            font-size: 0.857em;
            line-height: 1.5rem;
          }
          @media (min-width: 1024px) {
            .header-cart-count {
              min-width: 2.2857142857142856rem;
              height: 2.2857142857142856rem;
              margin-left: 0.714rem;
              font-size: 0.857em;
              line-height: 2.2857142857142856rem;
            }
          }

          .header-cart-count :global(.button-border) {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
          }
          .header-cart-count :global(.button-border rect) {
            fill: none;
            stroke: var(--black);
            stroke-width: 1px;
            stroke-dasharray: 2px;
            animation: dash 0.35s infinite linear;
            animation-play-state: paused;
          }
          .header-menu-link:hover .header-cart-count :global(.button-border rect) {
            animation-play-state: running;
          }

          .header-mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: var(--black);
            color: var(--ivory);
            z-index: 11;
            display: flex;
            flex-direction: column;
            padding: 6rem var(--side-padding);
            gap: 1.5rem;
            font-size: 2rem;
          }
          @media (min-width: 1024px) {
            .header-mobile-menu {
              display: none;
            }
          }
          .header-mobile-link {
            color: inherit;
            text-decoration: none;
            letter-spacing: 0.01em;
          }

          @keyframes dash {
            to {
              stroke-dashoffset: -4px;
            }
          }
        `}</style>
      </header>
    </>
  );
}
