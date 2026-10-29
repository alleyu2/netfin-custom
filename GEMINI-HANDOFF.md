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
3. **Put new rules in PART C** of `netfin-jf12.css`, numbered sequentially (next is **C22**), each with a
   comment explaining *why* it exists. Do not edit PART A2 or PART B (they are verbatim upstream copies).
   Edit PART A only to fix a genuine NetFin bug, and note it.
4. **Bump the build tag** in C10 on every change to `netfin-jf12.css`:
   `:root { --netfin-build: "YYYY-MM-DD rN"; }` (current: `"2026-10-29 r21"`, so next is `r22`).
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
| `netfin-jf12.css` | **Live**, build `2026-10-29 r21`, ~6,300 lines | The full theme |
| `netfin-classic-navbar.css` | **Live** | Optional: server name as a pill like the library links |
| `README.md` | Live | Public documentation of all changes |
| `LICENSE` | GPL-3.0 | See open issue #1 in section 7 |
| `netfin-new-badges.js` | **Reference copy** (runs from JS Injector, not jsDelivr) | Creates the C19 badges |
| `netfin-netflix.css` | **Created, NOT yet deployed** | Optional Netflix-look add-on (section 6) |

### Structure of `netfin-jf12.css`

| Section | Contents | Editable? |
|---|---|---|
| Header comment | Credits and structure | Yes |
| **PART A** | Stock NetFin (header replaced; stray `}` at end removed) + a second `:root` block of 20 tokens the jf12 layer needs, inserted right after NetFin's `:root` | Bug fixes only |
| **PART A2** | ElegantFin Media Bar add-on v26.09.05, single minified line, verbatim | No (replace whole line on upgrade) |
| **PART B** | elegantfin-jf12 v26.10.13, verbatim, sections §1–§20 | No (replace whole part on upgrade) |
| **PART C** | Reconciliation rules C1–C21 (in file order C1–C4, C6, C5, C7–C21) | **Yes — all new work goes here** |

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
    `.sso-instructions` box; glass login card; mobile spacing
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

---

## 5b. Top 10 rows (KefinTweaks + SmartLists) — working setup

| Row | SmartLists list | KefinTweaks query |
|---|---|---|
| Top 10 Movies Today (thumb cards) | **Playlist**, Movie, External List = `https://trakt.tv/movies/trending`, sort External List Order asc, max 10 | Endpoint **Custom**, path `/Playlists/{playlistId}/Items`, Sort By Default, Limit 10, Movie, Playlist parent chip |
| Top 10 Shows Today (thumb cards) | **Collection** (SmartLists playlists only offer Episode, not Series), Series, External List = `https://trakt.tv/shows/trending`, same sort/limit | Endpoint **Custom**, path `/Items`, Sort By Default, Limit 10, Series, Collection parent chip |

- Versions at setup: Jellyfin 12.2, SmartLists 12.0.3.0. Trakt API key set in SmartLists Settings → External Lists.
- Recreating the playlist changes its ID (update the path); recreating a KefinTweaks section changes its section ID (update C15).

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
4. **Netflix add-on** untested on the owner's server; README has no section for it yet.
5. **Known harmless NetFin bug left as-is:** `.MuiListItem-root > a { margin: .25 .5em }` (unitless `.25`,
   ignored by browsers). Fixing it would change current spacing.

---

## 8. Upgrading upstream parts

- **New elegantfin-jf12 release:** replace everything between the `PART B` banner and the `PART C` banner with
  the new sheet. Search it for `var(--…)` names not defined in PART A (or NetFin's `:root`) and add them in NetFin
  red. Re-check C-rules that reference jf12 selectors (C2, C3, C9). Check whether the classic-navbar add-on changed.
- **New Media Bar add-on release:** replace the single line in PART A2; re-check C7–C9.
- **New NetFin release:** re-apply to PART A, keeping the stray-brace fix and the added token block.
- Bump the build tag and update README.md.
- **Cache pinning:** in r20 the owner may have pinned the `netfin-jf12.css` import to a commit SHA. If so, every update needs the SHA changed in Custom CSS (or switch back to `@main`). Check this first when a new build "doesn't apply".
