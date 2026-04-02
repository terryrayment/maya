"use client";

import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="footer">
      {/* Newsletter title (mobile only) */}
      <div className="footer-newsletter-title">
        Join the community.
      </div>

      {/* Newsletter bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
        className="footer-newsletter"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="footer-newsletter-input"
        />
        <button type="submit" className="footer-newsletter-submit">
          <span>Join the community</span>
          <i className="footer-newsletter-arrow">&rarr;</i>
        </button>
      </form>

      {/* Bottom bar */}
      <div className="footer-end">
        <p>
          &copy; 2026 Maya &middot; All Furs &middot; Todos Pieles &middot;{" "}
          <a href="https://officeb.org" target="_blank" rel="noopener noreferrer">
            Credits
          </a>
        </p>
        <div className="footer-menu">
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/shipping">Shipping &amp; Returns</Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>

      <style jsx>{`
        .footer {
          padding-bottom: 1.4285714285714286rem;
        }
        @media (min-width: 768px) {
          .footer {
            padding-bottom: 0.9285714285714286rem;
          }
        }
        .footer-newsletter-title {
          margin-bottom: 0.5714285714285714rem;
          padding: 0 var(--side-padding);
          font-size: 1.1428571428571428rem;
          letter-spacing: 0.01em;
        }
        @media (min-width: 768px) {
          .footer-newsletter-title {
            display: none;
          }
        }

        .footer-newsletter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 3.642857142857143rem;
          padding: 1px 0;
          background:
            linear-gradient(to right, black 50%, transparent 50%) top,
            linear-gradient(to right, black 50%, transparent 50%) bottom;
          background-size: 4px 1px;
          background-repeat: repeat-x;
          background-position: 0 0, 0 100%;
        }
        @media (max-width: 767px) {
          .footer-newsletter {
            margin: 0 var(--side-padding) 2rem;
          }
        }
        @media (min-width: 768px) {
          .footer-newsletter {
            height: 5.428571428571429rem;
            margin-bottom: 0.857rem;
            font-size: 2.142857142857143rem;
          }
        }

        .footer-newsletter-input {
          height: 100%;
          background: none;
          border: none;
          outline: none;
          color: inherit;
          font: inherit;
          text-transform: inherit;
          letter-spacing: inherit;
          padding-left: var(--side-padding);
        }
        .footer-newsletter-input::placeholder {
          color: currentColor;
          transition: opacity 0.15s;
        }
        @media (max-width: 767px) {
          .footer-newsletter-input::placeholder {
            opacity: 0.5;
          }
          .footer-newsletter-input {
            padding-left: 0;
          }
        }
        @media (min-width: 768px) {
          .footer-newsletter-input {
            max-width: 40vw;
          }
        }
        @media (min-width: 1024px) {
          .footer-newsletter-input {
            min-width: 20em;
          }
        }

        .footer-newsletter-submit {
          display: flex;
          align-items: center;
          gap: 0.5em;
          padding-right: var(--side-padding);
          white-space: nowrap;
        }
        @media (max-width: 767px) {
          .footer-newsletter-submit {
            padding-left: 2.142857142857143rem;
            padding-right: 0;
          }
          .footer-newsletter-submit span {
            display: none;
          }
        }
        .footer-newsletter-arrow {
          font-style: normal;
          transition: transform 0.2s;
        }
        @media (pointer: fine) {
          .footer-newsletter-submit:hover .footer-newsletter-arrow {
            transform: translateX(0.571rem);
          }
        }

        .footer-end {
          display: flex;
          padding: 0 var(--side-padding);
        }
        @media (max-width: 767px) {
          .footer-end {
            flex-direction: column-reverse;
          }
          .footer-end p:nth-child(2) {
            order: -1;
            margin-top: -1.4em;
            margin-left: auto;
          }
        }
        @media (min-width: 768px) {
          .footer-end {
            gap: 2.142857142857143rem;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .footer-end {
            font-size: 0.7857142857142857rem;
          }
        }
        .footer-end p {
          margin-bottom: 0;
        }
        .footer-end a:hover {
          text-decoration: underline;
        }

        .footer-menu {
          display: flex;
        }
        @media (max-width: 767px) {
          .footer-menu {
            flex-direction: column;
            gap: 0.5714285714285714rem;
            margin-bottom: 1.857rem;
          }
        }
        @media (min-width: 768px) {
          .footer-menu {
            gap: 1.4285714285714286rem;
            margin-left: auto;
          }
        }
        @media (min-width: 1024px) {
          .footer-menu {
            gap: inherit;
          }
        }
      `}</style>
    </footer>
  );
}
