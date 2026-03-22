"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // In production, integrate with Klaviyo/Mailchimp here
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <p className="font-mono text-sm tracking-wide">
          Welcome to MAYA. Check your inbox for 10% off.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
        className="flex-1 bg-transparent border-b border-ink py-2.5 font-mono text-sm tracking-wide placeholder:text-ink-muted focus:outline-none"
      />
      <button
        type="submit"
        className="bg-ink text-cream px-8 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-accent transition-colors shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
