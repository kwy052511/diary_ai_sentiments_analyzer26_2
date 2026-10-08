---
name: Serene Mind Journal
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#006a61'
  on-tertiary: '#ffffff'
  tertiary-container: '#38ac9f'
  on-tertiary-container: '#003a35'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  cool-50: '#F0F5FA'
  cool-100: '#E2ECF7'
  cool-200: '#C7DAEE'
  cool-800: '#1E293B'
  cool-900: '#0F172A'
  accent-sky: '#0EA5E9'
  accent-indigo: '#4F46E5'
  accent-teal: '#0D9488'
  accent-cyan: '#06B6D4'
  paper-rule: '#E2E8F0'
typography:
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
  headline-md:
    fontFamily: Noto Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Noto Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 2.25rem
  body-md:
    fontFamily: Noto Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Noto Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Noto Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
  label-sm:
    fontFamily: Noto Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 0.875rem
  badge:
    fontFamily: Noto Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 0.75rem
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-sm: 0.5rem
  margin: 1rem
  margin-sm: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
Serene Mind Journal embodies an introspective, serene, and intelligent sanctuary for emotional reflection. It bridges compassionate wellness with modern generative AI assistance. The visual language blends subtle skeuomorphic cues (such as delicate ruled journal paper lines) with a crisp, contemporary cool-toned UI inspired by Material 3 and calm productivity tools.

Key brand tenets:
- **Calm Clarity:** Soft cool blues, slate undertones, and generous breathing room soothe cognitive overload.
- **Empathetic Intelligence:** Gentle glowing accents, gradient pills, and refined micro-badges indicate AI activity without feeling cold or overly robotic.
- **Tactile Comfort:** Generous radii, soft rounded surfaces, and journal line textures evoke the familiarity of a personal physical diary.

## Colors
The palette is built around cool slate neutrals paired with calming oceanic blues and supportive teal/indigo tones.

- **Primary (`#0EA5E9`):** Vibrant sky blue used for active selections, interactive highlights, and focal interactive states.
- **Secondary (`#4F46E5`):** Deep indigo providing emotional depth, used in primary CTA gradients and date chips.
- **Tertiary (`#0D9488`):** Restorative teal employed for calm emotion markers, autosave badges, and wellness suggestions.
- **Neutrals (`#0F172A` / `#F0F5FA`):** Cool slate canvas (`#F0F5FA`) creates soft contrast against pure white cards (`#FFFFFF`), while dark slate (`#0F172A`) ensures readable, non-harsh typography.

## Typography
Typography is set universally in **Noto Sans** (with explicit Korean glyph support via Noto Sans KR). 

- **Headlines:** Displayed in weights 600–700 with snug tracking (`tracking-tight`) to project confidence and structural order.
- **Journal Body:** Set at `1rem` with an expansive line height of `2.25rem` (36px) calibrated precisely to match the background notebook line gradient spacing.
- **Labels & Microcopy:** Range between `10px` and `12px` (`0.75rem`), utilizing medium and bold weights for calendar numbers, AI badges, and timestamp indicators.

## Layout & Spacing
The layout employs a centered, reading-optimized single-column container with a maximum width of `42rem` (`max-w-2xl`).

- **Grid & Alignment:** Components within cards use balanced multi-column flex and grid structures (e.g., a 7-column calendar row and a 5-column emotion emoji matrix).
- **Rhythm:** Primary sections stack with a uniform vertical gap of `1.5rem` (`space-y-6`). Internal card padding ranges from `1rem` on compact controls to `1.5rem` on dense feedback blocks.
- **Responsive Adaptations:** Outer horizontal padding scales from `1rem` on mobile to `2rem` on desktop. Button groups flex vertically on mobile and reflow to a 3-column inline row on screens above 640px.

## Elevation & Depth
Elevation is maintained using subtle multi-stop Material 3-style shadows combined with delicate slate outlines (`border border-slate-200/80`).

- **Base Cards (Elevation 1):** `0px 1px 3px 1px rgba(15, 23, 42, 0.05), 0px 1px 2px 0px rgba(15, 23, 42, 0.08)` provides gentle lift from the tinted `#F0F5FA` background.
- **Interactive Focus & Action Cards (Elevation 2):** `0px 2px 6px 2px rgba(15, 23, 42, 0.05), 0px 1px 2px 0px rgba(15, 23, 42, 0.1)` applied to primary inputs and CTA buttons.
- **Analysis Report Card (Elevation 3):** `0px 4px 12px 3px rgba(15, 23, 42, 0.06), 0px 1px 3px 0px rgba(15, 23, 42, 0.08)` to present the resulting insights as an elevated focal layer.
- **AI Glow State:** Distinctive sky blue ambient bloom (`box-shadow: 0 0 20px -3px rgba(14, 165, 233, 0.45)`) combined with a keyframe pulse for selected AI-determined elements.

## Shapes
A pill-shaped, ultra-soft corner geometry (`roundedness: 3`) defines the friendly, approachable nature of the interface.

- **Main Cards:** Large rounded containers using `rounded-3xl` (1.5rem to 2rem).
- **Action Buttons & Inputs:** Form elements, emotion selection blocks, and buttons use `rounded-2xl` (1rem).
- **Tags, Badges & Calendar Chips:** Compact items like keyword tags, status indicators, and AI notification tags are full pills (`rounded-full`).

## Components

### Buttons
- **Primary CTA (AI Action):** Multi-stop linear gradient (`from-sky-500 via-blue-600 to-indigo-600`), white text, bold/medium weight, `rounded-2xl`, with subtle scale-down feedback on click (`active:scale-[0.98]`). Accompanied by leading spark/star glyphs.
- **Secondary / Ghost Buttons:** White or faint slate background (`#F1F5F9`), subtle border (`border-slate-200`), dark neutral text, with smooth hover transitions.

### Cards & Surfaces
- **White Sanctuary Card:** `bg-white`, `border border-slate-200/80`, `rounded-3xl`, soft M3 shadow.
- **Journal Paper Editor:** Lined surface created by `linear-gradient(transparent 95%, #E2E8F0 95%)` repeating at `2.25rem`, matching line-height to offer a tactile writing experience.

### Emotion Chips & Selector
- Grid of square-like rounded tiles (`rounded-2xl`) featuring large 28–32px emoji characters and small label captions. Selected/AI-active items receive a sky border (`border-2 border-sky-500`), subtle tinted fill (`bg-sky-50/70`), and an overlapping floating badge (`-top-2.5`).

### Chips & Badges
- **Status Pills:** Pill-shaped tags (`rounded-full`) in soft tint backgrounds (`bg-sky-100`, text `text-sky-700`) with medium typography.
- **Micro Badges:** High-contrast gradient pills used for AI tags (`text-[10px]`, `px-2.5 py-0.5`).

### Data Visualization & Highlight Panels
- **Multi-segment Emotion Bar:** Full-radius pill container (`h-3 rounded-full overflow-hidden`) divided into proportional colored spans (teal, sky, indigo).
- **Callout Blockquote:** Soft background (`bg-sky-50/60`) anchored by a thick accent left border (`border-l-4 border-sky-500`) and rounded right corners (`rounded-2xl`).