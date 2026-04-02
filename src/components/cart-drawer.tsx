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
      {isOpen && (
        <div
          className="mini-cart-overlay"
          onClick={closeCart}
        />
      )}

      {/* Cart panel */}
      <div
        className="mini-cart"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-105%)",
        }}
      >
        {/* Header */}
        <div className="mini-cart-header">
          <div className="mini-cart-title">
            Cart ({itemCount})
          </div>
          <button className="mini-cart-close" onClick={closeCart} aria-label="Close cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="section-cart">
          {items.length === 0 ? (
            <div className="cart-empty-wrapper">
              <p>Your Cart is Empty.</p>
              <Link href="/shop" onClick={closeCart} className="button">
                Continue Shopping
                <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
                  <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div
                  key={item.isSubscription ? `${item.variantId}-sub` : item.variantId}
                  className="cart-item"
                >
                  <div className="cart-item-image">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="cart-item-img"
                        sizes="70px"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-title">{item.title}</div>
                    {item.variantTitle !== "Default Title" && (
                      <div className="cart-item-variant">{item.variantTitle}</div>
                    )}
                    {item.isSubscription && (
                      <div className="cart-item-variant">Subscribe &amp; Save</div>
                    )}
                    <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeItem(item.variantId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-footer-totals">
              <span>Subtotal</span>
              <span style={{ marginLeft: "auto" }}>${subtotal.toFixed(2)}</span>
            </div>
            <p className="cart-footer-note">
              Shipping Calculated at Checkout.
            </p>
            <button className="button cart-footer-button" style={{ width: "100%" }}>
              Checkout
              <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
                <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .mini-cart-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 10;
        }
        .mini-cart {
          width: 100%;
          height: auto;
          max-height: 100vh;
          overflow: auto;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 11;
          background-color: var(--ivory);
          transition: transform 0.5s var(--ease-out-quint, cubic-bezier(.23, 1, .32, 1));
        }
        .mini-cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem var(--side-padding);
          background: linear-gradient(to right, #000 50%, transparent 50%) bottom;
          background-size: 4px 1px;
          background-repeat: repeat-x;
        }
        @media (min-width: 1024px) {
          .mini-cart-header {
            height: 6.214rem;
            margin-bottom: 2.643rem;
            padding-bottom: 1.714rem;
            font-size: 1.5rem;
          }
        }
        .mini-cart-title {
          display: flex;
          align-items: center;
        }
        .mini-cart-close {
          display: flex;
          position: relative;
        }
        .mini-cart-close svg {
          width: 1.571rem;
          height: 1.571rem;
        }

        .section-cart {
          padding: 0 var(--side-padding);
        }
        .cart-empty-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 0;
          text-align: center;
          gap: 2rem;
        }
        .cart-items {
          display: flex;
          flex-direction: column;
        }
        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          background: linear-gradient(to right, #000 50%, transparent 50%) bottom;
          background-size: 4px 1px;
          background-repeat: repeat-x;
        }
        .cart-item-image {
          width: 3.857rem;
          height: 4.429rem;
          position: relative;
          flex-shrink: 0;
        }
        .cart-item-info {
          flex: 1;
          min-width: 0;
        }
        .cart-item-title {
          letter-spacing: 0.01em;
          margin-bottom: 0.3em;
        }
        .cart-item-variant {
          opacity: 0.5;
          font-size: 0.857rem;
          margin-bottom: 0.2em;
        }
        .cart-item-price {
          margin-top: 0.5em;
        }
        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.5em;
        }
        .cart-item-qty {
          display: inline-flex;
          align-items: center;
        }
        .cart-item-qty button {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-item-qty span {
          width: 2rem;
          text-align: center;
        }
        .cart-item-remove {
          opacity: 0.5;
          font-size: 0.857rem;
        }
        .cart-item-remove:hover {
          opacity: 1;
        }

        .cart-footer {
          margin-top: 6.429rem;
          padding: 0 var(--side-padding) 3rem;
        }
        @media (max-width: 1023px) {
          .cart-footer-button {
            width: 100%;
          }
        }
        .cart-footer-totals {
          display: flex;
          align-items: center;
          gap: 0.4em;
          margin-bottom: 1.071rem;
        }
        .cart-footer-note {
          margin-bottom: 2.5rem;
          text-transform: none;
          opacity: 0.5;
          text-align: center;
        }
      `}</style>
    </>
  );
}
