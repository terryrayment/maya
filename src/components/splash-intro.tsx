"use client";

import { useState, useEffect } from "react";

export function SplashIntro() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem("maya-splash-dismissed")) {
      return;
    }
    setVisible(true);
    // Lock body scroll
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
    }, 600);
  }

  if (!visible) return null;

  return (
    <div
      onClick={dismiss}
      className="fixed inset-0 z-50 cursor-pointer flex flex-col items-center justify-between"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease-out",
        backgroundColor: "#0a0a0a",
        backgroundImage:
          "url(https://cdn.shopify.com/s/files/1/0915/2576/4750/files/MAYA_DOG_HERO_BW.jpg?v=1719522000)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-16 lg:py-24">
        {/* Top: Click to Enter */}
        <div className="mt-12">
          <p className="text-[10px] tracking-[0.3em] text-white/80">
            Click to Enter
          </p>
        </div>

        {/* Center: spacer */}
        <div className="flex-1" />

        {/* Bottom: Giant MAYA */}
        <div className="w-full px-4 lg:px-6 pb-8">
          <div className="font-display text-[22vw] lg:text-[20vw] leading-[0.85] tracking-[0.05em] text-white select-none">
            MAYA
          </div>
        </div>
      </div>
    </div>
  );
}
