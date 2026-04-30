# MAYA Social Comment Playbook

How to run MAYA's brand commenting strategy across Instagram, TikTok, and beyond. This is how we show up in the wild — deadpan, corporate, committed to the bit.

---

## The Voice

MAYA comments as the **Office of Maya** — a fictional corporate bureaucracy that has reviewed your dog's situation and filed it accordingly. The voice is:

- **Lowercase throughout** — always. No caps ever.
- **Deadpan and formal** — no exclamation points, no emojis, no warmth
- **Specific to the post** — reference the dog's name, breed, situation. Never generic.
- **Bureaucratic terminology** — divisions, task forces, case files, compliance gaps, requisitions, findings, protocols
- **Self-serious** — the joke is that we are 100% committed. Never wink at the camera.
- **Ends with a promo code** — always `officeofmaya.com, code IG20` (or IG20 for Instagram, TK20 for TikTok if running platform-specific codes)

### Comment structure (3-4 sentences)

1. **Name the division** reviewing this case ("the maya [X] division has reviewed…")
2. **State findings** — 2-3 specific observations using colon notation ("coat: exceptional. boundary enforcement: absent.")
3. **Identify the gap** — what MAYA supplement is missing and why it's needed
4. **CTA + file closed** — `officeofmaya.com, code IG20.` then one punchy filing line ("this case has been logged as [funny label].")

### Division name bank (mix and match to context)

| Context | Division Name |
|---|---|
| Health / vet visit | wellness department |
| Food / eating | nutritional equity division |
| Sleep / resting | sleep & recovery task force |
| Beach / outdoor | coastal wellness division |
| Behavior / anxiety | behavioral analytics unit |
| Birthday / milestone | age-milestone review board |
| Fitness / sports collab | performance analytics division |
| Safety / toxins | regulatory affairs division |
| Rules / household policy | hygiene / compliance task force |
| Emotional support | emotional wellness monitoring unit |
| Procurement / gifts | seasonal procurement review board |
| Education / vet series | continuing education division |

### Formulas to reference

Match the supplement recommendation to the post context:

| Post signals | Recommend |
|---|---|
| Senior dog, slowing down, joint stiffness | Joint Care |
| Itchy, scratchy, outdoor exposure | Allergy formula |
| Eating issues, floor dining, gut | Digestive Care |
| Fluffy coat, beach, grooming | Skin & Coat |
| Active dog, fitness post | Joint Care + Skin & Coat |
| Anxious / nervous dog | Digestive Care (gut-brain link) |
| Multiple dogs | "full protocol across all units" |

---

## Instagram — Step by Step

### Setup (one time)

- Log into `@officeofmaya` on Instagram
- Keep a browser tab open to `instagram.com`

### Finding posts to comment on

**High-value target accounts (large, active, dog-specific):**
- `@dogsofinstagram` — 5.5M followers, aggregator, posts multiple times/day. Use the arrow to scroll through posts without leaving the modal.
- `@tunameltsmyheart` — 1.9M, chiweenie
- `@jiffpom` — 8.8M, Pomeranian
- `@harlowandsage` — 1.5M, Weimaraner + dachshund
- `@thegoldenratio4` — 99.5K, rescue goldens in Florida Keys
- `@itsdougthepug` — large pug following
- `@magnusthetherapydog` — therapy dog content

**How to find new targets fast:**
1. Go to `@dogsofinstagram` → click any recent post → use the **right arrow** to cycle through posts in the feed. You can drop 5-6 comments without ever leaving the modal.
2. Search Instagram hashtags: `#dogsofinstagram`, `#dogstagram`, `#dogsofig`, `#puppiesofinstagram` — click "Recent" to find fresh posts with active comment sections.
3. The accounts that appear in "Followed by" on dog accounts are usually good targets too.

**Avoid:**
- Memorial / RIP posts (the dog has passed) — check caption for "remembering," "rainbow bridge," "forever in our hearts"
- Private accounts
- Accounts with <5K followers (low reach)

### Posting a comment (Claude automation method)

When using Claude in Chrome to automate:

```
1. navigate to post URL
2. find() "comment text input box" → get ref
3. computer scroll_to(ref) → left_click(ref) to focus
4. javascript_tool: document.querySelector('textarea[placeholder="Add a comment…"]').focus(); document.execCommand('insertText', false, COMMENT);
5. find() "Post button for comment" → left_click(ref)
6. screenshot() to verify it posted
```

**Critical:** Always use `document.execCommand('insertText', false, COMMENT)` — never use `computer.type()` for comments. Typing directly corrupts text mid-string. The execCommand method inserts cleanly every time.

### Comment length guide

- **Standard length:** 3-4 sentences, ~60-80 words
- **Short version (high volume runs):** 2-3 sentences, ~35-50 words — use when posting 10+ in a session
- **Never exceed ~120 words** — Instagram truncates long comments

---

## TikTok — Step by Step

### Setup (one time)

- Log into `@officeofmaya` on TikTok
- TikTok comments use a text input, same as Instagram

### Finding posts to comment on

1. Search hashtags: `#dogsoftiktok`, `#dogmom`, `#puppytok`, `#doglover`
2. Sort by "Most Recent" or just scroll the For You Page (FYP) — the algorithm surfaces dog content heavily
3. Target videos with 10K–1M views that were posted **within the last 24 hours** — comments get more visibility while the video is still gaining traction

### Posting (Claude automation method)

TikTok's comment box uses a different selector:

```javascript
// TikTok comment input
document.querySelector('[data-e2e="comment-input"]') 
// OR
document.querySelector('div[contenteditable="true"]')
```

Because TikTok uses a `contenteditable` div (not a textarea), the insertion method differs:

```javascript
const el = document.querySelector('[data-e2e="comment-input"]') 
  || document.querySelector('div[contenteditable="true"]');
el.focus();
document.execCommand('insertText', false, COMMENT);
```

Then find and click the send/post button (usually a paper plane icon or "Post" button).

**If execCommand doesn't work on TikTok**, fall back to:
```javascript
el.textContent = COMMENT;
el.dispatchEvent(new Event('input', { bubbles: true }));
```

### Voice adjustments for TikTok

Same voice, but TikTok audiences are younger and scroll faster:
- Lead with the most absurd finding first ("coat luminosity: 9.4/10.")
- Keep to 2-3 sentences max — TikTok truncates at ~150 chars before "more"
- The promo code still works: `officeofmaya.com, code TK20`

---

## Comment Batch Strategy

When running a commenting session:

**Warm vs. cold approach:**
- **Warm accounts** (dog accounts that already follow MAYA or have engaged): Comment in a more personal/familiar tone. "we have your file. it has been updated."
- **Cold accounts** (new targets): Full corporate intake — name the division, run the full assessment, end with the code.

**Volume per session:**
- 10–15 comments per session is sustainable without triggering spam filters
- Space comments at least 30 seconds apart (automation handles this naturally with screenshot/navigation steps)
- Don't comment more than 2x on the same account in one session

**Tracking (optional but recommended):**
Keep a simple log of where you've commented:

| Date | Account | Post URL | Formula mentioned | Likes on comment |
|---|---|---|---|---|
| 2026-04-29 | @tunameltsmyheart | instagram.com/p/DXH_4QfAa_E | Digestive + Joint | — |
| 2026-04-29 | @jiffpom | instagram.com/p/DXZzhSEDhbv | Skin & Coat | — |
| … | … | … | … | … |

---

## Example Comments (Reference Bank)

**Beach / outdoor**
> the maya coastal wellness division has logged [dog name]'s unsupported beach excursion. findings: gait mechanics on wet sand: excellent. however, prolonged salt and mineral exposure without supplemental skin & coat coverage is an unquantified dermatological variable. we have opened a case file. officeofmaya.com, code IG20. the toes have been noted.

**Vet visit**
> the maya wellness department has received [dog name]'s biometric data and initiated a mandatory health review. findings: coat: full and operational. scheduling irregularities noted. our formulary committee formally recommends the joint support protocol. officeofmaya.com, code IG20. [dog name]'s file has been upgraded to Priority Patient status.

**Birthday**
> the maya wellness department has initiated a mandatory age-milestone review. findings: coat: full. morale: high. at year [N], we formally recommend transitioning to a joint support regimen. officeofmaya.com, code IG20. [dog name]'s file has been upgraded to Adult Dog status effective today. the cake is not covered under this plan.

**Sleeping / lounging**
> the maya sleep & recovery task force has reviewed this rest formation. joint compression: minimal. thermal distribution: optimal. however, no joint support supplementation appears to be in the pre-sleep routine. this is a compliance gap. officeofmaya.com, code IG20. case filed under 'resting, do not disturb.'

**Household rules**
> the maya compliance task force has reviewed this household policy. findings: [funny inconsistency stated flatly]. this regulatory framework lacks internal consistency. we note no skin & coat protocol is in place to address the variable. officeofmaya.com, code IG20. this policy has been logged as 'owner-negotiated, effective immediately.'

**Emotional support dog**
> the maya emotional wellness monitoring unit has flagged this interaction. owner distress detected — within 3 seconds. intervention: sustained physical contact, zero questions, no invoice. this is an advanced crisis response that most human support networks fail to replicate. keep this dog's joints optimized so they can keep showing up. officeofmaya.com, code IG20. case status: resolved. by the dog.

**Food / dining**
> the maya nutritional equity division has reviewed this dining arrangement. [specific finding]. however, no digestive support supplement appears in the current meal plan. this is a documented gap. officeofmaya.com, code IG20. [dog name]'s case has been logged as '[funny label].'

---

## Promo Code Reference

| Platform | Code | Notes |
|---|---|---|
| Instagram | `IG20` | 20% off at officeofmaya.com |
| TikTok | `TK20` | Create this code in Shopify first |
| Universal | `MAYA20` | Fallback if no platform-specific code exists |

---

## What Not to Do

- ❌ Don't comment on memorial / RIP posts
- ❌ Don't use emojis — it breaks the voice
- ❌ Don't capitalize anything — ever
- ❌ Don't be warm, enthusiastic, or complimentary in a normal way ("so cute!!")
- ❌ Don't use exclamation points
- ❌ Don't post the same comment twice (each one must be tailored to the specific dog/post)
- ❌ Don't use `computer.type()` for automation — it corrupts text. Use `execCommand('insertText')` only.
- ❌ Don't comment more than ~15 times in a single session (spam filter risk)
