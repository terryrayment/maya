@AGENTS.md

---

## MAYA — Architecture & Agent Orientation

### Two separate systems

| System | Domain | What it does |
|---|---|---|
| Shopify storefront | `officeofmaya.com` | All customer-facing pages, cart, checkout, product pages |
| Next.js app (Vercel) | `maya-azure-pi.vercel.app` | API routes only (`/api/quiz-submit`, etc.) |

⚠️ **`officeofmaya.com` is Shopify.** It does NOT serve Next.js routes. Any `fetch()` from the Shopify quiz that targets `officeofmaya.com/api/...` will 404 silently.

The correct API base is: **`https://maya-azure-pi.vercel.app`**

---

### Quiz flow

```
officeofmaya.com/pages/quiz   (Shopify Liquid — shopify-theme/templates/page.quiz.liquid)
  └─ POST /api/quiz-submit    (Vercel Next.js — src/app/api/quiz-submit/route.ts)
       └─ MailerLite API      subscribe with status="active" → group "MAYA Quiz Leads"
            └─ Automation     "MAYA - Quiz Welcome + 10% Off" (ID 185490353957111620)
                 └─ Email 1   "Your dog's MAYA formula — plus 10% off inside" (immediate)
                 └─ Email 2–5 Follow-up sequence over 14 days
```

Critical: `status: "active"` MUST be in the MailerLite POST body. Without it, subscribers land as Unconfirmed and the automation never fires.

---

### Shopify theme

- **Live theme ID:** `162825109813` (name: "MAYA", store: `officeofmaya.myshopify.com`)
- Push command: `shopify theme push --store officeofmaya.myshopify.com --theme 162825109813 --allow-live`
- Local theme files: `shopify-theme/`
- The Shopify CLI must be authenticated as `terry@officeofmaya.com` (Google OAuth)

---

### MailerLite

- Account: "A Wolfpup Project" (ID `2029859`, `terry@wolfpup.xyz`)
- **Shared across multiple brands** — double-opt-in emails come from "San Bernardino Tax Sales" branding
- MAYA Quiz Leads group ID: `185489474360181800`
- Always use `status: "active"` when subscribing quiz leads to bypass the shared DOI email

---

### Vercel

- Project: `maya` (`prj_Q3R9vzoUaSI18Clsc29eWrXH3DvF`)
- Team: `terry-rayment` (`team_V9OzX7sGuj2YQkexAQI2S96u`)
- Production alias: `maya-azure-pi.vercel.app`
- Required env vars: `MAILERLITE_API_KEY`, `MAILERLITE_QUIZ_GROUP_ID`
- Deploys automatically from `main` branch pushes to GitHub (`terryrayment/maya`)

---

### Known gotchas

- `requestAnimationFrame` pauses when the browser tab is not in focus. Any animation loop in Shopify Liquid JS must use `setInterval` instead.
- The Shopify quiz template (`page.quiz.liquid`) is self-contained — all CSS and JS are inline. It is NOT connected to the Next.js app at build time.
- `shopify theme pull` is required to get sections that only exist in the live theme (e.g. `sections/press-strip.liquid` was live-only and not in the repo until pulled).
