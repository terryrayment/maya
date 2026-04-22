import { NextResponse } from "next/server";

/**
 * Quiz submission endpoint.
 *
 * Flow:
 *  1. Validate email
 *  2. If MAILERLITE_API_KEY is set, subscribe the user to the
 *     MAILERLITE_QUIZ_GROUP_ID group with their quiz answers as custom fields
 *  3. Return ok regardless — the quiz still renders results even if email
 *     fails, so this is effectively fire-and-forget from the client
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, dogName, answers, scores } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Valid email required" },
        { status: 400 }
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
      // Subscribe to MailerLite
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
            // Optional: suppress double opt-in email if quiz is the opt-in itself
            // status: "active",
          }),
        }
      );

      if (!mlResponse.ok) {
        const errText = await mlResponse.text();
        console.error("[quiz-submit] MailerLite error", mlResponse.status, errText);
        // Still return ok to the client — we don't want to block results
      }
    } else {
      console.log(
        "[quiz-submit] MailerLite not configured — logging only",
        { email, dogName, topFormula }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[quiz-submit] error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
