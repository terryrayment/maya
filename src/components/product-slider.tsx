"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";

type Slide = {
  number: number;
  category: string;
  caption: string;
  href: string;
  image: string | null;
};

const SLIDES: Slide[] = [
  {
    number: 1,
    category: "Grooming",
    caption: "Dog Brush",
    href: "/products/dog-brush",
    image: null,
  },
  {
    number: 2,
    category: "Wellness",
    caption: "Supplements",
    href: "/collections/wellness",
    image: null,
  },
  {
    number: 3,
    category: "Apparel",
    caption: "Apparel",
    href: "/collections/apparel",
    image: null,
  },
  {
    number: 4,
    category: "Gifts",
    caption: "Gift Card",
    href: "/products/maya-gift-card",
    image: null,
  },
];

export function ProductSlider({
  productImages,
}: {
  productImages?: Record<string, string>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperRef>(null);

  const slides = SLIDES.map((slide) => ({
    ...slide,
    image: productImages?.[slide.caption.toLowerCase()] || slide.image,
  }));

  return (
    <section className="relative w-full h-screen">
      <Swiper
        ref={swiperRef}
        direction="vertical"
        modules={[Mousewheel, Keyboard]}
        mousewheel={{ forceToAxis: true }}
        keyboard
        speed={600}
        className="h-full w-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative">
            <div className="h-full w-full bg-[#e8e4de] relative overflow-hidden">
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.caption}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-[12vw] lg:text-[8vw] tracking-[0.1em] opacity-10 select-none">
                    {slide.caption}
                  </span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom bar overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-ink bg-[#fdfbf7]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <span className="text-[10px] tracking-[0.15em]">
            {activeIndex + 1}/4 &mdash; {slides[activeIndex]?.category}
          </span>
          <span className="text-[10px] tracking-[0.15em] hidden sm:inline">
            {slides[activeIndex]?.caption}
          </span>
          <Link
            href={slides[activeIndex]?.href || "/shop"}
            className="text-[10px] tracking-[0.15em] border border-ink px-4 py-1.5 hover:bg-ink hover:text-[#fdfbf7] transition-colors"
            style={{ borderStyle: "dotted" }}
          >
            View
          </Link>
        </div>
      </div>
    </section>
  );
}
