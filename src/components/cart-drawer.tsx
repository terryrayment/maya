"use client";

import { useCart } from "@/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
  } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#fdfbf7] z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-ink"
            style={{ borderStyle: "dotted" }}
          >
            <span className="text-[10px] tracking-[0.15em]">
              Cart {itemCount}
            </span>
            <span className="text-[10px] tracking-[0.3em]">
              Maya
            </span>
            <button
              onClick={closeCart}
              className="text-[10px] tracking-[0.15em] hover:opacity-50 transition-opacity"
              aria-label="Close cart"
            >
              Close
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-[10px] tracking-[0.15em] mb-4">
                  Your Cart is Empty.
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="text-[10px] tracking-[0.15em] border border-ink px-5 py-2 hover:bg-ink hover:text-[#fdfbf7] transition-colors"
                  style={{ borderStyle: "dotted" }}
                >
                  Go to Shop
                </Link>
              </div>
            ) : (
              <ul className="space-y-0">
                {items.map((item) => (
                  <li
                    key={
                      item.isSubscription
                        ? `${item.variantId}-sub`
                        : item.variantId
                    }
                    className="flex gap-4 py-4 border-b border-ink"
                    style={{ borderStyle: "dotted" }}
                  >
                    <div
                      className="w-[70px] h-[70px] bg-[#e8e4de] flex-shrink-0 relative overflow-hidden border border-ink"
                      style={{ borderStyle: "dotted" }}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="70px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[10px] tracking-[0.1em] leading-tight truncate">
                        {item.title}
                      </h3>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-[9px] tracking-[0.1em] opacity-50 mt-0.5">
                          {item.variantTitle}
                        </p>
                      )}
                      {item.isSubscription && (
                        <p className="text-[9px] tracking-[0.1em] opacity-50 mt-0.5">
                          Subscribe &amp; Save
                        </p>
                      )}
                      <p className="text-[10px] tracking-[0.1em] mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div
                          className="flex items-center border border-ink"
                          style={{ borderStyle: "dotted" }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-[10px] hover:bg-[#e8e4de] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-6 h-6 flex items-center justify-center text-[10px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center text-[10px] hover:bg-[#e8e4de] transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-[9px] tracking-[0.15em] opacity-50 hover:opacity-100 transition-opacity"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div
              className="border-t border-ink px-4 lg:px-6 py-4 space-y-3"
              style={{ borderStyle: "dotted" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.15em]">
                  Subtotal
                </span>
                <span className="text-[10px] tracking-[0.15em]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[9px] tracking-[0.1em] opacity-50 text-center">
                Shipping Calculated at Checkout.
              </p>
              <button
                className="w-full border border-ink py-3 text-[10px] tracking-[0.15em] hover:bg-ink hover:text-[#fdfbf7] transition-colors"
                style={{ borderStyle: "dotted" }}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
