"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";

// ---- Types ----

type QuizProduct = {
  id: string;
  handle: string;
  title: string;
  price: string;
  currencyCode: string;
  image: string;
  variantId: string;
  tags: string[];
};

type BundleProduct = Omit<QuizProduct, "tags">;
type Bundle = BundleProduct | null;

type Props = {
  products: QuizProduct[];
  bundle: Bundle;
};

// Formula keys our recommendation engine scores against
type Formula = "allergy" | "digestive" | "joint" | "skin_coat";

type Question = {
  id: string;
  prompt: string;
  subtitle?: string;
  options: {
    label: string;
    value: string;
    scores: Partial<Record<Formula, number>>;
  }[];
};

// ---- Questions ----

const QUESTIONS: Question[] = [
  {
    id: "age",
    prompt: "How old is your dog?",
    options: [
      { label: "Puppy (under 1 year)", value: "puppy", scores: { digestive: 2, skin_coat: 1 } },
      { label: "Adult (1-7 years)", value: "adult", scores: { skin_coat: 1, allergy: 1 } },
      { label: "Senior (7+ years)", value: "senior", scores: { joint: 3, skin_coat: 1 } },
    ],
  },
  {
    id: "breed",
    prompt: "What kind of dog do you have?",
    subtitle: "We use this to tailor the recommendation — breeds have different tendencies.",
    options: [
      {
        label: "Flat-faced breed (Frenchie, Pug, Bulldog)",
        value: "flat_faced",
        scores: { allergy: 3, skin_coat: 2 },
      },
      {
        label: "Large breed (Golden, Lab, Shepherd, Mastiff)",
        value: "large",
        scores: { joint: 3, skin_coat: 1 },
      },
      {
        label: "Small breed (Chihuahua, Dachshund, Terrier)",
        value: "small",
        scores: { joint: 2, skin_coat: 1 },
      },
      { label: "Mixed / Other", value: "mixed", scores: { allergy: 1, digestive: 1, skin_coat: 1 } },
    ],
  },
  {
    id: "concerns",
    prompt: "What's your dog's biggest issue right now?",
    subtitle: "Pick the one that's bothering them most.",
    options: [
      {
        label: "Itching, scratching, hot spots",
        value: "itching",
        scores: { allergy: 4, skin_coat: 2 },
      },
      {
        label: "Upset stomach, gas, loose stool",
        value: "digestive",
        scores: { digestive: 4 },
      },
      {
        label: "Stiff joints, slow on walks",
        value: "joints",
        scores: { joint: 4 },
      },
      {
        label: "Dull coat, excessive shedding",
        value: "coat",
        scores: { skin_coat: 4 },
      },
      {
        label: "Nothing major — just preventive care",
        value: "preventive",
        scores: { allergy: 1, digestive: 1, joint: 1, skin_coat: 1 },
      },
    ],
  },
  {
    id: "diet",
    prompt: "What do you feed your dog?",
    options: [
      { label: "Kibble", value: "kibble", scores: { digestive: 2, skin_coat: 1 } },
      { label: "Fresh or raw", value: "fresh", scores: { skin_coat: 1 } },
      { label: "Home-cooked", value: "cooked", scores: { digestive: 1, skin_coat: 1 } },
      { label: "A mix of everything", value: "mixed", scores: { digestive: 1 } },
    ],
  },
  {
    id: "activity",
    prompt: "How active is your dog?",
    options: [
      {
        label: "Very active — hikes, runs, agility",
        value: "high",
        scores: { joint: 3, skin_coat: 1 },
      },
      {
        label: "Moderate — daily walks",
        value: "moderate",
        scores: { joint: 1, allergy: 1 },
      },
      {
        label: "Low — short walks, lots of naps",
        value: "low",
        scores: { joint: 2, digestive: 1 },
      },
    ],
  },
];

// ---- Helpers ----

function matchFormula(product: QuizProduct, formula: Formula): boolean {
  const h = product.handle.toLowerCase();
  const t = product.title.toLowerCase();
  const tags = product.tags.map((x) => x.toLowerCase()).join(" ");
  const hay = `${h} ${t} ${tags}`;

  if (formula === "allergy") return hay.includes("allerg");
  if (formula === "digestive") return hay.includes("digest") || hay.includes("gut");
  if (formula === "joint") return hay.includes("joint") || hay.includes("mobility");
  if (formula === "skin_coat")
    return hay.includes("skin") || hay.includes("coat") || hay.includes("fur");
  return false;
}

function formatPrice(amount: string, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}

// ---- Component ----

export function QuizClient({ products, bundle }: Props) {
  const { addItem, openCart } = useCart();

  const [step, setStep] = useState(0); // 0..QUESTIONS.length (last is email gate)
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<Formula, number>>({
    allergy: 0,
    digestive: 0,
    joint: 0,
    skin_coat: 0,
  });
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [dogName, setDogName] = useState("");

  const totalSteps = QUESTIONS.length + 1; // +1 for email gate
  const progressPct = Math.round((step / totalSteps) * 100);

  const onAnswer = (question: Question, optionValue: string) => {
    const option = question.options.find((o) => o.value === optionValue);
    if (!option) return;

    setAnswers((prev) => ({ ...prev, [question.id]: optionValue }));

    setScores((prev) => {
      const next = { ...prev };
      for (const [formula, delta] of Object.entries(option.scores)) {
        const f = formula as Formula;
        next[f] = (next[f] || 0) + (delta || 0);
      }
      return next;
    });

    setTimeout(() => setStep((s) => s + 1), 180);
  };

  const onEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Fire-and-forget: send to subscribe endpoint if one exists later
    try {
      await fetch("/api/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, dogName, answers, scores }),
      });
    } catch {
      // Silent fail — we still want to show results
    }

    setEmailSubmitted(true);
    setStep((s) => s + 1);
  };

  // ---- Recommendations ----

  const recommendations = useMemo(() => {
    if (!emailSubmitted) return { top: null, secondary: [] as QuizProduct[], ranked: [] as Array<{ formula: Formula; score: number }> };

    const ranked = (Object.entries(scores) as [Formula, number][])
      .sort((a, b) => b[1] - a[1]);

    const topFormula = ranked[0][0];
    const topProduct = products.find((p) => matchFormula(p, topFormula)) || null;

    const secondary = ranked
      .slice(1, 3)
      .map(([formula]) => products.find((p) => matchFormula(p, formula)))
      .filter((p): p is QuizProduct => !!p && p.id !== topProduct?.id);

    return { top: topProduct, secondary, ranked };
  }, [emailSubmitted, scores, products]);

  const addAllToCart = () => {
    const toAdd = [recommendations.top, ...recommendations.secondary].filter(
      (p): p is QuizProduct => !!p
    );
    for (const p of toAdd) {
      if (!p.variantId) continue;
      addItem({
        variantId: p.variantId,
        productId: p.id,
        title: p.title,
        variantTitle: "",
        price: parseFloat(p.price),
        quantity: 1,
        image: p.image,
        handle: p.handle,
      });
    }
    openCart();
  };

  const addBundleToCart = () => {
    if (!bundle?.variantId) return;
    addItem({
      variantId: bundle.variantId,
      productId: bundle.id,
      title: bundle.title,
      variantTitle: "",
      price: parseFloat(bundle.price),
      quantity: 1,
      image: bundle.image,
      handle: bundle.handle,
    });
    openCart();
  };

  const addSingleToCart = (p: QuizProduct) => {
    if (!p.variantId) return;
    addItem({
      variantId: p.variantId,
      productId: p.id,
      title: p.title,
      variantTitle: "",
      price: parseFloat(p.price),
      quantity: 1,
      image: p.image,
      handle: p.handle,
    });
    openCart();
  };

  // ---- Render ----

  // Results screen
  if (emailSubmitted && step >= totalSteps) {
    return (
      <div className="quiz-root">
        <div className="quiz-container">
          <div className="quiz-results">

            {/* Header */}
            <p className="quiz-eyebrow">Your recommendation</p>
            <h1 className="quiz-results-title">
              {dogName ? `${dogName}'s formula` : "Your dog's formula"}
            </h1>
            <p className="quiz-results-subtitle">
              Based on your answers, here&apos;s where we&apos;d start.
            </p>

            {/* Top recommendation */}
            {recommendations.top && (
              <div className="quiz-top-rec">
                <div className="quiz-top-rec-image">
                  {recommendations.top.image && (
                    <Image
                      src={recommendations.top.image}
                      alt={recommendations.top.title}
                      width={500}
                      height={500}
                      className="quiz-product-image"
                    />
                  )}
                </div>
                <div className="quiz-top-rec-info">
                  <p className="quiz-eyebrow" style={{ marginBottom: "1.25rem" }}>Best match</p>
                  <h2 className="quiz-product-title">
                    {recommendations.top.title}
                  </h2>
                  <p className="quiz-product-price">
                    {formatPrice(
                      recommendations.top.price,
                      recommendations.top.currencyCode
                    )}
                  </p>
                  <button
                    className="quiz-btn-primary"
                    onClick={() => recommendations.top && addSingleToCart(recommendations.top)}
                  >
                    Add to cart
                  </button>
                  <Link
                    href={`/products/${recommendations.top.handle}`}
                    className="quiz-link"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            )}

            {/* Secondary recommendations */}
            {recommendations.secondary.length > 0 && (
              <div className="quiz-secondary">
                <p className="quiz-eyebrow" style={{ marginBottom: "1.25rem" }}>Also recommended</p>
                <div className="quiz-secondary-grid">
                  {recommendations.secondary.map((p) => (
                    <div key={p.id} className="quiz-secondary-card">
                      {p.image && (
                        <div className="quiz-secondary-image-wrap">
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={200}
                            height={200}
                            className="quiz-secondary-image"
                          />
                        </div>
                      )}
                      <p className="quiz-secondary-title">{p.title}</p>
                      <p className="quiz-secondary-price">
                        {formatPrice(p.price, p.currencyCode)}
                      </p>
                      <button
                        className="quiz-btn-ghost"
                        onClick={() => addSingleToCart(p)}
                      >
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bundle */}
            {bundle && (
              <div className="quiz-bundle">
                <div className="quiz-bundle-inner">
                  <div>
                    <p className="quiz-eyebrow" style={{ marginBottom: "0.5rem" }}>The full system</p>
                    <h3 className="quiz-bundle-title">{bundle.title}</h3>
                    <p className="quiz-bundle-desc">
                      All four formulas. Our best price.
                    </p>
                  </div>
                  <div className="quiz-bundle-right">
                    <p className="quiz-bundle-price">
                      {formatPrice(bundle.price, bundle.currencyCode)}
                    </p>
                    <button className="quiz-btn-primary" onClick={addBundleToCart}>
                      Add bundle
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="quiz-footer">
              <p className="quiz-footer-code">QUIZ10</p>
              <p className="quiz-footer-text">
                10% off your first order — sent to {email}
              </p>
            </div>

          </div>
        </div>
        <QuizStyles />
      </div>
    );
  }

  // Email gate
  if (step === QUESTIONS.length) {
    return (
      <div className="quiz-root">
        <div className="quiz-container">
          <div className="quiz-progress">
            <div
              className="quiz-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <form className="quiz-question" onSubmit={onEmailSubmit}>
            <p className="quiz-eyebrow">ALMOST DONE</p>
            <h1 className="quiz-prompt">Where should we send the results?</h1>
            <p className="quiz-subtitle">
              We&apos;ll email your personalized recommendation, plus a 10% off code
              for your first order.
            </p>
            <div className="quiz-inputs">
              <input
                className="quiz-input"
                type="text"
                placeholder="Your dog's name (optional)"
                value={dogName}
                onChange={(e) => setDogName(e.target.value)}
              />
              <input
                className="quiz-input"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="quiz-btn-primary" type="submit">
                See my recommendation
              </button>
            </div>
            <p className="quiz-fine">
              We&apos;ll never share your email. Unsubscribe any time.
            </p>
          </form>
        </div>
        <QuizStyles />
      </div>
    );
  }

  // Question
  const currentQuestion = QUESTIONS[step];

  return (
    <div className="quiz-root">
      <div className="quiz-container">
        <div className="quiz-progress">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="quiz-question">
          <p className="quiz-eyebrow">
            QUESTION {step + 1} OF {QUESTIONS.length}
          </p>
          <h1 className="quiz-prompt">{currentQuestion.prompt}</h1>
          {currentQuestion.subtitle && (
            <p className="quiz-subtitle">{currentQuestion.subtitle}</p>
          )}
          <div className="quiz-options">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt.value}
                className={`quiz-option ${
                  answers[currentQuestion.id] === opt.value
                    ? "quiz-option-selected"
                    : ""
                }`}
                onClick={() => onAnswer(currentQuestion, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              className="quiz-back"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              ← Back
            </button>
          )}
        </div>
      </div>
      <QuizStyles />
    </div>
  );
}

function QuizStyles() {
  return (
    <style>{`
      .quiz-root {
        min-height: 80vh;
        padding: 8rem var(--side-padding, 1.5rem) 4rem;
        background: var(--ivory, #fdfbf7);
      }
      @media (min-width: 768px) {
        .quiz-root {
          padding-top: 10rem;
        }
      }
      .quiz-container {
        max-width: 640px;
        margin: 0 auto;
      }
      .quiz-progress {
        height: 2px;
        background: rgba(0, 0, 0, 0.08);
        margin-bottom: 3rem;
        overflow: hidden;
      }
      .quiz-progress-fill {
        height: 100%;
        background: #1a1a1a;
        transition: width 300ms ease;
      }
      .quiz-eyebrow {
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        opacity: 0.5;
        margin-bottom: 0.75rem;
      }
      .quiz-prompt {
        font-size: 1.75rem;
        line-height: 1.2;
        font-weight: 400;
        margin-bottom: 0.75rem;
      }
      .quiz-subtitle {
        opacity: 0.6;
        margin-bottom: 2rem;
        line-height: 1.5;
      }
      .quiz-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 2rem;
      }
      .quiz-option {
        text-align: left;
        padding: 1.25rem 1.5rem;
        border: 1px dotted rgba(0, 0, 0, 0.25);
        background: transparent;
        cursor: pointer;
        font-size: 1rem;
        font-family: inherit;
        transition: all 150ms ease;
      }
      .quiz-option:hover {
        border-color: rgba(0, 0, 0, 0.6);
        background: rgba(0, 0, 0, 0.02);
      }
      .quiz-option-selected {
        border-color: #1a1a1a;
        background: #1a1a1a;
        color: #fdfbf7;
      }
      .quiz-back {
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.875rem;
        opacity: 0.5;
        padding: 0.5rem 0;
      }
      .quiz-back:hover { opacity: 1; }
      .quiz-inputs {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 1.5rem 0 1rem;
      }
      .quiz-input {
        padding: 1rem 1.25rem;
        border: 1px dotted rgba(0, 0, 0, 0.25);
        background: transparent;
        font-size: 1rem;
        font-family: inherit;
      }
      .quiz-input:focus {
        outline: none;
        border-color: #1a1a1a;
      }
      .quiz-btn-primary {
        padding: 1rem 1.5rem;
        background: #1a1a1a;
        color: #fdfbf7;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.875rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        transition: opacity 150ms ease;
      }
      .quiz-btn-primary:hover { opacity: 0.85; }
      .quiz-btn-secondary {
        padding: 1rem 1.5rem;
        background: transparent;
        color: #1a1a1a;
        border: 1px dotted rgba(0, 0, 0, 0.5);
        cursor: pointer;
        font-family: inherit;
        font-size: 0.875rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-top: 1rem;
        width: 100%;
      }
      .quiz-btn-secondary:hover {
        background: #1a1a1a;
        color: #fdfbf7;
      }
      .quiz-btn-ghost {
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px dotted rgba(0, 0, 0, 0.3);
        cursor: pointer;
        font-family: inherit;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .quiz-btn-ghost:hover {
        background: #1a1a1a;
        color: #fdfbf7;
      }
      .quiz-link {
        display: inline-block;
        margin-top: 0.75rem;
        font-size: 0.875rem;
        opacity: 0.6;
        text-decoration: underline;
      }
      .quiz-fine {
        font-size: 0.75rem;
        opacity: 0.5;
        margin-top: 1rem;
      }
      /* ---- Results ---- */
      .quiz-results-title {
        font-size: 2.25rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
        line-height: 1.1;
      }
      .quiz-results-subtitle {
        opacity: 0.5;
        margin-bottom: 2.5rem;
        font-size: 0.875rem;
      }

      /* Top recommendation */
      .quiz-top-rec {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        padding-top: 2.5rem;
        border-top: 1px dotted rgba(0,0,0,0.15);
        margin-bottom: 3rem;
      }
      @media (min-width: 600px) {
        .quiz-top-rec {
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
      }
      .quiz-top-rec-image {
        background: #f5f2ed;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .quiz-product-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .quiz-top-rec-info {
        display: flex;
        flex-direction: column;
        padding-top: 0.5rem;
      }
      .quiz-product-title {
        font-size: 1.375rem;
        font-weight: 400;
        margin-bottom: 0.5rem;
        line-height: 1.2;
      }
      .quiz-product-price {
        font-size: 1rem;
        opacity: 0.6;
        margin-bottom: 2rem;
      }

      /* Secondary recommendations */
      .quiz-secondary {
        padding-top: 2.5rem;
        border-top: 1px dotted rgba(0,0,0,0.15);
        margin-bottom: 3rem;
      }
      .quiz-secondary-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .quiz-secondary-card {
        display: flex;
        flex-direction: column;
      }
      .quiz-secondary-image-wrap {
        background: #f5f2ed;
        aspect-ratio: 1;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .quiz-secondary-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .quiz-secondary-title {
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
        line-height: 1.3;
      }
      .quiz-secondary-price {
        font-size: 0.875rem;
        opacity: 0.5;
        margin-bottom: 1rem;
      }

      /* Bundle */
      .quiz-bundle {
        padding-top: 2.5rem;
        border-top: 1px dotted rgba(0,0,0,0.15);
        margin-bottom: 3rem;
      }
      .quiz-bundle-inner {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      @media (min-width: 600px) {
        .quiz-bundle-inner {
          flex-direction: row;
          align-items: flex-end;
          justify-content: space-between;
        }
      }
      .quiz-bundle-right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        flex-shrink: 0;
      }
      @media (min-width: 600px) {
        .quiz-bundle-right { align-items: flex-end; }
      }
      .quiz-bundle-title {
        font-size: 1.125rem;
        font-weight: 400;
        margin-bottom: 0.25rem;
      }
      .quiz-bundle-desc {
        font-size: 0.875rem;
        opacity: 0.5;
      }
      .quiz-bundle-price {
        font-size: 1rem;
        opacity: 0.6;
      }

      /* Footer / discount */
      .quiz-footer {
        padding: 2.5rem 0 1rem;
        border-top: 1px dotted rgba(0,0,0,0.15);
      }
      .quiz-footer-code {
        font-size: 1.75rem;
        letter-spacing: 0.15em;
        margin-bottom: 0.5rem;
      }
      .quiz-footer-text {
        font-size: 0.8rem;
        opacity: 0.45;
        letter-spacing: 0.05em;
      }
    `}</style>
  );
}
