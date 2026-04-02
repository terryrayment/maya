"use client";

import { useState, useEffect } from "react";

export function SplashIntro() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("maya-splash-dismissed")) {
      return;
    }
    setVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function dismiss() {
    setFading(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("maya-splash-dismissed", "1");
    }, 750);
  }

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      className="intro"
      style={{
        visibility: fading ? "hidden" : "visible",
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Background image */}
      <div className="intro-swiper">
        <img
          src="https://officeofmaya.com/cdn/shop/files/Monty-Pond-2520x1449_80a23225-9013-439a-9733-f731efb9e987.webp?v=1717127305&width=2200"
          alt=""
          className="intro-image"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
      </div>

      {/* "CLICK TO ENTER" text near top */}
      <div className="intro-inner">
        <div
          className="intro-title"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        >
          Click to Enter
        </div>
      </div>

      {/* Giant MAYA logo at bottom */}
      <svg
        className="intro-logo"
        viewBox="0 0 1074.42 205.08"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      >
        <path
          fill="currentColor"
          d="M0 205.08V0h7.04l135.64 172.92L278.76 0h6.72v205.08h-5.04V11.04L146.12 183.32h-6.72L5.04 11.04v194.04H0Zm334.37 0 126.52-205.08h6.4l126.52 205.08h-5.68L465.09 5.04 341.97 205.08h-7.6Zm58.72-50.08 3.04-4.72h139.44l3.04 4.72H393.09Zm220.07 50.08V199.4l167.12-193.72h-164.4V0h172.4v5.68L621.16 199.4h169.04v5.68H613.16Zm280.77 0 126.52-205.08h6.4l126.52 205.08h-5.68L941.65 5.04 818.53 205.08h-7.6Zm58.72-50.08 3.04-4.72h139.44l3.04 4.72H952.65Z"
        />
      </svg>

      <style jsx>{`
        .intro {
          width: 100%;
          height: 100vh;
          height: 100svh;
          overflow: hidden;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          background-color: var(--ivory);
          color: var(--ivory);
          user-select: none;
          cursor: pointer;
          transition: 0.75s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition-property: visibility, opacity;
          touch-action: none;
        }
        .intro * {
          pointer-events: none;
        }
        .intro-inner {
          display: flex;
          justify-content: center;
          width: 100%;
          height: 100vh;
          height: 100svh;
          padding-top: 1.4285714285714286rem;
          position: relative;
        }
        .intro-title {
          position: relative;
          z-index: 2;
          line-height: 1;
          transition: opacity 1s 1s;
        }
        .intro-swiper {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
        .intro-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          transition: opacity 1s;
        }
        .intro-logo {
          width: calc(100% - 1.4285714285714286rem * 2);
          margin: 0 auto;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1.4285714285714286rem;
          z-index: 3;
          transition: opacity 1s 1s;
        }
        @media (min-width: 768px) {
          .intro-logo {
            width: calc(100% - 2.142857142857143rem * 2);
          }
        }
      `}</style>
    </div>
  );
}
