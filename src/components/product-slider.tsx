"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import { vetSealImageClass } from "@/lib/product-images";

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
  const [footersVisible, setFootersVisible] = useState(true);
  const swiperRef = useRef<SwiperRef>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Track whether the slider section is in viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setFootersVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const slides = SLIDES.map((slide) => ({
    ...slide,
    image: productImages?.[slide.caption.toLowerCase()] || slide.image,
  }));

  const current = slides[activeIndex];

  return (
    <section className="product-slider" ref={sectionRef}>
      <Swiper
        ref={swiperRef}
        direction="vertical"
        modules={[Mousewheel, Keyboard]}
        mousewheel={{ forceToAxis: true }}
        keyboard
        speed={600}
        className="product-slider-swiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="product-slide">
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.caption}
                  fill
                  className={`product-slide-media ${vetSealImageClass(slide.image)}`}
                  sizes="100vmin"
                  priority={i === 0}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="product-slide-placeholder">
                  <span>{slide.caption}</span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop footer: 3-column grid */}
      <div
        className="product-slide-footer product-slide-footer--desktop"
        style={{ visibility: footersVisible ? "visible" : "hidden", opacity: footersVisible ? 1 : 0 }}
      >
        <div className="product-slider-footer-part">
          {activeIndex + 1}/4 {current?.category}
        </div>
        <div className="product-slider-footer-part">
          {current?.caption}
        </div>
        <div className="product-slider-footer-part">
          <Link href={current?.href || "/shop"} className="button">
            View
            <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
              <rect width="198" height="48" x="1" y="1" rx="0" ry="0" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile footer: flex between */}
      <div
        className="product-slide-footer product-slide-footer--mobile"
        style={{ visibility: footersVisible ? "visible" : "hidden", opacity: footersVisible ? 1 : 0 }}
      >
        <div>
          <div>{activeIndex + 1}/4</div>
          <div>{current?.category}</div>
        </div>
        <Link href={current?.href || "/shop"} className="button">
          View
          <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
            <rect width="198" height="48" x="1" y="1" rx="0" ry="0" />
          </svg>
        </Link>
      </div>

      <style jsx global>{`
        .product-slider {
          background-color: #fdfbf7;
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          position: relative;
        }
        @media (max-width: 767px) {
          .product-slider {
            height: 100svh;
          }
        }
        .product-slider-swiper {
          width: 100%;
          height: 100%;
        }
        .product-slider-swiper .swiper-wrapper {
          height: 100%;
        }
        .product-slider-swiper .swiper-slide {
          height: 100% !important;
        }
        .product-slide {
          height: 100vh;
          position: relative;
          scroll-snap-align: center;
        }
        .product-slide-media {
          --size: 100vmin;
          width: var(--size) !important;
          height: var(--size) !important;
          object-fit: cover;
          position: absolute !important;
          top: calc(50% - var(--size) / 2) !important;
          left: calc(50% - var(--size) / 2) !important;
        }
        @media (min-width: 768px) {
          .product-slide-media {
            --size: 80vmin;
          }
        }
        .product-slide-placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10vw;
          opacity: 0.08;
          user-select: none;
        }

        /* Footer bar */
        .product-slide-footer {
          position: fixed;
          right: var(--side-padding);
          bottom: var(--side-padding);
          left: var(--side-padding);
          z-index: 1;
          transition: visibility 0.3s, opacity 0.3s;
        }
        .product-slide-footer--desktop {
          display: none;
        }
        @media (min-width: 768px) {
          .product-slide-footer--desktop {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: center;
            font-size: 1.5rem;
          }
          .product-slide-footer--mobile {
            display: none;
          }
          .product-slider-footer-part:nth-child(2) {
            text-align: center;
          }
          .product-slider-footer-part:nth-child(3) {
            text-align: right;
          }
        }
        .product-slide-footer--mobile {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 1.1428571428571428rem;
          line-height: 1.3;
        }
        .product-slide-footer--mobile .button {
          min-width: 8.857142857142858rem;
        }

        .product-slide-footer .button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-width: 10.714285714285714rem;
          height: 3.5714285714285716rem;
          position: relative;
          user-select: none;
          letter-spacing: 0.01em;
          cursor: pointer;
        }
        .product-slide-footer .button-border {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .product-slide-footer .button-border rect {
          fill: none;
          stroke: var(--black);
          stroke-width: 1px;
          stroke-dasharray: 2px;
          animation: dash 0.35s infinite linear;
          animation-play-state: paused;
        }
        .product-slide-footer .button:hover .button-border rect {
          animation-play-state: running;
        }
      `}</style>
    </section>
  );
}
