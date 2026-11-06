# NetFin Custom — AI Handoff Brief

> **How to use this file:** Start a new Gemini chat. Attach this file **plus the current versions of**
> `netfin-jf12.css`, `netfin-classic-navbar.css` (and `netfin-netflix.css` if you use it), then send:
>
> *"Read GEMINI-HANDOFF.md first and follow it exactly. Then confirm the current build tag and wait for my request."*
>
> Always attach the files as they are **in the GitHub repo right now**. The AI cannot reliably read them from
> GitHub or jsDelivr, and working from an old copy will undo earlier fixes.

---

## 1. Your role (instructions for the AI)

You are maintaining a custom Jellyfin 12 theme for the repo owner. The owner is not a CSS developer and
deploys by pasting files into GitHub. Follow these rules on every change:

1. **Work only from the attached files.** Never rewrite a file from memory or guess at its contents.
2. **Diagnose before fixing.** Explain the actual cause in one or two sentences, based on the screenshot and
   the CSS. If you cannot tell the cause (for example, you don't know the plugin's HTML), say so and ask the
   owner to right-click → Inspect and send a screenshot of the Elements/Styles panel. Do not guess at
   selectors and present them as certain.
3. **Put new rules in PART C** of `netfin-jf12.css`, numbered sequentially (next is **C45**), each with a
   comment explaining *why* it exists. Do not edit PART A2 or PART B (they are verbatim upstream copies).
   Edit PART A only to fix a genuine NetFin bug, and note it.
4. **Bump the build tag** in C10 on every change to `netfin-jf12.css`:
   `:root { --netfin-build: "YYYY-MM-DD rN"; }` (current: `"2026-11-07 r54"`, so next is `r55`).
5. **Deliver the complete file**, not a fragment, unless the owner asks for a snippet. The owner replaces the
   whole file on GitHub. Partial pastes caused version confusion before.
6. **Check syntax.** Braces must balance; no rule may be left open. A single stray `}` or `{` silently breaks
   everything after it.
7. **Respect specificity.** NetFin uses many `!important` rules. Before claiming an override will work, compare
   it against the rule it must beat (`!important` vs not, then specificity, then order). If needed, match or
   exceed the competing selector rather than piling on `!important`.
8. **Remember `:has()` caveat.** Jellyfin Media Player 1.12 cannot read `:has()`. A `:has()` inside a selector
   list makes the *whole* rule invalid there, so keep `:has()` rules in their own blocks.
9. **Keep scope tight.** Desktop-only fixes go under `:root.layout-desktop`; don't change TV/mobile unless asked.
10. After delivering, always remind the owner of the **deploy steps** in section 4.

---

## 2. Project summary

- **Repo:** `github.com/alleyu2/netfin-custom` (public, branch `main`)
- **Goal:** Stock **NetFin** (red & black Netflix-style Jellyfin theme by ya0903) made to work on
  **Jellyfin 12's Modern layout**, which is the default on non-TV devices and uses MUI components
  (`.MuiAppBar-root`, `.MuiDrawer-root`, `.MuiButton-*`, etc.) that stock NetFin never styled.
- **Approach:** One combined stylesheet, built in the load order elegantfin-jf12 expects:
  base theme → Media Bar add-on → Jellyfin 12 layer → reconciliation fixes.

### Upstream sources

| Part | Source | Version | License |
|---|---|---|---|
| Base theme | github.com/ya0903/NetFin (`netfin.css`) | main | MIT |
| Media Bar support | github.com/lscambo13/ElegantFin — "Media Bar Plugin Support" add-on | v26.09.05 | see ElegantFin repo |
| Jellyfin 12 Modern layer | github.com/mihaif7/elegantfin-jf12 (`ElegantFin-jf12-modern-*.css`) | v26.10.13 | GPL-2.0 |
| Classic navbar add-on | mihaif7/elegantfin-jf12 `Theme/assets/add-ons/classic-navbar-*.css` | v26.10.13 | GPL-2.0 |

---

## 3. Files in the repo

| File | Status | Purpose |
|---|---|---|
| `netfin-jf12.css` | **Live**, build `2026-11-07 r54`, ~7,150 lines | The full theme |
| `netfin-classic-navbar.css` | **Live** | Optional: server name as a pill like the library links |
| `README.md` | Live | Public documentation of all changes |
| `LICENSE` | GPL-3.0 | See open issue #1 in section 7 |
| `netfin-new-badges.js` | **Reference copy** (runs from JS Injector, not jsDelivr) | Creates the C19 badges |
| `Top_10_Carousel_Fix.js` | **Reference copy** (runs from JS Injector as "Top 10 Carousel Fix") | Desktop Top 10 rows: Previous button returns cleanly to card 1 via `cardBuilder.setScrollerPosition(scroller, 0, true)`; section IDs hard-coded (update with C15) |
| `netfin-netflix.css` | **Created, NOT yet deployed** | Optional Netflix-look add-on (section 6) |

### Structure of `netfin-jf12.css`

| Section | Contents | Editable? |
|---|---|---|
| Header comment | Credits and structure | Yes |
| **PART A** | Stock NetFin (header replaced; stray `}` at end removed) + a second `:root` block of 20 tokens the jf12 layer needs, inserted right after NetFin's `:root` | Bug fixes only |
| **PART A2** | ElegantFin Media Bar add-on v26.09.05, single minified line, verbatim | No (replace whole line on upgrade) |
| **PART B** | elegantfin-jf12 v26.10.13, verbatim, sections §1–§20 | No (replace whole part on upgrade) |
| **PART C** | Reconciliation rules C1–C44 (in file order C1–C4, C6, C5, C7–C44) | **Yes — all new work goes here** |

### Tokens added in PART A (NetFin never defined these)

`--fullContrastColor` #fff · `--zeroContrastColor` #fff · `--accentColor` = `--activeColor` ·
`--accentHoverColor` rgb(255,26,26) · `--semiTransparentAccentColor` rgba(204,0,0,.18) ·
`--btnPlayColor` = `--activeColor` · `--activeBackgroundColor` = `--activeColor` · `--activeTextColor` #fff ·
`--hoverBackgroundColor` rgba(204,0,0,.15) · `--hoverTabBackgroundColor` rgba(204,0,0,.18) ·
`--dividerColor` = `--borderColor` · `--textareaBackgroundColor` = `--selectorBackgroundColor` ·
`--multiSelectOverlayColor` rgba(0,0,0,.66) · `--cardShadow` · `--iconShadow` ·
`--cardResumeProgressColor` = `--activeColor` · `--fill` 1 · `--wght` 400 · `--grad` 0 · `--opsz` 48

### Key NetFin palette (PART A `:root`)

`--activeColor` rgb(204,0,0) · `--darkerGradientPoint` #000 · `--lighterGradientPoint` #0d0d0d ·
`--borderColor` hsl(0,100%,12%) (#3d0000) · `--selectorBackgroundColor` rgb(30,0,0) ·
`--textColor` #fff · `--dimTextColor` rgb(160,160,160) · `--appBarHeight` 5em ·
Hover red used in rules: `#ff4444` / `#ff3333`. Fonts: Rajdhani (body), Orbitron (titles), Share Tech Mono (badges).

### PART C rules (current)

| Rule | Purpose |
|---|---|
| C1 | MUI `--jf-palette-*Channel` values → NetFin RGB, for all themes incl. light (NetFin is dark-only) |
| C2 | Library pills: `--ef12-navPillBackground: rgba(0,0,0,.6)`; red `#ff4444` text on hover |
| C3 | MUI drawer: undo NetFin's `!important` `.navMenuOption` / sidebar-heading values inside `.MuiDrawer-root` only |
| C4 | C2 hover colour for engines without `:has()` |
| C5 | Comment only: NetFin's 7px title padding intentionally beats jf12 §15 |
| C6 | `html body { font-family: Rajdhani… }` — MUI sets a font on body, which hid NetFin's font |
| C7 | Media Bar: Play button Rajdhani (add-on wanted Inter), age rating Share Tech Mono, active dot NetFin red |
| C8 | Media Bar Play button size (NetFin's `.btnPlay.detailButton` rules hit it) — moved here from owner's Custom CSS |
| C9 | Media Bar button order Play → info → favourite → Trailer, by ordering every child of the row containing `.play-button` (`order:4` default, then 1/2/3), `!important` |
| C10 | Build tag `--netfin-build` |
| C11 | Episode pages (desktop): backdrop-shaped detail card `width: min(64vh, 42vw)` instead of 40vh; albums excluded |
| C12 | Item pages (desktop): tagline + overview centred, `max-width: 60em` |
| C13 | MUI tooltips (e.g. "User Menu"): `.MuiTooltip-popper .MuiTooltip-tooltip` → `font-size: .875rem`, weight 500, letter-spacing `.02em`, padding `.35em .75em`; no `!important` |
| C14 | User (avatar) menu, desktop only: `#app-user-menu .MuiMenuItem-root` → `font-size: 1.1rem`, inner Typography / Button inherit; icons unchanged |
| C15 | Netflix-style outlined rank numbers 1–10 on KefinTweaks rows `custom-1792455350614` (Top 10 Movies Today) and `custom-1792463008640` (Top 10 Shows Today), rows are now **Poster** cards (C15b/C16/C17 active). Thumb number: 70cqw Arial Black, `translateY(1.5cqw)` so the digit spans the image height and sits on its bottom edge; "10" 45cqw. Card widened by `--netfin-rankW` + left padding; number is a CSS counter in `::before`, Arial Black, grey 3px stroke, red on hover. Card is `container-type: inline-size`; **cqw = the image (content-box) width**, not the card. Box runs `left: 0` to `right: 78cqw` (posters) so it tucks under the image; `line-height: .79` sits the baseline on the image bottom. C15b = poster sizing (r13: `--netfin-top10PosterScale: .75` re-declares `--cardWidth` from `--effectiveWidth`/`--cardCount`/`--itemColumnGap` to shrink posters in these rows only; KefinTweaks has no known card-size setting; gap 0.85×cardWidth, height 150cqw, font 168cqw, "10" 98cqw); C15c = titles wrap to 2 lines. Section IDs change if a section is recreated |
| C16 | Desktop Top 10 poster rows: C16a posters at 60% (`--netfin-top10PosterScale: .60`, `--cardWidth` recomputed, never self-referenced); C16b rank 10 gutter 1.40×cardWidth, digits left-anchored, scaleX(.95); C16c `.emby-scroller` shifted `left: -35px` to align with other rows. Carousel return-to-start lives in JS Injector script "Top 10 Carousel Fix" |
| C17 | Mobile Top 10 poster rows: posters 75%, gutter .70×cardWidth, number 150cqw / 2px stroke; rank 10 gutter 1.25× and left-anchored |
| C18 | iOS/Safari: rank numbers showed "0" (counter blocked by container-type style containment in WebKit) → literal `content: "1"`…`"10"` per `nth-child` |
| C19 | Netflix "Recently added" / "New Season" badges: styles `.cardScalable > .netfin-newBadge` (red tab, bottom-centre, hidden on desktop hover, `--netfin-newBadgeBottom` to lift it). Badge elements are created by JS Injector script **"NetFin New Badges"** (`netfin-new-badges.js`, kept in the repo for reference): script r22 rules: Added = DateCreated, Aired = PremiereDate (missing = counts as aired). Priority on show cards: **New Season** (season ≥2 added ≤14d AND season premiered ≤60d, or has an episode aired ≤14d; overrides Recently added so a just-downloaded currently-airing show reads "New Season") > **Recently added** (movie/series added ≤14d) > **New Episode** (unwatched non-special episode added ≤7d and aired ≤14d; also on episode cards with "Watch Now"). Air-date checks stop backfilled old seasons/episodes being called new. Cache resets on user switch; refresh every 15 min. Episodes/seasons: `IsMissing=false` + `LocationType !== "Virtual"` and air date must not be in the future (+1 day grace), so Coming Soon placeholders get no badge. Script ends with an `END OF NetFin New Badges` comment: JS Injector paste got truncated once and broke all injected scripts (KefinTweaks rows vanished) — check the last line after every paste, or load via Script URL from jsDelivr; matches `.card[data-id]` with `data-type` Movie/Series/Episode. Owner moved Jellyfin Enhanced rating tags to top-left so they don't collide with the badge |
| C20 | Split "New Episode \| Watch Now" badge (Netflix style): script writes `.netfin-newBadge-main` (+ `.netfin-newBadge-cta` for New Episode, text set by `LABEL_WATCH`); badge is a flex row, red main half, white CTA half with #141414 text; Needs script r20+. (r21 removed C20's `@container (max-width: 9rem)` hide rule: it never matched, cause unknown) |
| C21 | Poster cards (`.overflowPortraitCard`, `.portraitCard`): hide `.netfin-newBadge-cta`, red half gets full rounded top. Fixes "Watch N…" clipped on Top 10 posters |
| C22 | Taller Media Bar, desktop only: one knob `--netfin-mediaBarHeight: 80vh` (vh only) sets both `#slides-container { height }` (overrides A2's 62%/57%) and `--ef12-mediaBarHeight` (§12 uses it to place home rows, v2 and v3 paths), so rows move down with the banner. Mobile/TV unchanged |
| C23 | Mobile Top 10 rows: first card pulled left by `margin-left: calc(var(--cardWidth) * var(--netfin-top10ShiftMobile))`, originally `-.34`, now **`-.24`** (overridden in C29b), so the "1" lines up with other rows (desktop equivalent is C16c). Value measured from a screenshot, not getBoundingClientRect: retune if it looks off. Mobile only |
| C24 | Rank numbers: thinner, lighter outline like Netflix. Knob `--netfin-rankStroke: #b3b3b3` is set **on the card** (r33, so both `::before` and C27's `::after` inherit it); stroke 2px desktop / 1.5px mobile (later doubled by C30) |
| C25 | Rank "10" spacing `-.05em` (superseded) and desktop knob `--netfin-rank10W` = gutter multiplier for rank 10 |
| C26 | Superseded: tried merging "1" and "0" with `paint-order`; read as two digits just touching. Values overridden by C27 |
| C27 | Rank "10" as **two layers**, like Netflix: `::before` draws "1", `::after` draws "0" shifted right (em of its own font size), so the "0" sits in front of the "1". `::after` duplicates C15's number styling (font, line-height .79, translateY(1.5cqw) scaleX(.95), left-anchored). Hover rule for `::after` included |
| C28 | Rank "10" tuning (owner-tested): desktop `--netfin-rank10W: .98`; mobile gutter `.98×cardWidth` (now overridden by C31); "0" offset `left: calc(.375rem + .35em)` (desktop; mobile overridden by C31) |
| C29 | Mobile (Pixel 9) Top 10: C29a numbers 150cqw → **168cqw** (same as desktop) incl. rank 10's both layers; C29b first-card shift `-.34` → `-.24`; C29c `@media (hover: none)` cancels the sticky red hover number on touch screens |
| C30 | Stray lines inside 3/4/8 on Android: no Arial Black there, fallback font builds digits from overlapping pieces and `-webkit-text-stroke` outlines each. Fix: `paint-order: stroke fill` on all rank numbers (not TV), stroke widths doubled to 4px desktop / 3px mobile to keep the same visible weight |
| C31 | Mobile rank "10": "0" overlaps the "1" and the poster covers ~half the "0", like desktop. Cause: the fallback font's "1" is narrower than Arial Black's, so C28's .35em offset left the digits only touching. Knobs on the 10th card: `--netfin-rank10ShiftMobile: .30em` (**owner-tested r37**; r36 estimate .26em overlapped too much; lower = more overlap; the em resolves in `::after`) and `--netfin-rank10WMobile: .80` (gutter × cardWidth; lower = poster covers more of the "0"). If an iPhone renders Arial Black it may overlap more there; raise the offset towards .35em. Mobile only |
| C32 | Netflix-style fade where the number meets the poster: `mask-image` gradient on the number (not an overlay, so any background works). Ranks 1–9 `::before`: full until `--netfin-rankFade` (45cqw) before the poster edge (box ends 22cqw under the poster, C15b), then down to `--netfin-rankFadeEnd` (.15) at the edge. Rank 10: fade on the "0" (`::after`) in % of its own box, `--netfin-rank10FadeStart` 15% → `--netfin-rank10FadeStop` 55%; the "1" is not masked. Knobs on the card. Estimated, not owner-tested yet. Desktop + mobile |
| C33 | Fix for C32: the mask clipped the bottom of the numbers (digits overflow their box by design). Number boxes get `box-sizing: content-box; padding-bottom: 20cqw` so the mask covers the overflow; digits don't move. Any future mask/clip on rank numbers must allow for this overflow |
| C34 | Rank "10": the "0" faded too early (C32's 15%→55% faded nearly all of its visible half and let the "1" show through). Now `--netfin-rank10FadeStart: 32%`, `--netfin-rank10FadeStop: 60%` (poster edge ≈ 50% of the "0"). Estimated, not owner-tested yet |
| C35 | Stronger, Netflix-like fade (overrides C32/C34 values): `--netfin-rankFade: 65cqw`, `--netfin-rankFadeEnd: 0` (outline gone at the poster edge); rank 10 "0" fades 25%→52%. Estimated, not owner-tested yet |
| C36 | Rank "10": the "0" showed no fade with %-based stops (C32/C34/C35), likely because its box is wider than the glyph so the fade sat under the poster (not confirmed in DevTools). Mask on `::after` now uses em stops from the 0's left edge: `--netfin-rank10FadeFrom: .12em` → `--netfin-rank10FadeTo: .45em` (≈ poster edge). Old % knobs unused. Fade on 1–9 (C35) owner-approved r41; rank 10 fade (C36) owner-approved r42 |
| C37 | Rank "10" shadow like Netflix (r43): C36's mask also faded the "0"'s opaque fill, so the "1" showed through the "0". Mask on `::after` removed (`mask-image: none`); instead a black gradient strip on the 10th card's `.cardBox::before` (`right: 100%`, height 156cqw, z-index via `.cardBox` above the digits) darkens the "0" towards the poster, so it stays solid in front of the "1". Knobs on the 10th card: `--netfin-rank10Shadow: 30cqw` (width), `--netfin-rank10ShadowMax: .85` (darkness at poster edge). Old C34–C36 fade knobs now unused. Owner-tested r43: "0" now solid in front of the "1"; strength tuned in C38. Ranks 1–9 keep the C35 mask fade. Desktop + mobile |
| C38 | Rank "10" shadow stronger (r44): r43 screenshot showed the 0's outline (inner curve) still readable at the poster edge, while 1–9 fade to nothing (C35). `--netfin-rank10Shadow: 40cqw`, `--netfin-rank10ShadowMax: 1`, gradient transparent → 55% at 45% → full black from 85%. Superseded by C39: the full-black zone hid the 0's inner circle (owner report). Open question: in the r43 screenshot the 0's outline looked thinner than the 1's (both should be 4px desktop, C30); cause not confirmed, needs Inspect of `::after` |
| C39 | Rank "10" shadow softened (r45): C38's full-black last 15% hid the 0's inner circle, which sits right beside the poster. No fully black zone now: `--netfin-rank10Shadow: 35cqw`, `--netfin-rank10ShadowMax: .65`, gradient transparent → 40% of max at 50% → max at the poster edge. Netflix keeps the whole 0 outline readable, only dimmed. Estimated, not owner-tested yet |
| C40 | Login card transparency, one knob (r46): `--netfin-loginCardBg: rgba(0,0,0,.45)` on `:root:is(.layout-desktop,.layout-mobile)`, applied with `!important` at (1,5,0) so the owner's Custom CSS can't override it by accident. Owner had lowered the PART A card background .82 → .45. Desktop + mobile, TV unchanged |
| C41 | Mobile login backdrop (r47): PART A `.layout-mobile .backgroundContainer.withBackdrop { background: #000 }` (meant for item pages) covered the poster backdrop on the phone login page, so the card sat on solid black. On `body:has(#loginPage:not(.hide))` only: desktop-style gradient (black at bottom → `rgba(0,0,0,.18)`), opacity .9. Own block (`:has()`). Owner-tested: works |
| C42 | Login welcome lockup (r48–r52). Old PART A `::before` on `.manualLoginForm`/`.visualLoginForm` could never show (forms hidden on this SSO server, `--loginPageText` commented out); now `content: none`. Current version (C42d, r52) on the card `#loginPage .padded-left.padded-right.padded-bottom-page`: `::before` = big "JELLYFLIX" (`--loginPageText`, Orbitron 900 34px, red glow, no underline) **in normal flow**; `::after` = small grey "WELCOME TO" (`--loginWelcomeText`, 11px, .45em tracking) absolutely at `top: 22px` inside an enlarged `padding-top: 52px`. Mobile 28px / 10px. Knobs: gap to "PLEASE SIGN IN" = `::before` margin-bottom (22px / 18px mobile); eyebrow gap = padding-top. Card gets `position: relative`. r52 not owner-tested yet |
| C43 | Login polish (r53): JELLYFLIX gets the red hairline, "PLEASE SIGN IN" (`#loginPage :is(h1,h2,.sectionTitle)` outside `.sso-instructions`) becomes a small grey subtitle; Authentik (`#__twofactor_oidc_buttons a:first-of-type`) = solid red primary, `.btnQuick` = outline secondary, both 48px; `.sso-instructions` restyled (dark-red divider, red numbered circles via counter); app-bar logo hidden on login. All `html:root body` + `!important` to beat the Custom CSS. Pairs with new disclaimer HTML (no emojis, 4 steps) in Dashboard → Branding. Not owner-tested |
| C44 | Login button order + step size (r54). Inspect: `.readOnlyContent` (flex column) children are siblings `.btnManual`(hidden), `.btnQuick`, `#__twofactor_oidc_buttons` (inline `margin-top:14px`), `.btnForgotPassword`, `.btnSelectServer`, `.loginDisclaimerContainer`. `order`: OIDC div 1, `.btnQuick` 2, rest 3; OIDC `margin-top: 0 !important`. Visual order only, TV/keyboard focus still hits Quick Connect first. Steps 15px (mobile 16px), 12px apart. Not owner-tested |

### `netfin-classic-navbar.css`

Upstream classic-navbar v26.10.13 verbatim, plus:
- red `#ff4444` text on hover of the server-name pill
- **fix:** hides the divider after the brand pill by matching the base sheet's
  `…:has(+ .MuiButton-text)::after` selector (upstream's `content:none` lost on specificity)

---

## 4. Deploy workflow (remind the owner every time)

1. On GitHub, open the file → pencil icon → select all → paste the **complete** new file → Commit.
2. Purge the jsDelivr cache (open in a browser, wait for `"status": "finished"`):
   - `https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-jf12.css`
   - `https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-classic-navbar.css`
   - `https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-netflix.css` (if used)
3. Hard-refresh Jellyfin (Ctrl+F5); fully restart desktop/mobile apps.
4. Verify in the browser console:
   ```js
   getComputedStyle(document.documentElement).getPropertyValue('--netfin-build')
   ```
   Must return the new tag. Empty = file not loading; old tag = cache not purged (or append `?v=rN` to the
   import URL as a cache-buster).

### Owner's current Custom CSS (Dashboard → General → Custom CSS)

- Top of file (only comments may precede these):
  ```css
  @import url("https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-jf12.css");
  @import url("https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-classic-navbar.css");
  ```
- Commented-out (must stay disabled): stock NetFin, ElegantFin, ElegantFin Media Bar add-on, elegantfin-jf12.
- Below the imports, the owner has their own rules:
  - `:root` "palette bridge" defining `--ef-*` variables from NetFin tokens (fallback red #E50914)
  - Login page customisation for an **SSO / Authentik (OIDC) + Quick Connect** flow: hides username/password
    fields, 2FA/passkey buttons; styles `#__twofactor_oidc_buttons a:first-of-type` and `.btnQuick`;
    `.sso-instructions` box; glass login card; mobile spacing. **Login card/backdrop/welcome text are now controlled by C40–C42**; if a login change "doesn't apply", check these rules for duplicates first.
  - Section "11) MEDIA BAR" play-button size fix — now redundant (moved to C8), harmless.
  Don't add rules that would break the login page styling.

---

## 5. Lessons learned (don't repeat these mistakes)

| Problem | Cause | Lesson |
|---|---|---|
| Theme didn't load at all | Imports used `github.com/.../blob/...` URLs (HTML page, not CSS) | Always jsDelivr `cdn.jsdelivr.net/gh/user/repo@main/file.css` |
| First jf12 rule would be dropped | Stock NetFin ends with a stray `}` | Check brace balance whenever concatenating CSS |
| NetFin font missing in Modern layout | NetFin set font on `html`; MUI sets one on `body` | Set fonts on `body` too (C6) |
| Trailer stayed first after first C9 | `order` on `.trailer-button` had no effect — element likely wrapped / not a direct flex child | Order the row's direct children, not a guessed class |
| "Fix didn't apply" | Owner had an older copy deployed | Ask for the build tag before debugging further |
| Divider still showing in classic navbar | Upstream add-on's override had lower specificity | Compare specificity against the exact competing selector |
| Handoff said next rule was C13 / build r6, but the file already had C13–C14 and r6 | Handoff not updated after changes | Trust the attached CSS: check the highest C-number and the C10 tag before adding anything; update this brief after every change |
| r7 rank numbers spilled above the cards | `--cardWidth` contains `- .5em`; inside `::before` em = the ~160px number font, so the box collapsed | Never size a pseudo-element from em-based vars; use cqw/rem |
| r9 never loaded (console still r8) although GitHub had r9 | jsDelivr `@main` cache stayed stale after purge | If the build tag lags, pin the import to the commit SHA (`@<sha>`) instead of `@main` |
| r8–r10 numbers too small with a gap before the poster | cqw resolves against the container's content box (image width), not the padded card | Measure with getBoundingClientRect before resizing; anchor the number to the image with `right:` in cqw |
| Top 10 rows showed A–Z instead of Trakt order | KefinTweaks **Items** endpoint re-sorts by name | Use the **Custom** endpoint (see 5b) |
| Custom path `/Items?ParentId=…` gave HTTP 400 | KefinTweaks appends its own `?…` query string | Never put `?` in the Custom path; use the parent chip for the ID |
| Handoff said r21 / next C22, but the file already had r22 with C22–C23 | Brief not updated after r22 | Same lesson: check C10 and the highest C-number first; update this brief in the same change |
| Handoff said r22 / next C24, but the file was at r35 with C24–C30 | Brief not updated for r23–r35 | Same lesson again. This brief was brought up to date at r37 |
| Rank numbers cut off at the bottom after adding a fade (r38) | `mask-image` hides anything outside the element's box, and the digits overflow it | Extend the box with padding before masking (C33) |
| Rank 10 "0" fade invisible (r38–r41) | Fade stops in % of a pseudo-element box whose width wasn't known | Position mask stops in em (glyph size) or check the box width in DevTools first |
| Mobile rank numbers looked different from desktop (stray lines in 3/4/8, "10" digits only touching) | Android has no Arial Black; the fallback font has different digit shapes and widths | Tune mobile rank values separately from desktop and confirm on the owner's phone (Pixel 9); don't copy desktop em offsets to mobile |
| Rank "1"/"0" overlap: merging with `paint-order` (C26) didn't look like Netflix | Netflix's "0" sits in front of the "1" | Draw "10" as two layers (`::before` "1", `::after` "0"), C27 |
| Red rank number stuck after tapping a card on phones | `:hover` sticks to the last tapped element on touch screens | Wrap hover cancel in `@media (hover: none)` (C29c) |
| A CSS variable set on `::before` didn't reach `::after` | Pseudo-elements inherit from their element, not from each other | Put shared knobs on the card (C24 r33) |
| Rank "1" visible through the faded "0" (r42) | `mask-image` fades the fill as well as the outline, so an opaque front layer becomes see-through | To dim a digit that sits in front of another, darken it with an overlay/shadow above it (C37), don't mask it |
| Inner circle of the "0" vanished (r44) | The 0's inner counter sits right next to the poster, so any fully black end zone on the rank-10 shadow hides it | Keep the shadow below full black at the poster edge (C39) |
| Mobile login card looked solid although its transparency was lowered (r46) | Nothing behind it: PART A paints `.backgroundContainer` solid black on mobile, hiding the poster backdrop | Check what is *behind* a see-through element before changing its own opacity (C41) |
| Login welcome text never appeared (r48) | It hung off `.manualLoginForm`/`.visualLoginForm`, which this SSO server hides | Attach login decorations to the always-visible card, not the forms |
| "JELLYFLIX" overlapped "PLEASE SIGN IN" (r51) | Big text was absolutely positioned with a guessed offset/space reserved by margin; real metrics differed | Keep the large element in normal flow; only absolutely position small fixed-px items (C42d) |

---

## 5b. Top 10 rows (KefinTweaks + SmartLists) — working setup

| Row | SmartLists list | KefinTweaks query |
|---|---|---|
| Top 10 Movies Today (thumb cards) | **Playlist**, Movie, External List = `https://trakt.tv/movies/trending`, sort External List Order asc, max 10 | Endpoint **Custom**, path `/Playlists/{playlistId}/Items`, Sort By Default, Limit 10, Movie, Playlist parent chip |
| Top 10 Shows Today (thumb cards) | **Collection** (SmartLists playlists only offer Episode, not Series), Series, External List = `https://trakt.tv/shows/trending`, same sort/limit | Endpoint **Custom**, path `/Items`, Sort By Default, Limit 10, Series, Collection parent chip |

- Versions at setup: Jellyfin 12.2, SmartLists 12.0.3.0. Trakt API key set in SmartLists Settings → External Lists.
- Recreating the playlist changes its ID (update the path); recreating a KefinTweaks section changes its section ID (update every Top 10 rule that names them: C15–C18, C23–C39, and the Top 10 Carousel Fix script).

---

## 6. Optional: `netfin-netflix.css` (not deployed yet)

A separate add-on, loaded **after** `netfin-jf12.css` and **instead of** `netfin-classic-navbar.css`.
Sections N1–N8, each independent (delete a section to keep NetFin's version):

- **N1** palette: charcoal #141414/#181818, grey borders #2b2b2b, white hover tints; matching `--jf-palette-*Channel`
- **N2** font: Netflix Sans / Helvetica Neue / Segoe UI stack (overrides NetFin's `!important` font list)
- **N3** top bar: plain text links (no pills, no icons), current library bold white, brand as red uppercase wordmark
- **N4** Media Bar hero: no border, 6px radius, left + bottom vignette via `.backdrop-container::after`
  *(unverified against the plugin's real HTML)*, Netflix rating box, white Play, translucent grey
  info/favourite/Trailer buttons. Uses `#slides-container:not(#nf)` to gain ID specificity.
- **N5** row titles: sentence case, bold, no red underline or pulse
- **N6** cards: no border, no red sweep, slight darken on hover, text stays white
- **N7** white Play buttons on item pages and card overlays
- **N8** grey/white hover colours instead of red

Known limit: the hero stays an inset card. A full-bleed Netflix hero would need changes inside PART A2/B
geometry (§12) and should be done in `netfin-jf12.css` PART C, not this add-on.

---

## 7. Open issues / to-do

1. **License:** repo is GPL-3.0, but elegantfin-jf12 is GPL-2.0. Compatible only if it's "GPL-2.0 or later".
   Owner should check mihaif7's LICENSE; if GPL-2.0-only, switch the repo to GPL-2.0. (Not legal advice.)
2. **Media Bar colours not yet themed:** gold star, green separator dots, the "6 / 100" counter progress line.
   Need class names from Inspect before styling.
3. **Media Bar top gap:** add-on positions the banner using NetFin's `--appBarHeight` (5em); adjust if the gap
   under the app bar looks off.
4. **Login page (r52) needs owner confirmation** on desktop and Pixel 9: "WELCOME TO" / "JELLYFLIX" spacing (C42d)
   is estimated. Not confirmed: whether the owner's Custom CSS login rules still set a card background.
5. **Login card `backdrop-filter` set twice** in PART A (`blur(12px)` then `var(--blurDefault)`); the second wins,
   so the 12px line is dead. Remove one if the owner wants a specific blur.
6. **Login r54 (C44) not owner-tested.** Authentik now shows above Quick Connect via `order`; focus order on
   TV/keyboard is still DOM order (Quick Connect first), which can't be changed with CSS.
