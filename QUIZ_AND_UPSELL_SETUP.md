# Quiz + Post-Purchase Upsell — Final Setup

## ✅ Status as of April 22, 2026

| Step | Status | Notes |
|------|--------|-------|
| UPSELL20 discount code | ✅ Created | 20% off entire order, unlimited uses |
| QUIZ10 discount code | ✅ Created | 10% off entire order, unlimited uses |
| MailerLite "MAYA Quiz Leads" group | ✅ Created | Group ID: 185489474360181800 |
| MailerLite API key | ✅ Generated | Stored in `.env.local` (gitignored) |
| MailerLite custom fields | ✅ Created | dog_name, quiz_top_formula, quiz_answers |
| End-to-end quiz test | ✅ Passed | Submissions land in MailerLite with all fields populated |
| Shopify order status redirect | ⚠️ Blocked | Shopify Checkout Extensibility removed "Additional Scripts" — needs Checkout UI Extension or 3rd-party app (ReConvert, Zipify) |

The quiz is **fully operational in local dev**. When you deploy to Vercel,
add the 2 env vars from `.env.local` to the Vercel dashboard under
Settings → Environment Variables.

---

## Original Setup Instructions (for reference)

---

## Step 1 — Create the UPSELL20 Discount Code in Shopify (1 min)

This is what powers the 20% off one-click upsell on the thank-you page.

1. Shopify Admin → **Discounts** → **Create discount**
2. Choose **Amount off products**
3. Settings:
   - **Method:** Discount code
   - **Code:** `UPSELL20`
   - **Value:** 20% off
   - **Applies to:** All products
   - **Minimum purchase:** None
   - **Customer eligibility:** All customers
   - **Usage limits:** Uncheck "Limit to one use per customer" — check "Limit
     number of times this discount can be used in total" and set it to a
     large number like 10,000
   - **Combinations:** Do not combine with product discounts, do not combine
     with order discounts, do not combine with shipping discounts
   - **Active dates:** Starts today, no end date
4. **Save**

**Also create QUIZ10** (same steps, `QUIZ10` code, 10% off, for quiz email captures).

---

## Step 2 — Redirect Shopify's Order Status Page to /thank-you (1 min)

This is what sends post-checkout customers to your custom upsell page.

1. Open the file `shopify-order-status-redirect.liquid` in the project root
2. Copy the entire script block (the `<script>...</script>` portion)
3. In Shopify Admin go to: **Settings → Checkout → Order status page →
   Additional scripts**
4. Paste the script
5. **Save**

**Heads up about the redirect delay:** The script uses a 2.5-second delay so
customers see Shopify's confirmation briefly before being redirected. This
protects trust and avoids feeling like a bait-and-switch. If you want an
instant redirect, remove the `setTimeout` and call `window.location.href`
directly.

**Test it:** Place a real test order ($1 product if you have one) and verify
the redirect works end-to-end.

---

## Step 3 — Wire MailerLite for Quiz Emails (3 min)

This sends quiz takers their personalized recommendation by email and tags
them with the formula they matched.

### 3a. Create the quiz group in MailerLite

1. Log into MailerLite
2. **Subscribers → Groups → Create group**
3. Name: **MAYA Quiz Leads**
4. Open the group and copy the Group ID from the URL (it's the number at the
   end, e.g. `groups/123456789`)

### 3b. Get your MailerLite API key

1. MailerLite → **Integrations → MailerLite API**
2. **Generate new token**
3. Name: `MAYA Production`
4. Copy the token (starts with `eyJ...`)

### 3c. Add env vars

Add these to `.env.local` (local dev) AND Vercel (production):

```bash
MAILERLITE_API_KEY=eyJ0eXAiOiJKV1Qi...
MAILERLITE_QUIZ_GROUP_ID=123456789
```

**In Vercel:** Settings → Environment Variables → Add both → Redeploy

### 3d. Build an automation in MailerLite

After a subscriber is added to the "MAYA Quiz Leads" group, send them:

- **Trigger:** Joins group "MAYA Quiz Leads"
- **Email:** Subject: "Your dog's MAYA formula — plus 10% off"
- **Body template:**

```
Hi {$fields.name|default:"there"},

We matched {$fields.dog_name|default:"your dog"} with {$fields.quiz_top_formula}.

This is the formula most dog parents in your situation start with. Here's
10% off your first order as promised:

→ Shop now: https://www.officeofmaya.com/shop
→ Your code: QUIZ10

Questions? Just reply to this email — a real person (me, Terry) reads every one.

— MAYA
```

---

## Verification Checklist

After all 3 steps:

- [ ] Visit `/quiz` — complete the flow → check MailerLite for your test submission
- [ ] Place a test order → verify redirect to `/thank-you` with correct params
- [ ] Click the upsell button → verify checkout loads with UPSELL20 applied
- [ ] Check `/` → confirm "Take the Quiz" CTA appears in hero + quiz strip

---

## What's Live Right Now (Code Only — Still Needs the 3 Steps Above)

| Feature | Status |
|---------|--------|
| `/quiz` page | ✅ Live |
| `/thank-you` page | ✅ Live |
| `/api/quiz-submit` endpoint | ✅ Live (gracefully falls back if MailerLite not configured) |
| Quiz CTA in homepage hero | ✅ Live |
| Quiz feature strip on homepage | ✅ Live |
| Quiz link in header nav (desktop + mobile) | ✅ Live |
| Subscribe & Save toggle on PDPs | ✅ Already existed |

## What's NOT Live Yet (Waiting on Steps 1-3)

| Feature | Blocker |
|---------|---------|
| Quiz sends emails | Needs MailerLite API key (Step 3) |
| Post-purchase upsell discount works | Needs UPSELL20 code (Step 1) |
| Customers land on /thank-you after checkout | Needs redirect script (Step 2) |

---

## Revenue Math Reminder

**Quiz alone (conservative):**
- 1,000 quiz takers/month
- 30% complete the quiz and submit email → 300 leads
- 10% convert from email → 30 orders
- Avg order $75 → **$2,250/month in net-new revenue from the quiz**

**Post-purchase upsell (conservative):**
- 200 orders/month
- 15% take the upsell (industry avg is 10-20%)
- 30 upsells × $55 avg (discounted) → **$1,650/month in pure-margin upsell revenue**

**Combined: ~$3,900/month new revenue, from ~5 minutes of setup work.**
