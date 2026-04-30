# MAYA Quiz — Deployment & Smoke Test Checklist

The quiz subscription flow was rewritten to bypass the shared MailerLite
account's "San Bernardino Tax Sales" double-opt-in confirmation email. Use
this checklist after every deploy that touches `page.quiz.liquid` or
`/api/quiz-submit/route.ts`.

## How the new flow works

1. User completes the Shopify Liquid quiz at `/pages/quiz`
2. Browser POSTs JSON to `https://<NEXT_JS_DOMAIN>/api/quiz-submit`
3. Next.js handler subscribes the user via MailerLite API with
   `status: "active"` (no confirmation email)
4. Subscriber lands in **MAYA Quiz Leads** group
5. Active automation **MAYA - Quiz Welcome + 10% Off** fires immediately

If anything in steps 2–4 breaks, no email is sent (silent failure on the
client by design — quiz still renders results).

## Pre-deploy

- [ ] **`QUIZ_SUBMIT_URL` in `page.quiz.liquid`** points to the Vercel
      production alias **`https://maya-azure-pi.vercel.app/api/quiz-submit`**.
      ⚠️  `officeofmaya.com` is the Shopify storefront — it does NOT serve the
      Next.js API. Posting there silently 404s and no subscriber is created.
- [ ] **CORS allowlist** in `src/app/api/quiz-submit/route.ts`
      (`ALLOWED_ORIGINS`) includes the Shopify storefront domain serving the
      quiz (`officeofmaya.com`, `www.officeofmaya.com`, and/or
      `*.myshopify.com` preview)
- [ ] **Vercel env vars** on the Next.js production deployment:
  - [ ] `MAILERLITE_API_KEY` — token from the **MAYA** MailerLite account
        (account ID `2029859`, "A Wolfpup Project"). Test by curl:
        `curl -H "Authorization: Bearer $KEY" https://connect.mailerlite.com/api/account`
        should return account `2029859`.
  - [ ] `MAILERLITE_QUIZ_GROUP_ID` — ID of the "MAYA Quiz Leads" group.
        Find via: MailerLite → Subscribers → Groups → MAYA Quiz Leads → URL
        contains the ID.
- [ ] **MailerLite automation** "MAYA - Quiz Welcome + 10% Off" is **Active**
      (not Draft / "Needs repair"). Triggers on group `MAYA Quiz Leads`.
- [ ] **Shopify theme** — confirm which directory ships:
      `shopify theme list` and push the right one with
      `shopify theme push --theme <id> --only templates/page.quiz.liquid`

## Smoke test (after every deploy)

Use a fresh email address (Gmail `+` aliases work: `you+quiz1@gmail.com`).

1. [ ] Open `https://officeofmaya.com/pages/quiz`
2. [ ] Open browser devtools → Network tab
3. [ ] Complete all 5 questions
4. [ ] Enter dog name (e.g. "Bowie") + the fresh email
5. [ ] Click "See my recommendation"

### Verify in devtools

- [ ] Network shows a `POST` to `/api/quiz-submit` returning **`200`**
- [ ] Response body is `{"ok": true}`
- [ ] No CORS errors in console

### Verify visual

- [ ] Results page renders with redesigned layout (large headline, hero
      product on cream tile, hairline divider, centered QUIZ10 code)
- [ ] "Shop {formula}" button shows SVG border on hover (desktop)
- [ ] Discount code reads `QUIZ10`
- [ ] Confirmation note shows the email you submitted

### Verify MailerLite (within ~30 seconds)

- [ ] MailerLite → Subscribers → search the email
  - [ ] Status is **Active** (NOT "Unconfirmed")
  - [ ] Member of group **MAYA Quiz Leads**
  - [ ] Custom fields populated: `dog_name`, `quiz_top_formula`, `quiz_answers`
- [ ] MailerLite → Automations → MAYA - Quiz Welcome + 10% Off → activity
  - [ ] Subscriber appears in "Queued" or "Completed"

### Verify inbox (within ~1–2 minutes)

- [ ] Receive **MAYA Quiz - Welcome + 10% Off** email
- [ ] Sender is MAYA branding (NOT "San Bernardino Tax Sales")
- [ ] **Do NOT** receive a "Confirm your email" / "San Bernardino Tax Sales"
      double-opt-in email
- [ ] Email displays in Space Mono font with white background
- [ ] QUIZ10 code is visible and styled correctly

## Known bugs fixed (2026-04-30)

| Bug | Root cause | Fix applied |
|---|---|---|
| No email received after quiz | `QUIZ_SUBMIT_URL` pointed to `officeofmaya.com` (Shopify, no API) instead of `maya-azure-pi.vercel.app` | Hard-coded Vercel URL in `page.quiz.liquid` |
| No email received after quiz | `status: "active"` was commented out in `route.ts`, subscribers added as Unconfirmed, automation never fired | Uncommented `status: "active"` |
| Compiling overlay frozen at 0% | `requestAnimationFrame` is throttled/paused by the browser when the tab is not in the foreground | Replaced `rAF` animation loop with `setInterval` in `runWithCompilingOverlay()` |

## If something breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| `fetch` fails with CORS error | Origin not in `ALLOWED_ORIGINS` | Add Shopify domain to `route.ts` |
| `200` returned but no MailerLite subscriber | API key missing/wrong account | Update `MAILERLITE_API_KEY` in Vercel |
| Subscriber created but no email | Automation paused or in Draft | Reactivate automation |
| Subscriber created with status "Unconfirmed" | `status: "active"` got dropped | Check `route.ts` payload still includes it |
| Compiling overlay frozen / never shows results | `rAF` throttled (user in background tab) | Animation must use `setInterval`, not `requestAnimationFrame` |
| User receives "San Bernardino Tax Sales" email | Quiz still hitting JSONP form endpoint | Verify `page.quiz.liquid` calls `QUIZ_SUBMIT_URL`, not `assets.mailerlite.com/jsonp/...` |

## Reference

- Shopify quiz template: `shopify-theme/templates/page.quiz.liquid`
- Next.js handler: `src/app/api/quiz-submit/route.ts`
- MailerLite account: "A Wolfpup Project" (ID `2029859`,
  `terry@wolfpup.xyz`) — shared across MAYA, San Bernardino, Capital Axioms,
  Creator Stays, Miami-Dade, etc.
- MAYA Quiz Form: `185492455689291593` (no longer used directly — left in
  MailerLite for any third-party integrations)
- MAYA Quiz Welcome automation: `185490353957111620`
