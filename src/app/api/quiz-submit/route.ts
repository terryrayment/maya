import { NextResponse } from "next/server";

/**
 * Quiz submission endpoint.
 *
 * Flow:
 *  1. Validate email
 *  2. If MAILERLITE_API_KEY is set, subscribe the user to the
 *     MAILERLITE_QUIZ_GROUP_ID group with their quiz answers as custom fields.
 *     Subscriber is added with status="active" to BYPASS double opt-in —
 *     the quiz itself IS the opt-in, and the active "MAYA - Quiz Welcome + 10% Off"
 *     automation will fire as the welcome email.
 *  3. Return ok regardless — the quiz still renders results even if email
 *     fails, so this is effectively fire-and-forget from the client
 *
 * CORS: This endpoint is called by the Shopify-hosted MAYA quiz on
 * officeofmaya.com (and the .myshopify.com preview domain), so we emit
 * permissive CORS headers and handle the OPTIONS preflight.
 *
 * Required env vars (set in .env.local and Vercel):
 *   MAILERLITE_API_KEY         — from mailerlite.com → Integrations → API
 *   MAILERLITE_QUIZ_GROUP_ID   — ID of the "MAYA Quiz Leads" group
 */

const formulaLabel = (f: string) =>
  ({
    allergy: "Allergy",
    digestive: "Digestive Care",
    joint: "Joint Care",
    skin_coat: "Skin & Coat",
  })[f] || f;

// Origins allowed to call this endpoint cross-origin. Add new domains here
// (e.g. preview themes) — anything else is rejected at the CORS layer.
const ALLOWED_ORIGINS = new Set([
  "https://officeofmaya.com",
  "https://www.officeofmaya.com",
  "https://officeofmaya.myshopify.com",
]);

function corsHeaders(origin: string | null) {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://officeofmaya.com";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    const { email, dogName, answers, scores } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Valid email required" },
        { status: 400, headers }
      );
    }

    const apiKey = process.env.MAILERLITE_API_KEY;
    const groupId = process.env.MAILERLITE_QUIZ_GROUP_ID;

    // Compute top formula for personalization in the email
    const topFormula =
      scores && typeof scores === "object"
        ? (Object.entries(scores) as [string, number][]).sort(
            (a, b) => b[1] - a[1]
          )[0]?.[0]
        : null;

    if (apiKey && groupId) {
      // Subscribe to MailerLite with status="active" to bypass the
      // account-wide double opt-in confirmation email (which is currently
      // branded as "San Bernardino Tax Sales" because this account hosts
      // multiple brands). The MAYA Quiz Welcome automation handles the
      // welcome email instead.
      const mlResponse = await fetch(
        "https://connect.mailerlite.com/api/subscribers",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            fields: {
              dog_name: dogName || "",
              quiz_top_formula: topFormula ? formulaLabel(topFormula) : "",
              quiz_answers: JSON.stringify(answers || {}),
            },
            groups: [groupId],
            status: "active",
          }),
        }
      );

      if (!mlResponse.ok) {
        const errText = await mlResponse.text();
        console.error("[quiz-submit] MailerLite error", mlResponse.status, errText);
        // Still return ok to the client — we don't want to block results
      } else {
        console.log("[quiz-submit] subscribed", email, "formula:", topFormula, "status:active");
      }
    } else {
      console.log(
        "[quiz-submit] MailerLite not configured — logging only",
        { email, dogName, topFormula }
      );
    }

    return NextResponse.json({ ok: true }, { headers });
  } catch (error) {
    console.error("[quiz-submit] error", error);
    return NextResponse.json({ ok: false }, { status: 500, headers });
  }
}
