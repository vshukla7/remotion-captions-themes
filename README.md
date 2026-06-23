# remotion-captions-themes

A Remotion package containing a suite of beautiful, modern, and highly interactive caption themes. Ideal for social media reels, TikToks, YouTube shorts, and video editing pipelines.

<video src="https://limewire.com/decrypt?sharingBucketId=1d50fdd8-0383-4108-8d3c-929eb154717c&contentItemId=4faf8ae6-c304-4907-a215-1ffee65c4c0d&downloadUrl=https%3A%2F%2Fsp1.strg.com%2Flimewire%2Flmwrntwrk%2Fbuckets%2F1d50fdd8-0383-4108-8d3c-929eb154717c%2F4faf8ae6-c304-4907-a215-1ffee65c4c0d%3FX-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Date%3D20260623T082220Z%26X-Amz-SignedHeaders%3Dhost%26X-Amz-Credential%3D3HMkFzXmKJPnacuYeHAg%2F20260623%2Flmwrntwrk%2Fs3%2Faws4_request%26X-Amz-Expires%3D1800%26X-Amz-Signature%3D8287473dbe7e32bc2ef71f4523730675443c28f59f795990e0d51bd37f2692e0%26x-lmwrntwrk-request-id%3D01KVSS5FB2DYB30HR8NN3B6R3S%26x-lmwrntwrk-signature%3DIBtKLW%25252BhwMsyLdgFkyrkDwTTeS%25252FM4s85Nfe3rj5bJXHbKEllWtWQdg5dkxmT77AEa3euz%25252FbuICbkeTu%25252F6p8y9Pc%25253D%26x-max-request-count%3D10000&mediaType=video%2Fmp4&decryptionKeys=eyJhZXNHY21Kd2siOnsiYWVzS2V5VHlwZSI6IlNZTU1FVFJJQ19BRVMtR0NNX0tFWSIsImp3ayI6eyJhbGciOiJBMjU2R0NNIiwiZXh0Ijp0cnVlLCJrIjoiOEtqNnU5WTZqWUJaNkVRdGhyMmxrNWhBRXVFay1OR2Z0RUlPajRJbzJxWSIsImtleV9vcHMiOlsiZW5jcnlwdCIsImRlY3J5cHQiXSwia3R5Ijoib2N0In19LCJhZXNDdHJKd2siOnsiYWVzS2V5VHlwZSI6IlNZTU1FVFJJQ19BRVMtQ1RSX0tFWSIsImp3ayI6eyJhbGciOiJBMjU2Q1RSIiwiZXh0Ijp0cnVlLCJrIjoiOEtqNnU5WTZqWUJaNkVRdGhyMmxrNWhBRXVFay1OR2Z0RUlPajRJbzJxWSIsImtleV9vcHMiOlsiZW5jcnlwdCIsImRlY3J5cHQiXSwia3R5Ijoib2N0In19fQ" controls="controls" muted="muted" playsinline="playsinline" width="100%"></video>

*Note: This preview video is heavily compressed for fast loading on GitHub. The actual rendered animations are crystal clear and smooth.*

## Installation

```bash
npm install remotion-captions-themes
```

Note: This package requires `remotion`, `react`, and `react-dom` as peer dependencies.

## Usage

Import the `<CaptionTheme />` component and pass the required structured word-level captions JSON:

```tsx
import { CaptionTheme } from "remotion-captions-themes";

const MyComposition = () => {
  const captionsData = {
    lines: [
      {
        words: [
          { text: "Hello", start: 0.0, end: 0.5 },
          { text: "world!", start: 0.5, end: 1.0 }
        ]
      }
    ]
  };

  return (
    <CaptionTheme
      data={captionsData}
      theme="kinetic-01"
      primaryColor="#FFFFFF"
      secondaryColor="#FFD700"
      fontSize={72}
    />
  );
};
```

## API Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `CaptionsData` (required) | - | Structured line/word timing JSON |
| `theme` | `ThemeName` (optional) | `"pop"` | Name of the theme to apply |
| `primaryColor` | `string` (optional) | `"#FFFFFF"` | Base color for inactive/spoken words |
| `secondaryColor` | `string` (optional) | `"#FFFFFF"` | Accent color for the active spoken word |
| `fontSize` | `number \| string` (optional)| `72` | Responsive base font size (automatically scales with video width) |

## Available Themes (`ThemeName`)

- `"pop"`: Clean popup animation with scaling and bounce.
- `"karaoke"`: Smooth karaoke-style highlight sweep.
- `"hustle"`: Energetic, fast-paced kinetic entrance.
- `"grape"`: Rounded purple/accent boxed caption style.
- `"beast"`: Official bold highlighted style with high-contrast shadows.
- `"poppin"`: Vibrant uppercase Poppins font theme.
- `"aarit"`: Cinematic letter-by-letter zoom and gradient sweep.
- `"soft-ai"`: Frosted glass and blur-in caption typography.
- `"gaming-stream"`: Neon glowing gaming typography.
- `"simple-one-word"`: Clean, single-word focal-point highlight.
- `"kinetic-01"`: Advanced layout-calculated kinetic typography. Highlights a primary "main" word, aligns "side" words recursively without overlap using target anchors, supports filler word separation, and alternates between slide, fade, and blur animations.

## License

MIT
