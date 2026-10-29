# NetFin Custom: NetFin for Jellyfin 12

A customised build of [NetFin](https://github.com/ya0903/NetFin), the red-and-black Netflix-style Jellyfin theme, updated to work with **Jellyfin 12's Modern layout**, plus a few Netflix-style extras: Top 10 rank rows and "Recently added" / "New Season" / "New Episode" badges.

Jellyfin 12 turns on the new Modern layout by default on every device except TVs. It has a new app bar, drawer, menus and player header. Stock NetFin was written for the Legacy layout, so it doesn't style any of these. This build adds full Modern layout support while keeping NetFin's colours, fonts and effects.

It combines three upstream projects into one stylesheet:

| Part | Source | Version |
|---|---|---|
| Base theme | [ya0903/NetFin](https://github.com/ya0903/NetFin) | `main` |
| Media Bar support | [lscambo13/ElegantFin](https://github.com/lscambo13/ElegantFin): Media Bar Plugin Support add-on | v26.09.05 |
| Jellyfin 12 Modern layout | [mihaif7/elegantfin-jf12](https://github.com/mihaif7/elegantfin-jf12) | v26.10.13 |

---

## Installation

### 1. Theme (CSS)

Paste this at the **very top** of **Dashboard → General → Custom CSS**. Browsers ignore an `@import` that comes after any other rule.

```css
/* NetFin for Jellyfin 12 */
@import url("https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-jf12.css");

/* Optional: shows the server name as a pill button, like the old navbar. Must come after the line above. */
@import url("https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-classic-navbar.css");
```

**Do not also load** stock NetFin, ElegantFin, the ElegantFin Media Bar add-on, or the elegantfin-jf12 companion sheet. All of them are already built into `netfin-jf12.css`, and loading them again causes conflicts.

> **Use jsDelivr links, not GitHub links.** A `github.com/.../blob/...` link returns a GitHub web page, not CSS, and the theme silently fails to load.

### 2. Optional scripts (JavaScript Injector plugin)

The two `.js` files need the **JavaScript Injector** plugin. In **Dashboard → Plugins → JavaScript Injector**, add one script per file and enable it. For each script, either:

- **paste** the whole file into the code box, or
- set **Script URL** to the jsDelivr link:

```
https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-new-badges.js
https://cdn.jsdelivr.net/gh/alleyu2/netfin-custom@main/Top_10_Carousel_Fix.js
```

> **Check the end of a pasted script before saving.** Long pastes can get cut off. A cut-off script is a syntax error, and it can stop *every* injected script from running (custom home rows disappear too). `netfin-new-badges.js` ends with an `END OF NetFin New Badges` comment, so you can see whether the whole file arrived. Loading by Script URL avoids the problem.

### Check which version is loaded

Run this in the browser console (F12) on your Jellyfin page:

```js
getComputedStyle(document.documentElement).getPropertyValue('--netfin-build')
```

It returns the build tag, for example `"2026-10-29 r21"`. If it returns nothing, the file isn't loading.

### After updating the files

jsDelivr caches `@main` links for up to about 12 hours. After each commit, open the purge links for the files you changed, then hard-refresh Jellyfin (Ctrl+F5):

```
https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-jf12.css
https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-classic-navbar.css
https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/netfin-new-badges.js
https://purge.jsdelivr.net/gh/alleyu2/netfin-custom@main/Top_10_Carousel_Fix.js
```

If the build tag still shows the old version after a purge, pin the import to the commit instead of `@main`, for example `.../netfin-custom@b99acd2/netfin-jf12.css`. A pinned link never updates on its own, so change the commit ID after every update, or switch back to `@main` later.

---

## Files

| File | Purpose |
|---|---|
| `netfin-jf12.css` | The full theme: NetFin, Media Bar support, the Jellyfin 12 Modern layout, and the fixes and extras that reconcile them |
| `netfin-classic-navbar.css` | Optional add-on that shows the server name as a pill button like the library links, instead of a logo with a divider |
| `netfin-new-badges.js` | Optional script: adds Netflix-style "Recently added", "New Season" and "New Episode \| Watch Now" badges to cards (styled by C19–C21) |
| `Top_10_Carousel_Fix.js` | Optional script for the Top 10 rows (C15–C18): fixes their carousel's return-to-start behaviour |
| `GEMINI-HANDOFF.md` | Maintenance notes for whoever (or whichever AI) edits this theme next: rules, history and lessons learned |
| `LICENSE` | GPL-3.0 |

### How `netfin-jf12.css` is organised

| Section | Contents |
|---|---|
| **PART A** | Stock NetFin, plus the colour and style settings the Jellyfin 12 layer needs |
| **PART A2** | ElegantFin Media Bar add-on v26.09.05, unmodified |
| **PART B** | elegantfin-jf12 v26.10.13, unmodified |
| **PART C** | Rules that make NetFin and the Jellyfin 12 layer work together, plus the Netflix-style extras (C1–C21) |

The load order matches what elegantfin-jf12 expects: base theme, then the Media Bar add-on, then the Jellyfin 12 sheet. PART C comes last so its fixes win.

---

## Changes from stock NetFin

### Bug fix in NetFin itself
- **Removed a stray closing brace `}` at the end of `netfin.css`.** It's harmless as the last line of a file. With more CSS after it, browsers silently drop the next rule. In this build, that would have been every Jellyfin 12 size and spacing setting.

### New settings in PART A
The Jellyfin 12 layer relies on 20 ElegantFin settings that NetFin never defined. Without them, those parts of the interface would have no colour. They're now set in NetFin's palette:

| Setting | Value |
|---|---|
| `--accentColor`, `--btnPlayColor`, `--activeBackgroundColor`, `--cardResumeProgressColor` | NetFin red `rgb(204,0,0)` |
| `--accentHoverColor` | `rgb(255,26,26)` |
| `--hoverBackgroundColor`, `--hoverTabBackgroundColor`, `--semiTransparentAccentColor` | Red tints |
| `--fullContrastColor`, `--zeroContrastColor`, `--activeTextColor` | White |
| `--dividerColor` | NetFin dark-red border |
| `--textareaBackgroundColor` | NetFin selector background |
| `--multiSelectOverlayColor`, `--cardShadow`, `--iconShadow` | Black-based shadows and overlay |
| `--fill`, `--wght`, `--grad`, `--opsz` | Icon font settings, matching NetFin's icons |

The result: the active tab, Play All, the sort/filter buttons and selected menu items are NetFin red instead of ElegantFin's indigo.

### Added: Jellyfin 12 Modern layout (PART B)
All of elegantfin-jf12 v26.10.13, unmodified. It covers:
- the app bar: height, colour change on scroll, blur, transparency over backdrops
- library links shown as pills, and the sort, filter and view buttons
- the navigation drawer, menus, popovers, dialogs and tooltips
- form controls and the focus ring
- page spacing on item and library pages, the backdrop and the login page
- the video player header and controls
- the Media Bar plugin layout
- Jellyfin Enhanced, Episodes Ratings Grid and In-Player Episode Preview plugins
- resume progress bars on Modern-layout cards
- fallbacks for Jellyfin Media Player 1.12, whose browser engine can't read some newer selectors

Every rule only targets the new Jellyfin 12 interface components, so the **Legacy and TV layouts keep stock NetFin**. The one exception is a small TV-only section.

### Added: Media Bar support (PART A2)
The ElegantFin Media Bar add-on, unmodified. It turns the banner into an inset card with NetFin's red border and rounded corners. It replaces NetFin's old banner positioning, which was written for the full-width banner.

### Reconciliation rules and extras (PART C)

| Rule | What it does |
|---|---|
| **C1** | Sets the Jellyfin 12 interface's built-in colours to NetFin's palette for every theme, including light, because NetFin is dark-only |
| **C2** | Library pills use NetFin's dark tab background and turn red (`#ff4444`) on hover |
| **C3** | Corrects spacing in the new menu drawer, where NetFin's forced sidebar rules would otherwise take over. The Legacy sidebar keeps NetFin's look. |
| **C4** | The C2 hover colour for Jellyfin Media Player 1.12 |
| **C5** | Note only: NetFin's 7px gap above the red title underline is kept on purpose |
| **C6** | Sets Rajdhani on `body`. Jellyfin 12 sets its own font there, which hid NetFin's font everywhere. |
| **C7** | Media Bar: Play button in Rajdhani instead of Inter, age rating in Share Tech Mono, active slide dot in NetFin red |
| **C8** | Media Bar: restores the plugin's own Play button size, since NetFin's item-page button rules also hit it |
| **C9** | Media Bar: buttons are ordered Play → info → favourite → Trailer on every screen size. Previously Trailer showed first because the add-on never gave it a position. |
| **C10** | Build tag `--netfin-build`, for the version check |
| **C11** | Episode pages: the episode thumbnail is larger, `min(64vh, 42vw)` instead of `40vh`. Albums keep their square cover. |
| **C12** | Item pages (desktop): the tagline and description are centred under the logo and buttons, with a readable maximum width |
| **C13** | Tooltips (e.g. "User Menu") are larger and easier to read in Rajdhani |
| **C14** | User (avatar) menu: larger text on desktop |
| **C15** | Netflix-style **Top 10 rows**: large outlined rank numbers 1–10 beside each card, turning red on hover. Applies to two KefinTweaks home rows (Top 10 Movies Today / Top 10 Shows Today), which are picked out by their section IDs. Titles wrap to two lines. |
| **C16** | Top 10 rows on desktop: smaller posters (60%), a wider space for "10", and the rows aligned with the rest of the page |
| **C17** | Top 10 rows on mobile: smaller posters (75%), a narrower number space and smaller numbers |
| **C18** | iPhone / Safari: rank numbers all showed "0", so each number is now written out per position |
| **C19** | Style for the **"Recently added" / "New Season"** badge from `netfin-new-badges.js`: a red tab centred on the bottom edge of the image, hidden on hover so it doesn't cover the Play button |
| **C20** | Split **"New Episode \| Watch Now"** badge (red + white), as on Netflix |
| **C21** | Poster cards show only the red "New Episode" half, because both halves don't fit on narrow posters |

### Netflix-style badges (`netfin-new-badges.js`)

CSS can't tell when an item was added, so this script reads it from Jellyfin and adds a badge to matching cards. It refreshes every 15 minutes and as you browse.

| Badge | When it shows |
|---|---|
| **New Season** | A show got season 2 or later in the last 14 days, and that season aired recently (within 60 days). This wins even if the whole show is new to your library. |
| **Recently added** | A movie or show was added in the last 14 days |
| **New Episode \| Watch Now** | An unwatched episode was added in the last 7 days and aired in the last 14 days. Shown on episode cards (Continue Watching, Next Up) and on the show's card. Posters show "New Episode" only. |

- **Not counted as new:** specials (season 0), upcoming placeholder episodes ("Coming Soon"), anything that hasn't aired yet, and old seasons or episodes you've only just downloaded.
- **Adjusting it:** the time limits and the badge text are settings at the top of the script.
- **Tip:** if you use Jellyfin Enhanced's rating tags, move them to the top of the card (Jellyfin Enhanced → UI Settings) so they don't collide with the badge.

### `netfin-classic-navbar.css`
Based on the elegantfin-jf12 `classic-navbar` add-on v26.10.13, plus two fixes:
- the server-name pill turns red on hover, like the other library pills
- **bug fix:** removes the thin divider line between the server-name pill and the first library pill. The main sheet's divider rule outranked the add-on's rule that was meant to hide it.

---

## Compatibility

- **Jellyfin 12**, Modern layout (desktop and mobile web)
- **Legacy and TV layouts:** stock NetFin styling (the Top 10 numbers are off on TV)
- **Jellyfin Media Player 1.12:** supported through the fallbacks in PART B
- **Plugins:** Media Bar, Jellyfin Enhanced, Episodes Ratings Grid, In-Player Episode Preview, KefinTweaks (Top 10 rows), JavaScript Injector (optional scripts)

## Updating the upstream parts

- **New elegantfin-jf12 release:** replace everything between the `PART B` heading and the `PART C` heading with the new sheet. If the release uses new colour settings, define them in PART A in NetFin red.
- **New Media Bar add-on release:** replace the single minified line in PART A2.
- **Recreated a Top 10 row in KefinTweaks?** It gets a new section ID. Update the IDs in C15–C18.
- Increase `--netfin-build` in C10 each time, so the console check shows which version is loaded.

## Credits

- **NetFin** by [ya0903](https://github.com/ya0903/NetFin): the red-and-black design
- **ElegantFin** by [lscambo13](https://github.com/lscambo13/ElegantFin): the underlying design and the Media Bar add-on
- **ElegantFin for Jellyfin 12** by [mihaif7](https://github.com/mihaif7/elegantfin-jf12): Modern layout support and the classic-navbar add-on

## License

This repository is released under **GPL-3.0**. Included components keep their own licences:

| Component | License |
|---|---|
| NetFin | MIT |
| ElegantFin (Media Bar add-on) | see the [ElegantFin repository](https://github.com/lscambo13/ElegantFin) |
| ElegantFin for Jellyfin 12 | GPL-2.0 |

The original copyright headers are kept in the CSS files.
