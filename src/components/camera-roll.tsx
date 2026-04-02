"use client";

import Link from "next/link";

const PLACEHOLDER_COUNT = 20;

export function CameraRoll() {
  return (
    <section className="camera-roll">
      {/* Heading: @OFFICEOFMAYA */}
      <div className="camera-roll-title">
        <Link
          href="https://instagram.com/officeofmaya"
          target="_blank"
          rel="noopener noreferrer"
        >
          @officeofmaya
        </Link>
      </div>

      {/* Infinite scrolling row */}
      <div className="camera-roll-items">
        <div className="camera-roll-items-wrapper">
          {/* Duplicate items for infinite scroll effect */}
          {[...Array(2)].map((_, setIdx) =>
            Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div key={`${setIdx}-${i}`} className="camera-roll-item">
                <div className="camera-roll-item-placeholder">
                  {i + 1}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Giant MAYA logo below */}
      <div className="camera-roll-logo-wrapper">
        <svg
          className="camera-roll-logo"
          viewBox="0 0 1074.42 205.08"
        >
          <path
            fill="currentColor"
            d="M0 205.08V0h7.04l135.64 172.92L278.76 0h6.72v205.08h-5.04V11.04L146.12 183.32h-6.72L5.04 11.04v194.04H0Zm334.37 0 126.52-205.08h6.4l126.52 205.08h-5.68L465.09 5.04 341.97 205.08h-7.6Zm58.72-50.08 3.04-4.72h139.44l3.04 4.72H393.09Zm220.07 50.08V199.4l167.12-193.72h-164.4V0h172.4v5.68L621.16 199.4h169.04v5.68H613.16Zm280.77 0 126.52-205.08h6.4l126.52 205.08h-5.68L941.65 5.04 818.53 205.08h-7.6Zm58.72-50.08 3.04-4.72h139.44l3.04 4.72H952.65Z"
          />
        </svg>
      </div>

      <style jsx>{`
        .camera-roll {
          margin-bottom: 1.7857142857142858rem;
          padding-top: 3.9285714285714284rem;
        }
        @media (min-width: 768px) {
          .camera-roll {
            margin-bottom: 2.5rem;
            padding-top: 7.142857142857143rem;
          }
        }
        .camera-roll-title {
          margin-bottom: 1.0714285714285714rem;
          margin-left: var(--side-padding);
          line-height: 1;
          letter-spacing: 0.01em;
        }
        @media (min-width: 768px) {
          .camera-roll-title {
            margin-bottom: 2.5rem;
          }
        }
        .camera-roll-title :global(a:hover) {
          text-decoration: underline;
        }
        .camera-roll-items {
          overflow: hidden;
        }
        .camera-roll-items-wrapper {
          display: flex;
          width: fit-content;
          animation: scroll 40s linear infinite;
        }
        .camera-roll-item {
          width: 5.714285714285714rem;
          height: 5.714285714285714rem;
          margin-right: 0.2857142857142857rem;
          flex-shrink: 0;
          background-color: #e0ddd7;
        }
        @media (min-width: 768px) {
          .camera-roll-item {
            width: 10rem;
            height: 10rem;
            margin-right: 1.4285714285714286rem;
          }
        }
        .camera-roll-item-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.714rem;
          opacity: 0.2;
          user-select: none;
        }
        .camera-roll-logo-wrapper {
          padding: 0 var(--side-padding);
          margin-top: 1.5rem;
        }
        .camera-roll-logo {
          display: block;
          width: 100%;
        }
        @keyframes scroll {
          0% { transform: translate(0); }
          100% { transform: translate(-50%); }
        }
      `}</style>
    </section>
  );
}
