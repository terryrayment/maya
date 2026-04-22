import { NextResponse } from "next/server";

/**
 * Quiz submission endpoint.
 *
 * For now, this just logs the submission. Wire up to MailerLite (or Shopify
 * customer tag) when ready. The quiz still renders results even if this fails,
 * so treating this as fire-and-forget is safe.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, dogName, answers, scores } = body ?? {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    // TODO: Forward to MailerLite group "MAYA Quiz Leads" with tag QUIZ10.
    // Example once wired:
    //   await fetch("https://connect.mailerlite.com/api/subscribers", {
    //     method: "POST",
    //     headers: {
    //       "Authorization": `Bearer ${process.env.MAILERLITE_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email,
    //       fields: { dog_name: dogName, quiz_answers: JSON.stringify(answers) },
    //       groups: [process.env.MAILERLITE_QUIZ_GROUP_ID],
    //     }),
    //   });

    console.log("[quiz-submit]", { email, dogName, answers, scores });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[quiz-submit] error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
