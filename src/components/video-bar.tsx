"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function VideoBar() {
  const [dismissed, setDismissed] = useState(false);
  const [inView, setInView] = useState(false);

  // Track whether the product slider is in view (video bar shows alongside slider)
  useEffect(() => {
    const checkSlider = () => {
      const slider = document.querySelector(".product-slider");
      if (!slider) return;
      const rect = slider.getBoundingClientRect();
      // Show when slider is at least partially visible
      setInView(rect.bottom > 0 && rect.top < window.innerHeight);
    };
    checkSlider();
    window.addEventListener("scroll", checkSlider, { passive: true });
    // Small delay to let slider mount
    const timer = setTimeout(checkSlider, 500);
    return () => {
      window.removeEventListener("scroll", checkSlider);
      clearTimeout(timer);
    };
  }, []);

  if (dismissed) return null;

  const isVisible = inView && !dismissed;

  return (
    <div className="video-bar">
      <div
        className="video-bar-box"
        style={{
          visibility: isVisible ? "visible" : "hidden",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.98)",
          transition: "visibility 0.3s, opacity 0.3s, transform 0.3s",
        }}
      >
        <Link
          href="https://vimeo.com/944612214"
          target="_blank"
          rel="noopener noreferrer"
          className="video-bar-box-link"
        >
          <div className="video-bar-box-image-wrapper">
            <img
              src="https://officeofmaya.com/cdn/shop/files/Monty-Pond-2520x1449_80a23225-9013-439a-9733-f731efb9e987.webp?v=1717127305&width=200"
              alt="A Portrait of My Dog"
              className="video-bar-box-image"
            />
          </div>
          <div>
            <div className="video-bar-box-title">
              <span className="video-bar-box-blink" />
              Watch Now
            </div>
            <div className="video-bar-box-desc">
              {'"A Portrait of My Dog"\nA Film by Danny Geritz'}
            </div>
          </div>
        </Link>
        <button
          className="video-bar-box-close"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          aria-label="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M1 1l8 8M9 1l-8 8" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .video-bar {
          position: relative;
          z-index: 5;
          height: 0;
          overflow: visible;
        }
        .video-bar-box {
          width: 24.857142857142858rem;
          height: 7.142857142857143rem;
          overflow: hidden;
          position: fixed;
          right: var(--side-padding);
          bottom: 9.285714285714286rem;
          background-color: var(--ivory);
          font-size: 1rem;
          z-index: 5;
        }
        .video-bar-box-link {
          display: flex;
          gap: 0.857rem;
          padding: 0.857rem 0.857rem 0;
          color: inherit;
          text-decoration: none;
        }
        .video-bar-box-image {
          width: 5.642857142857143rem;
          height: 5rem;
          object-fit: cover;
          border-radius: 0.357rem;
        }
        .video-bar-box-title {
          margin-top: 0.071rem;
          margin-bottom: 1.05em;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.714rem;
        }
        .video-bar-box-blink {
          display: inline-block;
          width: 0.71428571em;
          height: 0.71428571em;
          background-color: currentColor;
          pointer-events: none;
          animation: 1s blink step-end infinite;
        }
        .video-bar-box-desc {
          text-transform: none;
          white-space: pre-line;
          font-size: 0.857rem;
          line-height: 1.4;
        }
        .video-bar-box-close {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.4em 0.8em;
          cursor: pointer;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
