import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { InternalThemeProps } from "../types";

// Small deterministic pseudo-random generator (seeded) so the "random"
// long-word highlight choice stays stable across every frame of a line
// instead of flickering, but still varies from line to line.
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Pick which word(s) in a line get the "hero" shine treatment.
// Rule: prefer the word(s) with the most letters in the line.
// Short lines (<=4 words) get 1 highlighted word, longer lines get 2.
// Ties between equally-long words are broken with the seeded random
// so the same line composition doesn't always highlight the same word.
const getHighlightedWordIndices = (
  words: { text: string }[],
  lineSeed: number
) => {
  if (words.length === 0) return new Set<number>();

  const highlightCount = words.length <= 4 ? 1 : 2;

  const scored = words.map((w, i) => ({
    i,
    len: w.text.replace(/[^a-zA-Z0-9]/g, "").length,
    tieBreak: seededRandom(lineSeed * 97 + i * 13),
  }));

  scored.sort((a, b) => {
    if (b.len !== a.len) return b.len - a.len;
    return b.tieBreak - a.tieBreak;
  });

  return new Set(scored.slice(0, Math.min(highlightCount, words.length)).map((s) => s.i));
};

export const AaritTheme: React.FC<InternalThemeProps> = ({
  primaryColor,
  secondaryColor,
  data,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const time = frame / fps;

  // Find active line
  let activeLineIdx = 0;
  for (let i = 0; i < data.lines.length; i++) {
    const line = data.lines[i];
    if (line.words.length === 0) continue;
    const lineStart = line.words[0].start;
    const lineEnd = line.words[line.words.length - 1].end;
    if (time >= lineStart && time <= lineEnd) {
      activeLineIdx = i;
      break;
    }
    if (time > lineEnd) {
      activeLineIdx = i;
    }
  }

  const activeLine = data.lines[activeLineIdx] || data.lines[0];
  if (!activeLine || !activeLine.words.length) return null;

  // Responsive scaling
  const scaleFactor = width / 1080;
  const baseSize = typeof fontSize === "number" ? fontSize : 72;
  const scaledFontSize = `${baseSize * scaleFactor}px`;

  // Scale growth animation on the container over the course of the active line
  const lineStart = activeLine.words[0].start;
  const lineEnd = activeLine.words[activeLine.words.length - 1].end;
  const lineStartFrame = Math.round(lineStart * fps);
  const lineEndFrame = Math.round(lineEnd * fps);
  const lineDuration = Math.max(1, lineEndFrame - lineStartFrame);

  const containerScale = interpolate(
    frame - lineStartFrame,
    [0, lineDuration],
    [1.0, 1.15],
    { extrapolateRight: "clamp" }
  );

  // Words that get the colored shine + glow treatment for this line,
  // chosen by letter-count rather than by which word is being spoken.
  const highlightedWordIndices = getHighlightedWordIndices(
    activeLine.words,
    activeLineIdx
  );

  // Horizontal gap that used to live on the word wrapper now lives on
  // the last letter of each word, so spacing is a letter-level concern.
  const letterGapPx = 3 * scaleFactor;
  const wordGapPx = 14 * scaleFactor;
  // Stagger now drives only the per-letter zoom effect, not entrance.
  const letterStaggerFrames = 1.5;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "85%",
        textAlign: "center",
        transform: `scale(${containerScale}) perspective(800px)`,
        transition: "transform 0.05s ease-out",
      }}
    >
      {activeLine.words.map((word, wordIndex) => {
        const wordStartFrame = Math.round(word.start * fps);
        const isHighlighted = highlightedWordIndices.has(wordIndex);
        const isLastWord = wordIndex === activeLine.words.length - 1;

        const letters = word.text.split("");

        // Word-level entrance: the whole word slides up + fades in
        // together, timed to exactly when that word is spoken.
        const wordRelativeFrame = frame - wordStartFrame;
        const wordOpacity = interpolate(
          wordRelativeFrame,
          [0, 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const wordTranslateY = interpolate(
          wordRelativeFrame,
          [0, 10],
          [22 * scaleFactor, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={wordIndex}
            style={{
              display: "inline-flex",
              // No horizontal margin here anymore — the gap between
              // words is produced by the last letter's margin below.
              marginBottom: `${10 * scaleFactor}px`,
              opacity: wordOpacity,
              transform: `translateY(${wordTranslateY}px)`,
            }}
          >
            {letters.map((letter, letterIndex) => {
              // Per-letter zoom: each letter starts slightly "zoomed
              // out" (oversized) and eases down to its resting scale,
              // staggered letter by letter — this is the cinematic
              // "gap" effect, now decoupled from fade/slide entrance.
              const letterStartFrame =
                wordStartFrame + letterIndex * letterStaggerFrames;
              const letterRelativeFrame = frame - letterStartFrame;

              // Shine sweep effect: moves gradient background position
              // depending on frame. Runs for the whole duration a
              // highlighted word is on screen, not gated to "speaking".
              const shineSpeed = 50; // frames per sweep loop
              const shinePos = (frame % shineSpeed) * (100 / shineSpeed);
              const highlightBackground = `linear-gradient(120deg, ${secondaryColor} 35%, #ffffff 50%, ${secondaryColor} 65%)`;
              const highlightBackgroundSize = "200% 100%";
              const highlightBackgroundPosition = `${100 - shinePos * 2}% 0`;

              const restingScale = isHighlighted ? 1.12 : 1.0;
              const zoomOutScale = restingScale + 0.35; // starting "zoomed out" size
              const letterScale = interpolate(
                letterRelativeFrame,
                [0, 10],
                [zoomOutScale, restingScale],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );

              const isLastLetterOfWord = letterIndex === letters.length - 1;

              // Shadows are stronger now, and the glow always matches
              // the letter's own rendered color — secondaryColor for
              // highlighted (gradient) letters, primaryColor for
              // normal letters — instead of a flat black-only shadow.
              const glowColor = isHighlighted ? secondaryColor : primaryColor;
              const textShadow = `0 ${8 * scaleFactor}px ${18 * scaleFactor}px rgba(0,0,0,0.9), 0 0 ${30 * scaleFactor}px ${glowColor}, 0 0 ${55 * scaleFactor}px ${glowColor}99`;

              return (
                <span
                  key={letterIndex}
                  style={{
                    display: "inline-block",
                    fontFamily: '"Poppins", sans-serif',
                    fontSize: scaledFontSize,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    // Letter-level spacing: normal inter-letter gap, plus
                    // the inter-word gap added only on a word's final letter.
                    marginRight: `${letterGapPx + (isLastLetterOfWord && !isLastWord ? wordGapPx : 0)}px`,
                    transform: `scale(${letterScale})`,
                    transition: "transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
                    ...(isHighlighted
                      ? {
                          background: highlightBackground,
                          backgroundSize: highlightBackgroundSize,
                          backgroundPosition: highlightBackgroundPosition,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          filter: `drop-shadow(0 ${8 * scaleFactor}px ${9 * scaleFactor}px rgba(0,0,0,0.9)) drop-shadow(0 0 ${15 * scaleFactor}px ${glowColor}) drop-shadow(0 0 ${27 * scaleFactor}px ${glowColor}99)`,
                        }
                      : {
                          color: primaryColor,
                          textShadow,
                        }),
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};