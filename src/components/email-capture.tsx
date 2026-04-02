"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center" }}>
        <p>Welcome to MAYA. Check your inbox for 10% off.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="email-capture"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        required
        className="email-capture-input"
      />
      <button type="submit" className="button email-capture-button">
        Subscribe
        <svg className="button-border" viewBox="0 0 200 50" preserveAspectRatio="none">
          <rect width="198" height="48" x="1" y="1" rx="0" ry="0" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="2" />
        </svg>
      </button>

      <style jsx>{`
        .email-capture {
          display: flex;
          gap: 1rem;
          width: 100%;
          max-width: 30rem;
          margin: 0 auto;
        }
        .email-capture-input {
          flex: 1;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--black);
          padding: 0.714rem 0;
          outline: none;
          font: inherit;
          text-transform: uppercase;
          letter-spacing: inherit;
          color: inherit;
        }
        .email-capture-input::placeholder {
          color: currentColor;
          opacity: 0.5;
        }
        .email-capture-button {
          flex-shrink: 0;
          font-size: 1rem;
        }
      `}</style>
    </form>
  );
}
