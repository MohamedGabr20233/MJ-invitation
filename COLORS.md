# Colors

All colors come from the `@theme` block in `src/index.css`. Tailwind v4 has no
`tailwind.config.js` — that block *is* the config. Components name roles
(`text-primary`), never colors.

## Re-skinning for a new client

Change these three in `src/index.css`:

```css
--color-primary:   #234e70;   /* navy — type in every section */
--color-secondary: #c2a377;   /* gold — rules, icons, RSVP card */
--color-accent:    #240046;   /* plum — entry gate only */
```

Then retune the two that depend on them:

```css
--color-secondary-light: #e3d2b4;   /* lighter sibling of secondary */
--color-surface:         #f7f2ea;   /* the paper the site sits on */
```

Then replace the artwork (see below), build, and confirm nothing survives:

```bash
npm run build
grep -o "234e70\|c2a377" dist/assets/*.css   # must return nothing
```

## The tokens

| Token | Value | Used for |
|---|---|---|
| `--color-primary` | `#234e70` | navy; headings and body type in every section |
| `--color-secondary` | `#c2a377` | gold; dividers, leaf/diamond icons, RSVP card |
| `--color-secondary-light` | `#e3d2b4` | RSVP border, Yes/No toggle track |
| `--color-accent` | `#240046` | plum; gate loader bar and seal hint |
| `--color-surface` | `#f7f2ea` | site column ground |
| `--color-surface-alt` | `#fefae0` | ground behind the gate (deliberately warmer) |
| `--color-surface-raised` | `#fff` | Send button, toggle pill, envelope flash, date bars |
| `--color-on-media` | `#fff` | type over video, photos, and the gold card |
| `--color-muted` | `oklch(37.1% 0 none)` | game helper copy (Tailwind `neutral-700`) |
| `--color-scrim` | `#000` | hero video veil, fold gradient, RSVP field fills |
| `--color-highlight` | `oklch(87.9% 0.169 91.605)` | matched-card ring (Tailwind `amber-300`) |
| `--color-glow` | `#ffba5c` | lantern halo after the game is won |

Plus `--shadow-card` and `--shadow-card-lift` for card depth. Black-alpha, not
brand — leave them alone in a re-skin.

`surface-raised` and `on-media` are both `#fff` on purpose: a re-skin may want
warm-white chrome with pure-white type.

## Artwork the tokens can't reach

These carry navy/gold as baked-in pixels and must be replaced by hand:

```
frame-blue.png  roses-blue.png  RSVP.png  map-paper.png  white-paper.png
sun.png  button.png  letter-left.png  letter-right2.png  boat.jpeg
map-love.png  rapunzel-lantern-duo.png  lantern.png  lanterns.png
lantern-green.png
```

`frame-gold.png`, `frame-gold-thicc.png` and `roses-gold.png` already sit unused
in `public/` — swapping the two `src` strings in
`src/components/ui/DetailsFrame.tsx` re-skins that section with no new artwork.

Gate artwork is centralized in `src/components/gate/gateAssets.ts`. The rest is
inline in `BoatSection.tsx` and `DetailsFrame.tsx`.

The hero video (`Rapunzel-Song.mp4`) is cropped to remove a studio logo; the
crop offset is specific to that footage.

## Gotchas

- **Never write `--color-*: initial`.** It deletes Tailwind's stock palette, and
  a utility whose token is missing emits *no CSS at all* — it doesn't error, the
  element silently inherits. Missing tokens fail quietly.
- **`muted` and `highlight` must stay oklch.** v4 ships an oklch palette; the v3
  hexes (`#404040`, `#fcd34d`) are different colors. The hue channel on `muted`
  is the keyword `none`, not `0`.
- **Rename longest-match first.** Substituting `-gold` → `-secondary` corrupts
  every `-gold-light` it passes.
- **Don't fold `opacity-50` into `/50`.** The hero scrim is `bg-scrim opacity-50`.
  Element opacity also composites descendants and creates a stacking context.
- **Renaming an existing token: do it in two passes.** Move the old meaning off
  the name first so the name resolves nowhere, then introduce the new meaning. A
  missed site then renders unstyled (obvious) instead of the wrong color
  (silent). Gate the halves on `grep -c "<name>" dist/assets/*.css` returning 0.

Two places a token deliberately isn't used:

- **GSAP tweens** in `Game/GameCard.tsx` keep literal `rgba()` — GSAP parses the
  color numerically to interpolate, so `var()` breaks the tween. They mirror the
  two shadow tokens and are kept in step by hand.
- **The toggle pill's bare `shadow`** in `RsvpSection.tsx` is stock Tailwind;
  transcribing its layers by hand risks a visible change for no gain.

## Verifying

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run lint
grep -rnE -- "-(ink|gold|cream|background|white|black|neutral-|amber-)" src/
npm run build && grep -o "<old-hex>" dist/assets/*.css
```

Then walk it in the browser — these states don't exist in the static CSS:

- **Gate** — clear `invite:opened` from `sessionStorage` to replay it
- **Hero** — white type over the scrim, `♦` splitter, date divider bars
- **Timer / Details / Boat** — navy digits, gold dividers, white map badge
- **Game** — win it; the matched ring and lantern glow only appear after a win
- **RSVP** — unanswered (Send disabled), Yes, No, and a focused field
- **Widths** — 375/400/450px hit the `html` font-size breakpoints, ≥768px hits
  `md:max-w-150`
- **Reduced motion** — the gate jumps to its end states
