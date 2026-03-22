"use client";

import { useCart } from "@/context/cart-context";
import Image from "next/image";
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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-cream z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <h2 className="font-mono text-sm tracking-widest uppercase">
              Cart ({itemCount})
            </h2>
            <button
              onClick={closeCart}
              className="text-ink-muted hover:text-ink transition-colors"
              aria-label="Close cart"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-ink-muted text-sm mb-4">
                  Your cart is empty
                </p>
                <a
                  href="/shop"
                  onClick={closeCart}
                  className="font-mono text-xs tracking-widest uppercase border-b border-ink pb-0.5 hover:text-ink-muted transition-colors"
                >
                  Continue Shopping
                </a>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li
                    key={
                      item.isSubscription
                        ? `${item.variantId}-sub`
                        : item.variantId
                    }
                    className="flex gap-4"
                  >
                    <div className="w-20 h-20 bg-cream-dark flex-shrink-0 relative overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium leading-tight truncate">
                        {item.title}
                      </h3>
                      {item.variantTitle !== "Default Title" && (
                        <p className="text-xs text-ink-muted mt-0.5">
                          {item.variantTitle}
                        </p>
                      )}
                      {item.isSubscription && (
                        <p className="text-xs text-ink-muted mt-0.5">
                          Subscribe & Save
                        </p>
                      )}
                      <p className="font-mono text-sm mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-xs hover:bg-cream-dark transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-7 h-7 flex items-center justify-center text-xs font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="w-7 h-7 flex items-center justify-center text-xs hover:bg-cream-dark transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-xs text-ink-muted hover:text-ink transition-colors font-mono tracking-wide uppercase"
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
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm tracking-widest uppercase">
                  Subtotal
                </span>
                <span className="font-mono text-sm">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {subtotal >= 75 && (
                <p className="text-xs text-ink-muted text-center">
                  You qualify for free shipping
                </p>
              )}
              {subtotal > 0 && subtotal < 75 && (
                <p className="text-xs text-ink-muted text-center">
                  ${(75 - subtotal).toFixed(2)} away from free shipping
                </p>
              )}
              <button className="w-full bg-ink text-cream py-3.5 font-mono text-xs tracking-widest uppercase hover:bg-accent transition-colors">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
