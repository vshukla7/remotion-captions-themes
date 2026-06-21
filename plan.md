# @vshukla7/remotion-captions-themes — Project Plan

## 1. Overview

A Remotion package that animates word-level captions over video. It exposes one
public component, `<CaptionTheme />`, which accepts a structured captions JSON,
two optional colors, and a theme name. Internally, themes are pure render
components; a shared `layout/` utils module handles text measurement, anchors,
relation-based positioning, and collision detection for the kinetic-style themes.

**Scope boundary:** this package only *animates* captions (timing, highlight,
positional movement). Font size/family/weight is supplied by the data/external
text component — this package does not own typography decisions.

---

## 2. File Structure

```
packages/remotion-captions-themes/
├── package.json                     # name: "@vshukla7/remotion-captions-themes"
├── tsconfig.json
├── src/
│   ├── index.ts                     # public exports
│   ├── CaptionTheme.tsx             # main entry component
│   ├── types.ts                     # CaptionsData, WordTiming, CaptionThemeProps
│   ├── registry.ts                  # theme name -> component map
│   │
│   ├── utils/
│   │   ├── resolveColors.ts         # primary/secondary fallback strategy
│   │   ├── useWordTiming.ts         # frame <-> word active-state hook
│   │   └── secondsToFrames.ts       # fps-aware time conversion
│   │
│   ├── layout/                       # shared layout engine (used by kinetic themes)
│   │   ├── anchors.ts               # resolveAnchors() — 9 anchor points are ext on the main big word from lines[]
│   │   ├── collision.ts             # collisionRate() — 0..1 overlap score of the small texts on main 
│   │   └── types.ts                 # LayoutBox, AnchorName, RelationSpec, TextElementSpec
│   │
│   └── themes/
│       ├── pop.tsx                     # simple entrance + highlight, no layout engine needed
│       ├── karaoke.tsx              # word-by-word fill highlight
│       ├── fadeSlide.tsx            # fade + slide-up entrance
│       ├── typewriter.tsx           # char-by-char reveal
│       ├── bounce.tsx               # spring bounce entrance
│       ├── kinetic-01.tsx           # uses layout engine — relation-based placement
│       ├── kinetic-02.tsx           # uses layout engine — different relation pattern
│       └── kinetic-03.tsx           # future kinetic themes added here directly
│
└── README.md
```

> Kinetic themes live directly inside `themes/` alongside the simple themes —
> no separate `kinetic/` subfolder. All themes share the exact same
> `CaptionThemeProps` interface and are added to `themes/` + registered in
> `registry.ts`; only the kinetic ones additionally import from `layout/`.

---

## 3. Public Component API

```tsx
<CaptionTheme
  primaryColor="#FFFFFF"     // optional
  secondaryColor="#FFD700"   // optional
  data={captionsJson}        // required — structured line/word timing JSON
  theme="kinetic-01"         // optional, defaults to "pop"
/>
```

```ts
export interface CaptionThemeProps {
  primaryColor?: string;
  secondaryColor?: string;
  data: CaptionsData;
  theme?: ThemeName;
}
```

---

## 4. Color Strategy

Both colors are **optional**. Resolution rules:

| primaryColor given | secondaryColor given | primary used | secondary used |
|:---:|:---:|:---:|:---:|
| ❌ | ❌ | `#FFFFFF` (white) | `#FFFFFF` (white) |
| ✅ | ❌ | given value | same as primary |
| ❌ | ✅ | same as secondary | given value |
| ✅ | ✅ | given value | given value |

```ts
// utils/resolveColors.ts
const DEFAULT_COLOR = "#FFFFFF";

export function resolveColors(primaryColor?: string, secondaryColor?: string) {
  if (!primaryColor && !secondaryColor) {
    return { primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR };
  }
  if (primaryColor && !secondaryColor) {
    return { primary: primaryColor, secondary: primaryColor };
  }
  if (!primaryColor && secondaryColor) {
    return { primary: secondaryColor, secondary: secondaryColor };
  }
  return { primary: primaryColor!, secondary: secondaryColor! };
}
```

`CaptionTheme` always resolves colors once at the top before passing them down
to whichever theme component is selected — individual theme files never deal
with the fallback logic themselves.

---

## 5. Caption JSON Schema (unchanged)

```json
{
  "lines": [
    {
      "words": [
        { "text": "Hello", "start": 0.0, "end": 0.32 },
        { "text": "world", "start": 0.32, "end": 0.71 }
      ]
    }
  ]
}
```

```ts
export interface WordTiming {
  text: string;
  start: number; // seconds
  end: number;   // seconds
  emphasis?: boolean;
}

export interface CaptionLine {
  words: WordTiming[];
}

export interface CaptionsData {
  lines: CaptionLine[];
}
```

---


### `anchors.ts`
```ts
export function resolveAnchors(x: number, y: number, width: number, height: number): Record<AnchorName, {x:number;y:number}>
```
Computes all 9 anchor points for a box: `center, top, bottom, left, right,
topLeft, topRight, bottomLeft, bottomRight`.

### `relations.ts`
```ts
export function resolveRelation(spec: RelationSpec, targetBox: LayoutBox, selfSize: {width:number;height:number}): {x:number;y:number}
```
Converts a semantic relation (`above | below | leftOf | rightOf | anchorTo`)
plus a target element + gap into exact `{x, y}` coordinates. This is what lets
kinetic themes describe placement relationally instead of hardcoding coordinates.

### `collision.ts`
```ts
export function collisionRate(a: LayoutBox, b: LayoutBox): number // 0..1
```
`0` = no overlap. `1` = complete overlap on the smaller box's area. Kinetic
themes can intentionally target a specific collisionRate for viral
overlapping-text effects (e.g. stacking emphasis words on top of the main word).

### `layoutEngine.ts`
```ts
export function computeLayout(elements: TextElementSpec[]): LayoutResult
```


```ts
// layout/types.ts
export type AnchorName =
  | "center" | "top" | "bottom" | "left" | "right"
  | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface FontSpec {
  family: string;
  size: number;
  weight: number | string;
  letterSpacing?: number;
}

export interface LayoutBox {
  x: number; y: number; width: number; height: number;
  anchors: Record<AnchorName, { x: number; y: number }>;
}

export type RelationType = "above" | "below" | "leftOf" | "rightOf" | "anchorTo";

export interface RelationSpec {
  type: RelationType;
  target: string;
  targetAnchor?: AnchorName;
  gap?: number;
  align?: AnchorName;
}

export interface TextElementSpec {
  id: string;
  text: string;
  font: FontSpec;
  relation?: RelationSpec;
}

export interface ComputedTextElement extends LayoutBox {
  id: string;
  text: string;
}

export interface LayoutResult {
  elements: Record<string, ComputedTextElement>;
  collisionRate: (idA: string, idB: string) => number;
}
```

---

## 7. Theme Registry

```ts
// registry.ts
import { PopTheme } from "./themes/pop";
import { KaraokeTheme } from "./themes/karaoke";
import { FadeSlideTheme } from "./themes/fadeSlide";
import { TypewriterTheme } from "./themes/typewriter";
import { BounceTheme } from "./themes/bounce";
import { Kinetic01 } from "./themes/kinetic-01";
import { Kinetic02 } from "./themes/kinetic-02";

export const themeRegistry = {
  pop: PopTheme,
  karaoke: KaraokeTheme,
  fadeSlide: FadeSlideTheme,
  typewriter: TypewriterTheme,
  bounce: BounceTheme,
  "kinetic-01": Kinetic01,
  "kinetic-02": Kinetic02,
  // kinetic-03, kinetic-04, ... added the same way, no structural changes needed
} as const;

export type ThemeName = keyof typeof themeRegistry;
```

Adding a new kinetic theme later = one new file in `themes/` + one import/line
in `registry.ts`. No changes needed anywhere else, including the consuming
main engine.

---

## 8. Animation Mechanics Reference

| Mechanism | API used | Purpose |
|---|---|---|
| Per-word entrance | `spring()` / `interpolate()` | scale/opacity/translateY pop-in |
| Active word detection | `frame` vs `word.start/end` (in frames) | switch color primary → secondary |
| Smooth clamping | `interpolate(..., {extrapolateLeft:'clamp', extrapolateRight:'clamp'})` | avoid jumpy out-of-range values |
| fps-aware timing | `useVideoConfig().fps` | convert JSON seconds → frame numbers |
| Relational placement (kinetic only) | `computeLayout()` from `layout/` | position words via above/below/leftOf/rightOf/anchorTo |
| Intentional overlap (kinetic only) | `collisionRate()` from `layout/` | controlled text-stacking for viral effect |

---

## 9. Status / Next Steps

- [x] Package name finalized: `@vshukla7/remotion-captions-themes`
- [x] Component API + optional color fallback strategy defined
- [x] Caption JSON schema defined
- [x] Layout engine utils designed (measureText, anchors, relations, collision, layoutEngine)
- [x] Theme registry pattern defined, kinetic themes kept flat inside `themes/`
- [ ] Scaffold actual package files (pending: go-ahead to write code)
- [ ] kinetic-01 / kinetic-02 specific relation patterns (pending: reference frames or written description of motion)
- [ ] Confirm ASR/JSON data source for real word timestamps
- [ ] npm publish (deferred — local workspace package for now)
