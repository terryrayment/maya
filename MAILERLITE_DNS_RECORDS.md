# MailerLite DNS Records for officeofmaya.com

These 3 records need to be added to the `officeofmaya.com` DNS in Shopify
Admin → Settings → Domains → officeofmaya.com → DNS settings.

## Record 1 — CNAME (DKIM)

- **Type:** CNAME
- **Name/Host:** `litesrv._domainkey`
- **Value/Points to:** `litesrv._domainkey.mlsend.com`

## Record 2 — TXT (SPF)

- **Type:** TXT
- **Name/Host:** `@` (or leave blank for root)
- **Value:** `v=spf1 a mx include:_spf.mlsend.com ?all`

**Note:** If a TXT record already exists on `@` with SPF (v=spf1...), you
need to *merge* them into one record — e.g. add `include:_spf.mlsend.com`
to the existing SPF string. Do NOT create two SPF records; that breaks
email.

## Record 3 — TXT (Domain Verification)

- **Type:** TXT
- **Name/Host:** `@` (or leave blank for root)
- **Value:** `mailerlite-domain-verification=c0f5ab33688b7331167636e5388618e63fd9e882`

---

Once all 3 are added and DNS propagates (usually 10-60 min, up to 24h),
come back to MailerLite → Account settings → Domains → click "Check
records" to verify.
